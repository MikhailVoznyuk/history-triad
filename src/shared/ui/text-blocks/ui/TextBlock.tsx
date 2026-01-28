import React from "react"
type TextBlockProps = {
    text?: string;
    className?: string;
    children?: React.ReactNode;

}

export function TextBlock({text, className='', children}: TextBlockProps) {
    return (

        <p className={`font-cormorant text-cloud text-xl font-medium ${className}`}>
            {text || children}
        </p>
    )
}