import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, LayoutGroup, motion, useReducedMotion} from "framer-motion";
import {twMerge} from "tailwind-merge";
import {Title} from "@/shared/ui/text-blocks";

export type GalleryItem = {
    id: string;
    src: string;
    alt?: string;
    caption?: string;
};

type Props = {
    items: GalleryItem[];
    title?: string;
    className?: string;
    autoMs?: number;
    heightClassName?: string;
};

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

function useVisibleCount() {
    const [c, setC] = useState(3);

    useEffect(() => {
        const f = () => {
            const w = window.innerWidth;
            if (w < 640) setC(1);
            else if (w < 1024) setC(2);
            else setC(3);
        };
        f();
        window.addEventListener("resize", f, {passive: true});
        return () => window.removeEventListener("resize", f);
    }, []);

    return c;
}

export function Gallery({
                            items,
                            title,
                            className = "",
                            autoMs = 3500,
                            heightClassName = "h-[320px] sm:h-[360px] lg:h-[420px]",
                        }: Props) {
    const n = items.length;
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);
    const vis = useVisibleCount();
    const reduce = useReducedMotion();

    const maxStart = Math.max(0, n - vis);
    const start = useMemo(() => {
        const center = Math.floor(vis / 2);
        return clamp(active - center, 0, maxStart);
    }, [active, vis, maxStart]);

    const stepPct = 100 / Math.max(1, vis);
    const translatePct = -(start * stepPct);

    const next = () => setActive((i) => (i + 1) % Math.max(1, n));
    const prev = () => setActive((i) => (i - 1 + Math.max(1, n)) % Math.max(1, n));

    useEffect(() => {
        if (!n) return;
        if (open) return;
        if (reduce) return;

        const id = window.setInterval(() => {
            setActive((i) => (i + 1) % n);
        }, autoMs);

        return () => window.clearInterval(id);
    }, [n, open, autoMs, reduce]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, n]);

    if (!n) return null;

    const cur = items[active];

    return (
        <section className="flex flex-col items-center gap-24">
            {title && (
                <Title  isCentered={true}>{title}</Title>
            )}
            <LayoutGroup id="gallery">
                <div className={twMerge("w-full", className)}>
                    <div className={twMerge("relative overflow-hidden rounded-2xl bg-black/5", heightClassName)}>
                        <motion.div
                            className="absolute inset-0 flex"
                            animate={{x: `${translatePct}%`}}
                            transition={{type: "tween", duration: 0.45}}
                        >
                            {items.map((it, idx) => (
                                <div
                                    key={it.id}
                                    className="relative h-full shrink-0"
                                    style={{width: `${stepPct}%`}}
                                >
                                    <button
                                        type="button"
                                        onClick={() => { setActive(idx); setOpen(true); }}
                                        className={twMerge(
                                            "relative h-full w-full p-2",
                                            idx === active ? "opacity-100" : "opacity-80 hover:opacity-100"
                                        )}
                                    >
                                        <motion.img
                                            layoutId={`img-${it.id}`}
                                            src={it.src}
                                            alt={it.alt ?? ""}
                                            className="h-full w-full rounded-xl object-cover"
                                            draggable={false}
                                        />
                                    </button>
                                </div>
                            ))}
                        </motion.div>

                        <div className="absolute bottom-3 left-3 z-10 flex gap-2">
                            <button
                                type="button"
                                onClick={prev}
                                className="rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                aria-label="Prev"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                className="rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                aria-label="Next"
                            >
                                ›
                            </button>
                        </div>

                        <div className="absolute bottom-3 right-3 z-10">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                aria-label="Fullscreen"
                            >
                                ⤢
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        {items.map((it, idx) => (
                            <button
                                key={it.id}
                                type="button"
                                onClick={() => setActive(idx)}
                                className={twMerge(
                                    "h-2.5 w-2.5 rounded-full transition-opacity",
                                    idx === active ? "bg-black/80 opacity-100" : "bg-black/40 opacity-60 hover:opacity-100"
                                )}
                                aria-label={`Go to ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 sm:p-6 lg:p-10"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                onClick={() => setOpen(false)}
                            >
                                <motion.div
                                    className="relative w-full max-w-6xl"
                                    initial={{scale: 0.98}}
                                    animate={{scale: 1}}
                                    exit={{scale: 0.98}}
                                    transition={{duration: 0.2}}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="absolute right-0 top-0 z-10 rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>

                                    <motion.img
                                        layoutId={`img-${cur.id}`}
                                        src={cur.src}
                                        alt={cur.alt ?? ""}
                                        className="max-h-[80vh] w-full rounded-2xl object-contain bg-black/30"
                                        draggable={false}
                                    />

                                    <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl bg-black/55 px-3 py-2 text-sm text-white backdrop-blur">
                                        {cur.caption ?? cur.alt ?? ""}
                                    </div>

                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={prev}
                                            className="rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                            aria-label="Prev (overlay)"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            onClick={next}
                                            className="rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                                            aria-label="Next (overlay)"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGroup>
        </section>

    );
}