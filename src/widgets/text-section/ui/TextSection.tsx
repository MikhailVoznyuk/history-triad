import {twMerge} from "tailwind-merge";
import {Title, TextBlock} from "@/shared/ui/text-blocks";

type TextSectionProps = {
    title: string;
    text: string;
    containerClassName?: string;
    titleClassName?: string;
    textClassName?: string;
}
export function TextSection(props: TextSectionProps ) {
    return (
        <div className={twMerge(
            'relative flex flex-col gap-8 $',
            props.containerClassName || ''
        )}>
            <Title title={props.title} />
            <TextBlock text={props.text} />
        </div>
    )
}