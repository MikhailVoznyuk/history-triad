import {makeTimeline, animeUtils} from "@/shared/lib/anime";
import {Position} from "@/widgets/header/lib/usePositions";
import type {TL} from "@/shared/lib/anime"


type MovePosition = {x: number, y: number}

const rad = (deg: number): number => deg * Math.PI / 180;
const mod360 = (deg: number) => ((deg % 360) + 360) % 360;

function bez2(p0: MovePosition, p1: MovePosition, p2: MovePosition, t: number) {
    const u = 1 - t
    return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    }
}

export function initPosition(
    el: HTMLDivElement | null,
    tl: TL,
    from: Position,
    to: Position,
    dur = 660,
    n = 100,
    bend = 0.8,
    ease = "linear"
) {
    if (!el) return tl

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;

    const px = -dy / len;
    const py = dx / len;

    const b = len * bend;
    const c = {
        x: (from.x + to.x) / 2 + px * b,
        y: (from.y + to.y) / 2 + py * b,
    }

    const step = dur / n;
    const frames = Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / n
        const p = bez2(from, c, to, t)
        return {
            translateX: p.x,
            translateY: p.y,
            duration: step,
            ease,
        }
    })

    tl.add(el, { keyframes: frames }, 0)
    return tl
}

export function initCircle(
    el: HTMLDivElement | null,
    dur: number = 800,
    ease: string = "outQuad",
) {
    if (!el) return;

    const tl = makeTimeline({autoplay: true});
    tl.set(el, {
        scale: 0,
        transformOrigin: "50% 50%"
    }).add(
        el,
        {
            scale: 1,
            duration: dur,
            ease,
        }
    )
}

export function linearMove(

    el: HTMLDivElement | null,
    tl: TL,
    from: Position,
    to: Position,
    dur: number =  500,
    offset: number = 0,
    scale: number = 1,
    ease: string = "outQuad",
) {
    if (!el) return;

    tl.add(
        el,
        {
            translateX: to.x,
            translateY: to.y,
            duration: dur,
            scale,
            ease,
        },
        `-=${offset}`

    )

    return tl;
}

export function arcCW(
    el: HTMLDivElement | null,
    tl: TL,
    from: Position,
    to: Position,
    R: number,
    offset: number = 0,
    dur: number = 500,
    ease: string = "inOutQuad",
) {

    if (!el) return;

    const delta = mod360(to.ang - from.ang);
    const st = {a: from.ang};

    tl.add(
        st,
        {
            a: from.ang + delta,
            duration: dur,
            ease,
            onUpdate: () => {
                const a = rad(st.a);
                animeUtils.set(
                    el,
                    {
                        translateX: R * Math.cos(a),
                        translateY: R * Math.sin(a),
                    }
                )

            }
        },
        `-=${offset}`
    )
}

export function changeOpacity(el: HTMLDivElement | null, tl: TL, opacity: number = 0, dur: number = 500, ease: string = "inOutQuad") {
    if (!el) return;

    tl.add(
        el,
        {
            opacity,
            duration: dur,
            ease,
        }
    )

    return tl;
}


export function customTranslate(el: HTMLDivElement | null, tl: TL, x: number, y: number, dur: number = 500, ease: string = "inOutQuad") {
    if (!el) return;

    tl.add(
        el,
        {
            translateX: x,
            translateY: y,
            duration: dur,
            ease,
        }
    )

    return tl;
}