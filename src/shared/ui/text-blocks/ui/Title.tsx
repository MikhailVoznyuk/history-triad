import React from "react";
import {twMerge} from "tailwind-merge";
import {GradientLine} from "@/shared/ui/particles";

type TitleProps = {
    title?: string,
    children?: React.ReactNode,
    titleClassName?: string,
    containerClassName?: string,
    lineColor?: string,
    lineNeeded?: boolean
    isCentered?: boolean
}

export function Title(
    {
        title,
        titleClassName='',
        containerClassName='',
        lineNeeded=true,
        isCentered=false,
        lineColor,
        children
    }: TitleProps) {
    return (
        <div className={twMerge(
            'flex flex-col gap-1 w-fit',
            containerClassName
        )}
        >
            <h2 className={twMerge(
                'font-cormorant text-cloud  text-3xl font-semibold select-none',
                titleClassName
            )}>{title || children}</h2>
            {lineNeeded && (

                <GradientLine isCentered={isCentered} color={lineColor}/>
            )}
        </div>
    )
}