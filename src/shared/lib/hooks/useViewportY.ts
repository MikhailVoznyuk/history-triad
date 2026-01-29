import React from 'react';
import { useEffect, useState, useRef} from 'react'

export function useViewportY(ref: React.RefObject<HTMLElement | null>, offsetY: number, enabled: boolean) {
    const [vp, setVp] = useState<number>(0);
    const vpRef = useRef<number>(0);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const el = ref?.current;
        if (!el || !enabled) return;

        const calc = () => {
            raf.current = null;
            const hv = (window.innerHeight - offsetY * 2) || 0;
            const rect = el.getBoundingClientRect();

            const y = rect.top + rect.height / 2 - offsetY;
            let v = y / hv * 100;

            if (v > 100) {
                v = 100;
            } else if (v < 0) {
                v = 0;
            }

            vpRef.current = v;
            setVp((prev) => Math.abs(v - prev) > 0.6? v : prev);
        }

        const onScroll = () => {
            if (raf.current) return;
            raf.current = requestAnimationFrame(calc);
        }

        window.addEventListener('scroll', onScroll, {passive: true});
        window.addEventListener('resize', calc);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', calc);

            if (raf.current) cancelAnimationFrame(raf.current);
        }
    }, [ref, enabled, offsetY]);

    return {vp, vpRef};
}