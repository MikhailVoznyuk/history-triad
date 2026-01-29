import {useState, useEffect, useRef} from "react";
import {useInView, useScroll, useMotionValueEvent} from "framer-motion";
import {Title} from "@/shared/ui/text-blocks";


type TimelineMarkProps = {
    top: string;
    year: string;
}

export function TimelineMark({top, year}: TimelineMarkProps) {
    const markRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(
        markRef,
        {
            margin: "-80px 0% -80px 0%",
            amount: "all"
        }
    )

    return (
        <div ref={markRef} className="absolute left-0 flex gap-4 items-center h-10 w-fit " style={
            {
                top,
                opacity: (inView ? 1 : 0),
                transition: '0.3s ease-in-out',
            }}
        >
            <div className="rounded-full size-8 bg-cloud shrink-0">
            </div>
            <Title titleClassName="font-cormorant text-5xl font-bold mb-1 whitespace-nowrap" isCentered={true}>{year}</Title>
        </div>
    )
}