type TextBlockProps = {
    text: string;
    className?: string;
}

export function TextBlock({text, className=''}: TextBlockProps) {
    return (

        <p className={`font-cormorant text-cloud text-xl font-medium ${className}`}>
            {text}
        </p>
    )
}