import {twMerge} from "tailwind-merge";
import {GradientLine} from "@/shared/ui/particles";

type TitleProps = {
    title: string,
    titleClassName?: string,
    containerClassName?: string,
    lineNeeded?: boolean
    isCentered?: boolean
}

export function Title({title, titleClassName='', containerClassName='',  lineNeeded=true, isCentered=false}: TitleProps) {
    return (
        <div className={twMerge(
            'flex flex-col gap-1 w-fit',
            containerClassName
        )}
        >
            <h2 className={twMerge(
                'font-cormorant text-cloud  text-3xl font-semibold',
                titleClassName
            )}>{title}</h2>
            {lineNeeded && (

                <GradientLine isCentered={isCentered}/>
            )}
        </div>
    )
}