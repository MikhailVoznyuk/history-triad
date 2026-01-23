type InitCfg = {
    maxSide: number;
    step: number;
    density: number;
    threshold: number;
    maxParticles: number;
    alphaMin: number;
};

type Req = { src: string; cfg: InitCfg; discard: boolean };

self.onmessage = async (ev: MessageEvent<Req>) => {
    const { src, cfg, discard } = ev.data;

    const res = await fetch(src);
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob);

    const s = Math.min(1, cfg.maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * s));
    const h = Math.max(1, Math.round(bmp.height * s));

    const c = new OffscreenCanvas(w, h);
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(bmp, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;

    // pass 1: count
    let numVisible = 0;
    for (let y = 0; y < h; y += cfg.step) {
        for (let x = 0; x < w; x += cfg.step) {
            const i = (y * w + x) * 4;
            const a = data[i + 3];
            if (a < cfg.alphaMin) continue;

            if (discard && data[i] <= cfg.threshold) continue;
            if (Math.random() > cfg.density) continue;

            numVisible++;
            if (numVisible >= cfg.maxParticles) break;
        }
        if (numVisible >= cfg.maxParticles) break;
    }

    const indices = new Float32Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    // pass 2: fill
    for (let y = 0, j = 0; y < h && j < numVisible; y += cfg.step) {
        for (let x = 0; x < w && j < numVisible; x += cfg.step) {
            const i = (y * w + x) * 4;
            const a = data[i + 3];
            if (a < cfg.alphaMin) continue;

            if (discard && data[i] <= cfg.threshold) continue;
            if (Math.random() > cfg.density) continue;

            offsets[j * 3 + 0] = x;
            offsets[j * 3 + 1] = y;
            offsets[j * 3 + 2] = 0;

            indices[j] = j;
            angles[j] = Math.random() * Math.PI;
            j++;
        }
    }

    (self as any).postMessage(
        { w, h, numVisible, indices, offsets, angles },
        [indices.buffer, offsets.buffer, angles.buffer]
    );
};
