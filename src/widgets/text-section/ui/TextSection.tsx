import {twMerge} from "tailwind-merge";
import {Title, TextBlock} from "@/shared/ui/text-blocks";
import {Reveal} from "@/shared/ui/reveal";

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
            <Reveal>
                <Title title={props.title} />
            </Reveal>
            <Reveal>
                <TextBlock text={props.text} />
            </Reveal>
        </div>
    )
}