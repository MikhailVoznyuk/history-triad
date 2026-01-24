'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

type Props = {
  images: string[];
  startIndex?: number;
  clickToNext?: boolean;
  className?: string;
  active?: boolean;
};

type Listener<T> = (e: T) => void;

class Emitter<Events extends Record<string, any>> {
  private map = new Map<keyof Events, Set<Listener<any>>>();

  on<K extends keyof Events>(name: K, fn: Listener<Events[K]>) {
    if (!this.map.has(name)) this.map.set(name, new Set());
    this.map.get(name)!.add(fn);
  }

  off<K extends keyof Events>(name: K, fn: Listener<Events[K]>) {
    this.map.get(name)?.delete(fn);
  }

  emit<K extends keyof Events>(name: K, payload: Events[K]) {
    this.map.get(name)?.forEach((fn) => fn(payload));
  }

  clear() {
    this.map.clear();
  }
}

// ---- easing (same as demo utils) ----
const easeOutSine = (t: number, b: number, c: number, d: number) => c * Math.sin((t / d) * (Math.PI / 2)) + b;

// ---- TouchTexture (ported 1:1) ----
class TouchTexture {
  parent: Particles;
  size = 64;
  maxAge = 120;
  radius = 0.15;
  trail: { x: number; y: number; age: number; force: number }[] = [];

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  texture!: THREE.Texture;

  constructor(parent: Particles) {
    this.parent = parent;
    this.initTexture();
  }

  private initTexture() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.texture = new THREE.Texture(this.canvas);

    this.canvas.id = 'touchTexture';
    this.canvas.style.width = this.canvas.style.height = `${this.canvas.width}px`;
  }

  update() {
    this.clear();

    this.trail.forEach((p, i) => {
      p.age++;
      if (p.age > this.maxAge) this.trail.splice(i, 1);
    });

    this.trail.forEach((p) => this.drawTouch(p));
    this.texture.needsUpdate = true;
  }

  private clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }
    this.trail.push({ x: point.x, y: point.y, age: 0, force });
  }

  private drawTouch(point: { x: number; y: number; age: number; force: number }) {
    const pos = { x: point.x * this.size, y: (1 - point.y) * this.size };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    else intensity = easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);

    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// ---- InteractiveControls (demo raycast + uv, fixed for element rect) ----
type InteractiveEvents = {
  'interactive-move': { object: THREE.Object3D; intersectionData: THREE.Intersection };
  'interactive-over': { object: THREE.Object3D };
  'interactive-out': { object: THREE.Object3D | null };
  'interactive-down': { object: THREE.Object3D | null; previous: THREE.Object3D | null; intersectionData: THREE.Intersection | null };
  'interactive-up': { object: THREE.Object3D | null };
};

class InteractiveControls extends Emitter<InteractiveEvents> {
  camera: THREE.Camera;
  el: HTMLElement;

  plane = new THREE.Plane();
  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();
  offset = new THREE.Vector3();
  intersection = new THREE.Vector3();

  objects: THREE.Object3D[] = [];
  hovered: THREE.Object3D | null = null;
  selected: THREE.Object3D | null = null;

  isDown = false;
  rect = { left: 0, top: 0, width: 1, height: 1 };

  intersectionData: THREE.Intersection | null = null;

  private onDownBound!: (e: MouseEvent | TouchEvent) => void;
  private onMoveBound!: (e: MouseEvent | TouchEvent) => void;
  private onUpBound!: (e: MouseEvent | TouchEvent) => void;
  private onLeaveBound!: (e: MouseEvent) => void;

  private isTouch = false;

  constructor(camera: THREE.Camera, el: HTMLElement) {
    super();
    this.camera = camera;
    this.el = el;
    this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints ?? 0) > 0;

    this.enable();
    this.resize();
  }

  enable() {
    this.addListeners();
  }

  disable() {
    this.removeListeners();
  }

  resize() {
    const r = this.el.getBoundingClientRect();
    this.rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  private addListeners() {
    this.onDownBound = this.onDown.bind(this);
    this.onMoveBound = this.onMove.bind(this);
    this.onUpBound = this.onUp.bind(this);
    this.onLeaveBound = this.onLeave.bind(this);

    if (this.isTouch) {
      this.el.addEventListener('touchstart', this.onDownBound, { passive: true });
      this.el.addEventListener('touchmove', this.onMoveBound, { passive: true });
      this.el.addEventListener('touchend', this.onUpBound, { passive: true });
    } else {
      this.el.addEventListener('mousedown', this.onDownBound);
      this.el.addEventListener('mousemove', this.onMoveBound);
      this.el.addEventListener('mouseup', this.onUpBound);
      this.el.addEventListener('mouseleave', this.onLeaveBound);
    }
  }

  private removeListeners() {
    if (this.isTouch) {
      this.el.removeEventListener('touchstart', this.onDownBound as any);
      this.el.removeEventListener('touchmove', this.onMoveBound as any);
      this.el.removeEventListener('touchend', this.onUpBound as any);
    } else {
      this.el.removeEventListener('mousedown', this.onDownBound as any);
      this.el.removeEventListener('mousemove', this.onMoveBound as any);
      this.el.removeEventListener('mouseup', this.onUpBound as any);
      this.el.removeEventListener('mouseleave', this.onLeaveBound as any);
    }
  }

  private getClientXY(e: MouseEvent | TouchEvent) {
    const t = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
    return { x: (t as any).clientX as number, y: (t as any).clientY as number };
  }

  private onMove(e: MouseEvent | TouchEvent) {
    this.resize();

    const { x, y } = this.getClientXY(e);

    const nx = ((x - this.rect.left) / this.rect.width) * 2 - 1;
    const ny = -((y - this.rect.top) / this.rect.height) * 2 + 1;

    this.mouse.set(nx, ny);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.objects, false);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.intersectionData = intersects[0];

      this.plane.setFromNormalAndCoplanarPoint((this.camera as any).getWorldDirection(this.plane.normal), object.position);

      if (this.hovered !== object) {
        this.emit('interactive-out', { object: this.hovered });
        this.emit('interactive-over', { object });
        this.hovered = object;
      } else {
        this.emit('interactive-move', { object, intersectionData: this.intersectionData });
      }
    } else {
      this.intersectionData = null;
      if (this.hovered !== null) {
        this.emit('interactive-out', { object: this.hovered });
        this.hovered = null;
      }
    }
  }

  private onDown(e: MouseEvent | TouchEvent) {
    this.resize();

    this.isDown = true;
    this.onMove(e);

    this.emit('interactive-down', { object: this.hovered, previous: this.selected, intersectionData: this.intersectionData });
    this.selected = this.hovered;

    if (this.selected) {
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
    }
  }

  private onUp(e: MouseEvent | TouchEvent) {
    this.isDown = false;
    this.emit('interactive-up', { object: this.hovered });
  }

  private onLeave(e: MouseEvent) {
    this.onUp(e);
    this.emit('interactive-out', { object: this.hovered });
    this.hovered = null;
  }

  destroy() {
    this.disable();
    this.clear();
    this.objects = [];
    this.hovered = null;
    this.selected = null;
  }
}

// ---- shaders (demo logic; glslify removed by inlining simplex noise and keeping the same function name used in source: snoise_1_2) ----
const PARTICLE_VERT = `
// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uTouch;

varying vec2 vPUv;
varying vec2 vUv;

// 2D simplex noise (Ian McEwan, Ashima Arts)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise_1_2(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

float random(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vUv = uv;

  vec2 puv = offset.xy / uTextureSize;
  vPUv = puv;

  vec4 colA = texture2D(uTexture, puv);
  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

  vec3 displaced = offset;

  displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
  float rndz = (random(pindex) + snoise_1_2(vec2(pindex * 0.1, uTime * 0.1)));
  displaced.z += rndz * (random(pindex) * 2.0 * uDepth);

  displaced.xy -= uTextureSize * 0.5;

  float t = texture2D(uTouch, puv).r;
  displaced.z += t * 20.0 * rndz;
  displaced.x += cos(angle) * t * 20.0 * rndz;
  displaced.y += sin(angle) * t * 20.0 * rndz;

  float psize = (snoise_1_2(vec2(uTime, pindex) * 0.5) + 2.0);
  psize *= max(grey, 0.2);
  psize *= uSize;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * psize;
  vec4 finalPosition = projectionMatrix * mvPosition;

  gl_Position = finalPosition;
}
`;

const PARTICLE_FRAG = `
// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
  vec4 color = vec4(0.0);
  vec2 uv = vUv;
  vec2 puv = vPUv;

  vec4 colA = texture2D(uTexture, puv);

  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
  vec4 colB = vec4(grey, grey, grey, 1.0);

  float border = 0.3;
  float radius = 0.5;
  float dist = radius - distance(uv, vec2(0.5));
  float t = smoothstep(0.0, border, dist);

  color = colB;
  color.a = t;

  gl_FragColor = color;
}
`;

// ---- Particles (ported 1:1, updated for modern three) ----
class Particles {
  webgl: WebGLView;
  container = new THREE.Object3D();

  texture!: THREE.Texture;
  width = 0;
  height = 0;
  numPoints = 0;

  object3D: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.RawShaderMaterial> | null = null;
  hitArea: THREE.Mesh | null = null;

  touch: TouchTexture | null = null;

  private handlerInteractiveMove!: (e: InteractiveEvents['interactive-move']) => void;
  private loadId = 0;

  constructor(webgl: WebGLView) {
    this.webgl = webgl;
  }

  init(src: string) {
    const id = ++this.loadId;

    const loader = new THREE.TextureLoader();
    loader.load(
        src,
        (texture) => {
          // если уже запросили другой портрет, этот результат выкидываем
          if (id !== this.loadId) {
            texture.dispose();
            return;
          }

          // на всякий случай: убираем предыдущее
          this.destroy();

          this.texture = texture;
          this.texture.minFilter = THREE.LinearFilter;
          this.texture.magFilter = THREE.LinearFilter;

          this.width = (texture.image as any).width;
          this.height = (texture.image as any).height;

          this.initPoints(true);
          this.initHitArea();
          this.initTouch();
          this.resize();
          this.show();
        },
        undefined,
        (err) => console.error('[InteractiveParticles] texture load failed:', src, err)
    );
  }


  private initPoints(discard: boolean) {
    const maxSide = 700;     // меньше = легче
    const step = 2;          // больше = меньше точек
    const density = 0.7;    // 0..1, разрядка
    const threshold = 44;    // было 34, сделай строже
    const maxParticles = 28000;

    const img = this.texture.image as HTMLImageElement;

    const s = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * s));
    const h = Math.max(1, Math.round(img.height * s));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = w;
    canvas.height = h;

    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, w, h * -1);

    const data = ctx.getImageData(0, 0, w, h).data;

    this.width = w;
    this.height = h;
    this.numPoints = w * h;

    let numVisible = 0;

    // 1) сначала считаем, сколько будет точек (чтобы правильно выделить массивы)
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        const a = data[i + 3];
        if (a < 10) continue;

        if (discard && data[i] <= threshold) continue;
        if (Math.random() > density) continue;

        numVisible++;
        if (numVisible >= maxParticles) break;
      }
      if (numVisible >= maxParticles) break;
    }

    const uniforms = {
      uTime: { value: 0 },
      uRandom: { value: 1.0 },
      uDepth: { value: 2.0 },
      uSize: { value: 0.0 },
      uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
      uTexture: { value: this.texture },
      uTouch: { value: null as any },
    };

    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      depthTest: false,
      transparent: true,
    });

    const geometry = new THREE.InstancedBufferGeometry();

    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute('position', positions);

    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXY(0, 0.0, 0.0);
    uvs.setXY(1, 1.0, 0.0);
    uvs.setXY(2, 0.0, 1.0);
    uvs.setXY(3, 1.0, 1.0);
    geometry.setAttribute('uv', uvs);

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    // ВАЖНО: pindex лучше Float32, чтобы не упереться в 65535 как у Uint16
    const indices = new Float32Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let y = 0, j = 0; y < h && j < numVisible; y += step) {
      for (let x = 0; x < w && j < numVisible; x += step) {
        const i = (y * w + x) * 4;
        const a = data[i + 3];
        if (a < 10) continue;

        if (discard && data[i] <= threshold) continue;
        if (Math.random() > density) continue;

        offsets[j * 3 + 0] = x;
        offsets[j * 3 + 1] = y;
        offsets[j * 3 + 2] = 0;

        indices[j] = j;
        angles[j] = Math.random() * Math.PI;
        j++;
      }
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));
    geometry.instanceCount = numVisible;

    this.object3D = new THREE.Mesh(geometry, material);
    this.container.add(this.object3D);
  }


  private initTouch() {
    if (!this.touch) this.touch = new TouchTexture(this);
    if (this.object3D) this.object3D.material.uniforms.uTouch.value = this.touch.texture;
  }

  private initHitArea() {
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, depthTest: false });
    material.visible = false;
    this.hitArea = new THREE.Mesh(geometry, material);
    this.container.add(this.hitArea);
  }

  private addListeners() {
    this.handlerInteractiveMove = this.onInteractiveMove.bind(this);
    this.webgl.interactive.on('interactive-move', this.handlerInteractiveMove);
    if (this.hitArea) this.webgl.interactive.objects.push(this.hitArea);
  }

  private removeListeners() {
    this.webgl.interactive.off('interactive-move', this.handlerInteractiveMove);

    if (this.hitArea) {
      const idx = this.webgl.interactive.objects.findIndex((o) => o === this.hitArea);
      if (idx >= 0) this.webgl.interactive.objects.splice(idx, 1);
    }
  }

  update(delta: number) {
    if (!this.object3D) return;
    if (this.touch) this.touch.update();
    this.object3D.material.uniforms.uTime.value += delta;
  }

  show(time = 1.0) {
    if (!this.object3D) return;

    gsap.fromTo(this.object3D.material.uniforms.uSize, { value: 0.5 }, { value: 1.5, duration: time });
    gsap.to(this.object3D.material.uniforms.uRandom, { value: 2.0, duration: time });
    gsap.fromTo(this.object3D.material.uniforms.uDepth, { value: 40.0 }, { value: 4.0, duration: time * 1.5 });

    this.addListeners();
  }

  hide(destroyAfter: boolean, time = 0.8) {
    if (!this.object3D) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap.to(this.object3D!.material.uniforms.uRandom, {
        value: 5.0,
        duration: time,
        onComplete: () => {
          if (destroyAfter) this.destroy();
          resolve();
        },
      });

      gsap.to(this.object3D!.material.uniforms.uDepth, { value: -20.0, duration: time, ease: 'power2.in' });
      gsap.to(this.object3D!.material.uniforms.uSize, { value: 0.0, duration: time * 0.8 });

      this.removeListeners();
    });
  }

  destroy() {
    if (this.object3D) {
      this.object3D.parent?.remove(this.object3D);
      this.object3D.geometry.dispose();
      this.object3D.material.dispose();
      this.object3D = null;
    }

    if (this.hitArea) {
      this.hitArea.parent?.remove(this.hitArea);
      (this.hitArea.geometry as THREE.BufferGeometry).dispose();
      (this.hitArea.material as THREE.Material).dispose();
      this.hitArea = null;
    }

    if (this.texture) {
      this.texture.dispose();
      // @ts-ignore
      this.texture = null;
    }

  }

  resize() {
    if (!this.object3D || !this.hitArea) return;
    const scale = this.webgl.fovHeight / this.height;
    this.object3D.scale.set(scale, scale, 1);
    this.hitArea.scale.set(scale, scale, 1);
  }

  private onInteractiveMove(e: InteractiveEvents['interactive-move']) {
    const uv = (e.intersectionData.uv as THREE.Vector2) || null;
    if (uv && this.touch) this.touch.addTouch({ x: uv.x, y: uv.y });
  }
}

// ---- GUIView (same idea as demo: hidden ControlKit panel toggled by "G") ----
class GUIView {
  app: App;
  private ControlKitClass: any;

  particlesHitArea = false;
  particlesRandom = 2;
  particlesDepth = 4;
  particlesSize = 1.5;

  touchRadius = 0.15;

  rangeRandom: [number, number] = [1, 10];
  rangeSize: [number, number] = [0, 3];
  rangeDepth: [number, number] = [1, 10];
  rangeRadius: [number, number] = [0, 0.5];

  controlKit: any;

  touchCanvas: HTMLCanvasElement | null = null;
  touchCtx: CanvasRenderingContext2D | null = null;

  constructor(app: App, ControlKitClass: any) {
    this.app = app;
    this.ControlKitClass = ControlKitClass;
    // не инициируем тут
  }

  toggle() {
    if (!this.controlKit) {
      this.initControlKit();
      this.disable();
    }
    if (this.controlKit._enabled) this.disable();
    else this.enable();
  }

  private initControlKit() {
    this.controlKit = new this.ControlKitClass();
    this.controlKit
      .addPanel({ width: 300, enable: false })
      .addGroup({ label: 'Touch', enable: true })
      .addCanvas({ label: 'trail', height: 64 })
      .addSlider(this, 'touchRadius', 'rangeRadius', { label: 'radius', onChange: this.onTouchChange.bind(this) })
      .addGroup({ label: 'Particles', enable: true })
      .addSlider(this, 'particlesRandom', 'rangeRandom', { label: 'random', onChange: this.onParticlesChange.bind(this) })
      .addSlider(this, 'particlesDepth', 'rangeDepth', { label: 'depth', onChange: this.onParticlesChange.bind(this) })
      .addSlider(this, 'particlesSize', 'rangeSize', { label: 'size', onChange: this.onParticlesChange.bind(this) });

    const component = this.controlKit.getComponentBy({ label: 'trail' });
    if (!component) return;

    this.touchCanvas = component._canvas as HTMLCanvasElement;
    this.touchCtx = this.touchCanvas.getContext('2d');
  }

  update() {
    if (!this.touchCanvas || !this.touchCtx) return;

    const p = this.app.webgl?.particles;
    const t = p?.touch;
    if (!t) return;

    const source = t.canvas;
    const x = Math.floor((this.touchCanvas.width - source.width) * 0.5);

    this.touchCtx.fillRect(0, 0, this.touchCanvas.width, this.touchCanvas.height);
    this.touchCtx.drawImage(source, x, 0);
  }

  enable() {
    this.controlKit.enable();
  }

  disable() {
    this.controlKit.disable();
  }

  toggle() {
    if (this.controlKit._enabled) this.disable();
    else this.enable();
  }

  private onTouchChange() {
    const p = this.app.webgl?.particles;
    if (!p?.touch) return;
    p.touch.radius = this.touchRadius;
  }

  private onParticlesChange() {
    const p = this.app.webgl?.particles;
    if (!p?.object3D || !p.hitArea) return;

    p.object3D.material.uniforms.uRandom.value = this.particlesRandom;
    p.object3D.material.uniforms.uDepth.value = this.particlesDepth;
    p.object3D.material.uniforms.uSize.value = this.particlesSize;

    (p.hitArea.material as THREE.MeshBasicMaterial).visible = this.particlesHitArea;
  }

  destroy() {
    try {
      this.controlKit?.destroy?.();
    } catch {
      // ignore
    }
  }
}

// ---- WebGLView (demo logic; adapted to container sizing) ----
class WebGLView {
  containerEl: HTMLDivElement;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  clock = new THREE.Clock(true);

  interactive!: InteractiveControls;
  particles!: Particles;

  fovHeight = 1;
  currSample: number | null = null;

  private images: string[];
  private chain = Promise.resolve();

  constructor(containerEl: HTMLDivElement, images: string[]) {
    this.containerEl = containerEl;
    this.images = images;

    this.camera.position.z = 300;

    this.renderer.domElement.style.touchAction = 'none';

    this.containerEl.appendChild(this.renderer.domElement);

    this.particles = new Particles(this);
    this.scene.add(this.particles.container);

    this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
  }

  update() {
    const delta = this.clock.getDelta();
    if (this.particles) this.particles.update(delta);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  goto(index: number) {
    if (index === this.currSample) return;

    this.currSample = index;

    this.chain = this.chain.then(() => {
      if (!this.particles.object3D) {
        this.particles.init(this.images[index]);
        return;
      }
      return this.particles.hide(true).then(() => this.particles.init(this.images[index]));
    });
  }

  next() {
    if (this.currSample == null) return;
    if (this.currSample < this.images.length - 1) this.goto(this.currSample + 1);
    else this.goto(0);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.fovHeight = 2 * Math.tan(((this.camera.fov * Math.PI) / 180) / 2) * this.camera.position.z;

    this.renderer.setSize(width, height, false);

    this.interactive.resize();
    this.particles.resize();
  }

  destroy() {
    this.interactive.destroy();
    this.particles.destroy();
    this.scene.clear();

    this.renderer.dispose();
    this.renderer.forceContextLoss?.();

    const canvas = this.renderer.domElement;
    canvas.parentElement?.removeChild(canvas);
  }
}

// ---- App (demo structure: webgl + gui + listeners + RAF) ----
class App {
  webgl!: WebGLView;
  gui!: GUIView;

  private raf = 0;

  private onResizeBound!: () => void;
  private onKeyUpBound!: (e: KeyboardEvent) => void;
  private onClickBound!: () => void;

  private ro: ResizeObserver | null = null;

  constructor(private containerEl: HTMLDivElement, images: string[], private startIndex: number | null, private clickToNext: boolean, ControlKitClass: any) {
    this.webgl = new WebGLView(containerEl, images);
    this.gui = new GUIView(this, ControlKitClass);

    if (this.startIndex != null) this.webgl.goto(this.startIndex);

    this.addListeners();
    this.resize();
    this.animate();
  }

  setClickToNext(v: boolean) {
    this.clickToNext = v;
  }

  private addListeners() {
    this.onResizeBound = this.resize.bind(this);
    this.onKeyUpBound = this.keyup.bind(this);
    this.onClickBound = this.click.bind(this);

    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('keyup', this.onKeyUpBound);
    this.webgl.renderer.domElement.addEventListener('click', this.onClickBound);

    this.ro = new ResizeObserver(this.onResizeBound);
    this.ro.observe(this.containerEl);
  }

  private removeListeners() {
    window.removeEventListener('resize', this.onResizeBound);
    window.removeEventListener('keyup', this.onKeyUpBound);
    this.webgl.renderer.domElement.removeEventListener('click', this.onClickBound);

    this.ro?.disconnect();
    this.ro = null;
  }

  private running = false;

  start() {
    if (this.running) return;
    this.running = true;
    this.webgl.clock.start();
    this.animate();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private animate = () => {
    if (!this.running) return;
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.animate);
  };

  private update() {
    this.webgl.update();
    this.gui.update();
  }

  private draw() {
    this.webgl.draw();
  }

  private resize() {
    const r = this.containerEl.getBoundingClientRect();
    this.webgl.resize(Math.max(1, r.width), Math.max(1, r.height));
  }

  private keyup(e: KeyboardEvent) {
    // demo: press "G" to toggle controlKit panel
    if (e.keyCode === 71) this.gui.toggle();
  }

  private click() {
    if (this.clickToNext) this.webgl.next();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.removeListeners();
    this.gui.destroy();
    this.webgl.destroy();
  }
}

export function InteractiveParticles({ images, startIndex, clickToNext = true, className, active}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<App | null>(null);

  // init ONCE
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    (async () => {
      const mod = await import('@brunoimbrizi/controlkit');
      if (cancelled) return;
      const ControlKitClass = (mod as any).default || (mod as any);

      const app = new App(el, images, null, clickToNext, ControlKitClass);
      appRef.current = app;

      if (startIndex != null) {
        const idx = Math.max(0, Math.min(images.length - 1, startIndex));
        app.webgl.goto(idx);
      }

      if (active === false) app.stop();
      else app.start();
    })();

    return () => {
      cancelled = true;
      appRef.current?.destroy();
      appRef.current = null;
    };
    // ВАЖНО: пустые deps, чтобы App не пересоздавался
  }, []);

  // react to startIndex changes without remount
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    if (startIndex != null) {
      const idx = Math.max(0, Math.min(images.length - 1, startIndex));
      app.webgl.goto(idx);
    }
  }, [startIndex]);

  // react to clickToNext changes
  useEffect(() => {
    appRef.current?.setClickToNext(clickToNext);
  }, [clickToNext]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (active === false) app.stop();
    else app.start();
  }, [active]);

  return <div ref={ref} className={className} />;
}

export default InteractiveParticles;
