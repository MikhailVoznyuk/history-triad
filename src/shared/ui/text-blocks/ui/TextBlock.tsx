import React from "react";
import {twMerge} from "tailwind-merge";

type TextBlockProps = {
    text?: string;
    className?: string;
    children?: React.ReactNode;

}

export function TextBlock({text, className='', children}: TextBlockProps) {
    return (

        <p className={twMerge("font-cormorant text-cloud text-xl font-medium", className)}>
            {text || children}
        </p>
    )
}