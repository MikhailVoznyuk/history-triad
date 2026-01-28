import {useRef, useEffect, useState} from "react";
import {useInView} from "framer-motion";
import {Title, TextBlock} from "@/shared/ui/text-blocks";
import type {TimeLineItem} from "@/widgets/timeline/model/types";

export type TimeLineProps = {
    item: TimeLineItem;
    idx: number;
    activeIdx: number;
    onActive: (idx: number) => void;
}

export function TimelineBlock({item, idx, activeIdx, onActive}: TimeLineProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, {margin: "-40% 0% -45% 0%", amount: 0.1});
    useEffect(() => {


        if (inView) onActive(idx);
        console.log('useEffect Block fires', inView, activeIdx, idx);
    }, [inView, idx, onActive]);
    return (
        <div className="w-48 h-fit flex flex-col gap-3 font-cormorant p-4 shadow-md rounded-md "
             ref={ref}
             style={{
                 opacity: `${idx > activeIdx ? 0 : 1} `,
                 background: 'rgba(0, 0, 0, 0.34)',
                 transition:  '0.3s ease-in-out',
                 backdropFilter: 'blur(6px)',
                 border: '1px solid rgba(211, 211, 211, 0.7)'
             }}
        >
            <Title titleClassName="text-">{item.title}</Title>
            <TextBlock>{item.text}</TextBlock>
        </div>
    )
}