import {useState, useRef, useEffect} from "react";
import {useInView} from "framer-motion";
import {Title, TextBlock} from "@/shared/ui/text-blocks";
import {ArrowButton} from "@/shared/ui/buttons";
import type {TimeLineItem} from "@/widgets/timeline/model/types";

export type TimeLineProps = {
    item: TimeLineItem;
    idx: number;
    activeIdx: number;
    onActive: (idx: number) => void;
}

export function TimelineBlock({item, idx, activeIdx, onActive}: TimeLineProps) {
    const [opened, setOpened] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, {margin: "0% 0% 0% 0%", amount: "all"}); //{margin: "-30% 0% -45% 0%", amount: 0.5})

    const isTextCropped = item.text.length > 198;

    useEffect(() => {
        if (inView) onActive(idx);
    }, [inView, idx, onActive]);
    return (
        <div className={`w-[500px] ${opened ? "h-fit" : "h-[290px]"} flex flex-col gap-4 font-cormorant p-4 shadow-md rounded-md`}
             ref={ref}
             style={{
                 opacity: `${idx > activeIdx ? 0 : 1} `,
                 background: 'rgba(0, 0, 0, 0.34)',
                 transition:  '0.3s ease-in-out',
                 backdropFilter: 'blur(6px)',
                 border: '1px solid rgba(211, 211, 211, 0.7)'
             }}
        >
            <div
                className={`${opened ? '' : 'h-48'} flex flex-col gap-3 ${opened ? '' : 'mask-fade-bottom-3'} overflow-hidden`}
                style={{
                    transition: "0.3s ease-in-out"
                }}
            >
                <Title titleClassName="text-2xl text-gold" lineColor={'#D9D9D9'}>{item.title}</Title>
                <TextBlock className="text-lg">{item.text}</TextBlock>
            </div>
            {isTextCropped && (
                <div className="flex w-full justify-end">
                    <ArrowButton onClick={() => setOpened(!opened)} dir="bottom" rotateOnClick/>
                </div>
            )}

        </div>
    )
}