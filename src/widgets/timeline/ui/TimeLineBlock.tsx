import {useState, useRef, useEffect} from "react";
import {useInView} from "framer-motion";
import {Title, TextBlock} from "@/shared/ui/text-blocks";
import {ArrowBtn} from "@/shared/ui/buttons";
import type {TimeLineItem} from "@/widgets/timeline/model/types";

export type TimeLineProps = {
    item: TimeLineItem;
    idx: number;
    activeIdx: number;
    onActive: (idx: number) => void;
    observe?: boolean;
    isMobile?: boolean;
}

export function TimelineBlock({item, idx, activeIdx, onActive, observe=true, isMobile=false}: TimeLineProps) {
    const [opened, setOpened] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, {margin: "0% 0% 0% 0%", amount: (isMobile) ? 0.3 : "all"}); //{margin: "-30% 0% -45% 0%", amount: 0.5})

    const isTextCropped = item.text.length > 198;

    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (!observe) return;
        if (inView) onActive(idx);
    }, [observe, inView, idx, onActive]);

    return (
        <div className={`relative h-[260px] sm:h-[290px] w-fit`}>
            <div className={`w-[280px] sm:w-[500px] ${opened ? "h-fit" : "h-[260px] sm:h-[290px]"} flex flex-col gap-4 font-cormorant p-4 shadow-md rounded-xl`}
                 ref={ref}
                 style={{
                     opacity: `${idx > activeIdx ? 0 : 1} `,
                     background: 'rgba(0, 0, 0, 0.34)',
                     transition:  '0.3s ease-in-out',
                     backdropFilter: 'blur(6px)',
                     border: '1px solid rgba(211, 211, 211, 0.5)'
                 }}
            >
                <div
                    className={`${opened ? '' : 'h-40 sm:h-48'} flex flex-col gap-3 ${opened ? '' : 'mask-fade-bottom-3'} overflow-hidden`}
                    style={{
                        transition: "0.3s ease-in-out"
                    }}
                >
                    <Title titleClassName="text-xl sm:text-2xl text-gold" lineColor={'#D9D9D9'}>{item.title}</Title>
                    <TextBlock className={`text-base h-full max-h-96 sm:max-h-none sm:text-lg ${opened ? "overflow-scroll" : "overflow-hidden"}`}>{item.text}</TextBlock>
                </div>
                {isTextCropped && (
                    <div className="flex w-full justify-end">
                        <ArrowBtn onClick={() => setOpened(!opened)} dir="bottom" rotateOnClick/>
                    </div>
                )}

            </div>
        </div>

    )
}