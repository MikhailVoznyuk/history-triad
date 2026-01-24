import {GradientLine} from "@/shared/ui/particles";

type TitleProps = {
    title: string,
    titleClassName?: string,
    containerClassName?: string,
    lineNeeded?: boolean
}

export function Title({title, titleClassName='', containerClassName='',  lineNeeded=true}: TitleProps) {
    return (
        <div className={`flex flex-col gap-3 ${containerClassName}`}>
            <h2 className={`font-cormorant text-cloud  text-3xl font-semibold ${titleClassName}`}>{title}</h2>
            {lineNeeded && (
                <GradientLine />
            )}
        </div>
    )
}