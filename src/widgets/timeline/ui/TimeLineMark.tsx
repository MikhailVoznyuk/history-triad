import {useState, useEffect, useRef} from "react";
import {useInView, useScroll, useMotionValueEvent} from "framer-motion";
import {Title} from "@/shared/ui/text-blocks";
import {useViewportY} from "@/shared/lib/hooks";
import type {MotionValue} from "motion";


type TimelineMarkProps = {
    tp: MotionValue<number>,
    top: string;
    year: string;
}

export function TimelineMark({top, year, tp}: TimelineMarkProps) {

    const [hit, setHit] = useState<boolean>(false);


    const markRef = useRef<HTMLDivElement | null>(null);

    const inView = useInView(
        markRef,
        {
            margin: "-50px 0% -50px 0%",
            amount: "all"
        }
    )

    const {vp, vpRef} = useViewportY(markRef, 50, inView);

    useEffect(() => {
        const el = markRef.current;
        if (!el) return;
        el.style.setProperty("--mark-circle-color", "#D9D9D9");
        if (!inView) {
            el.style.setProperty("--mark-dist", "0");
        }
    }, [inView]);

    useMotionValueEvent(
        tp,
        "change",
        (p) => {
            const el = markRef.current;
            if (!el) return;

            if (!inView) return;

            const v = vpRef.current;
            const fadeEdge = 20;
            const spread = 0;
            let o = 1;
            if (v <= fadeEdge) {
                o = Math.max(v / fadeEdge - spread, 0);

            } else if (v >= 100 - fadeEdge) {
                o = Math.max(100 - v - spread, 0) / fadeEdge;
            }

            el.style.setProperty("--mark-dist", `${o}`);
            // (v <= fadeEdge || v >= 100 - fadeEdge) ? v % fadeEdge / 100 : 1;
            if (vpRef.current <= p) {
                el.style.setProperty("--mark-circle-color", "#E7C765");
            } else {
                el.style.setProperty("--mark-circle-color", "#D9D9D9");
            }

        }
    )

    return (
        <div ref={markRef} className="absolute left-0 flex gap-4 items-center h-10 w-fit " style={
            {
                top,
                opacity: "var(--mark-dist)",
            }}
        >
            <div className="rounded-full size-8 shrink-0"
            style={{
                backgroundColor: "var(--mark-circle-color)",
                transition: '0.2s opacity ease-in-out',
            }}>
            </div>
            <Title titleClassName="font-cormorant text-3xl font-bold mb-1 whitespace-nowrap" isCentered={true}>{year}</Title>
        </div>
    )
}