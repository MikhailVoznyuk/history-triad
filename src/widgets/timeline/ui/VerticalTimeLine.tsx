import {useState, useRef, useEffect} from "react";
import {motion, useInView} from "framer-motion";
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
    const [progress, setProgress] = useState<number>(0);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            <div className="relative w-screen max-w-[1200px] mx-auto flex justify-center items-center gap-24 px-6">
                <div className="flex flex-col gap-72 w-fit">
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
                <div className={`relative w-10 flex justify-center items-center h-screen grow-0 overflow-hidden ${styles.fadeY}`}>
                    <div className="sticky h-full top-0">
                        <div className="absolute rounded-xl bg-cloud w-1 h-full top-0" />

                    </div>

                </div>
            </div>
        </section>
    )
}

