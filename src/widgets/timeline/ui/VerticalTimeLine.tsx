import {useState, useRef, useEffect} from "react";
import {useScroll, useMotionValueEvent} from "framer-motion";
import {animate} from "animejs";
import {twMerge} from "tailwind-merge";
import {Title} from "@/shared/ui/text-blocks";
import {TimelineBlock} from "@/widgets/timeline/ui/TimeLineBlock";
import styles from "./verticalTimeline.module.css"
import type {TimeLineItem} from "@/widgets/timeline/model/types";


type Props = {
    title?: string;
    items: TimeLineItem[];
    className?: string;
}

export function VerticalTimeLine({title, items, className=''}: Props) {
    const [active, setActive] = useState(-1);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

    const {scrollYProgress} = useScroll(
        {
            target: wrapRef,
            offset: ["start end", "end end"],
        }
    )

    useMotionValueEvent(
        scrollYProgress,
        "change",
        (p) => {
            const el = wrapRef.current;
            if (!el) return;
            console.log(p);
            el.style.setProperty("--tl-p", `${p * 100}%`);
        }
    )

    useEffect(() => {
        const el = nodeRefs.current[active];
        if (!el) return;
        animate(
            el,
            {
                scale: [1, 1.18, 1],
                duration: 450,
                ease: 'easeInOut',
            }
        )
    }, [active]);

    return (
        <section className={twMerge("flex flex-col items-center gap-24", className)}>
            {title && <Title isCentered={true}>{title}</Title>}
            <div ref={wrapRef} className="relative w-screen max-w-[1200px] mx-auto flex justify-center gap-24 px-6">
                <div className="flex flex-col gap-[50vh] w-fit">
                    {items.map((item, index) => (
                        <TimelineBlock
                            key={item.id}
                            idx={index}
                            item={item}
                            activeIdx={active}
                            onActive={(i) => setActive(i)}
                        />
                    ))}
                </div>
                <div className={`relative w-8 flex justify-center`}>
                    <div className={`sticky h-screen w-2 top-0 py-10`}>
                        <div className="relative h-full w-full  mask-fade-y">

                            <div className="absolute rounded-xl bg-cloud w-full h-full top-0" />
                            <div className="absolute rounded-xl bg-gold w-full top-0 mask-fade-bottom-1"
                                 style={{height: "var(--tl-p)", boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.4)"}}

                             />
                        </div>
                    </div>
                    <div className="absolute left-0 top-0 h-screen w-full">
                        <div className="relative size-full">
                            {items.map((item, idx) => {
                                console.log(active)
                                const top = `calc(${idx * 50}vh + ${290 * idx}px + ${290 / 2}px)`
                                return (
                                    <div key={item.id} className="absolute left-0 flex gap-4 items-center" style={
                                        {
                                            top,
                                            opacity: (idx <= active) ? 1 : 0,
                                            transition: '0.3s ease-in-out',
                                        }}
                                    >
                                        <div className="rounded-full size-8 bg-cloud ">
                                        </div>
                                        <Title titleClassName="font-cormorant text-5xl font-bold mb-1" isCentered={true}>{item.year}</Title>
                                    </div>
                                )
                            })}

                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}

