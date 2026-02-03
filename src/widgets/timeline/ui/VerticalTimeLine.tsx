import {useEffect,useLayoutEffect, useMemo, useRef, useState} from "react";
import {useMotionValueEvent, useScroll, useTransform} from "framer-motion";
import {twMerge} from "tailwind-merge";
import {Title} from "@/shared/ui/text-blocks";
import {TimelineBlock} from "@/widgets/timeline/ui/TimeLineBlock";
import {TimelineMark} from "@/widgets/timeline/ui/TimeLineMark";
import type {TimeLineItem} from "@/widgets/timeline/model/types";

type Props = {
    title?: string;
    items: TimeLineItem[];
    className?: string;
}

function DesktopTimeLine({items}: {items: TimeLineItem[]}) {
    const [active, setActive] = useState(-1);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const {scrollYProgress} = useScroll({
        target: wrapRef,
        offset: ["start end", "end end"],
    });

    const timelineProgress = useTransform(scrollYProgress, (p) => p * 100);

    useMotionValueEvent(scrollYProgress, "change", (p) => {
        const el = wrapRef.current;
        if (!el) return;
        el.style.setProperty("--tl-p", `${p * 100}%`);
    });

    return (
        <div ref={wrapRef} className="relative w-full max-w-[1200px] mx-auto flex justify-center gap-24 px-6">
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

            <div className="relative w-8 flex justify-center">
                <div className="sticky h-screen w-2 top-0 py-10">
                    <div className="relative h-full w-full rounded-xl mask-fade-y">
                        <div className="absolute rounded-xl bg-cloud w-full h-full top-0" />
                        <div
                            className="absolute rounded-xl bg-gold w-full top-0 mask-fade-bottom-1"
                            style={{height: "var(--tl-p)", boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.4)"}}
                        />
                    </div>
                </div>

                <div className="absolute left-0 top-0 h-screen w-full">
                    <div className="relative size-full">
                        {items.map((item, idx) => {
                            const top = `calc(${idx * 50}vh + ${290 * idx}px + ${290 / 2}px - ${20}px)`;
                            return (
                                <TimelineMark
                                    key={`m-${item.id}`}
                                    tp={timelineProgress}
                                    top={top}
                                    year={item.year}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MobileTimeLine({items}: {items: TimeLineItem[]}) {
    const [active, setActive] = useState(0);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const maxXRef = useRef(0);

    const scrollHeightVh = useMemo(() => {
        const n = Math.max(items.length, 1);
        return 100 + (n - 1) * 60;
    }, [items.length]);

    const {scrollYProgress} = useScroll({
        target: wrapRef,
        offset: ["start start", "end end"],
    });

    useLayoutEffect(() => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;

        const calc = () => {
            maxXRef.current = Math.max(0, track.scrollWidth - stage.clientWidth);
        };

        const ro = new ResizeObserver(calc);
        ro.observe(stage);
        ro.observe(track);

        requestAnimationFrame(calc);

        return () => ro.disconnect();
    }, [items.length]);

    useMotionValueEvent(scrollYProgress, "change", (p) => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;

        stage.style.setProperty("--tl-p", `${p * 100}%`);

        const x = maxXRef.current * p;
        track.style.transform = `translate3d(${-x}px, 0, 0)`;

        const idx = Math.round(p * (items.length - 1));
        setActive((prev) => (prev === idx ? prev : idx));
    });

    return (
        <div ref={wrapRef} className="relative w-full" style={{height: `${scrollHeightVh}vh`}}>
            <div ref={stageRef} className="sticky top-6 h-screen overflow-hidden">
                <div className="absolute left-6 right-6 top-[14px] h-1 z-0">
                    <div className="relative h-full w-full rounded-xl">
                        <div className="absolute inset-0 rounded-xl bg-cloud" />
                        <div
                            className="absolute left-0 top-0 h-full rounded-xl bg-gold"
                            style={{width: "var(--tl-p)", boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.4)"}}
                        />
                    </div>
                </div>

                <div
                    ref={trackRef}
                    className="absolute left-0 top-0 flex gap-10 px-6 pt-0 will-change-transform"
                    style={{transform: "translate3d(0, 0, 0)"}}
                >
                    {items.map((item, idx) => {
                        const isReached = idx <= active;
                        return (
                            <div key={item.id} className="shrink-0 w-[280px] flex flex-col items-center">
                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className="rounded-full size-8"
                                        style={{
                                            backgroundColor: isReached ? "#E7C765" : "#D9D9D9",
                                            transition: "0.2s opacity ease-in-out, 0.2s background-color ease-in-out",
                                        }}
                                    />
                                    <Title
                                        lineNeeded={false}
                                        isCentered={true}
                                        titleClassName="font-cormorant text-cloud text-2xl font-bold mt-2 whitespace-nowrap"
                                    >
                                        {item.year}
                                    </Title>
                                </div>

                                <div className="mt-8">
                                    <TimelineBlock
                                        idx={idx}
                                        item={item}
                                        activeIdx={active}
                                        onActive={() => {}}
                                        observe={false}
                                        isMobile
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function VerticalTimeLine({title, items, className = ""}: Props) {
    return (
        <section className={twMerge("flex flex-col items-center gap-12 sm:gap-24 my-32", className)}>
            {title && <Title isCentered={true}>{title}</Title>}

            <div className="hidden sm:block w-full">
                <DesktopTimeLine items={items} />
            </div>

            <div className="block sm:hidden w-full">
                <MobileTimeLine items={items} />
            </div>
        </section>
    );
}
