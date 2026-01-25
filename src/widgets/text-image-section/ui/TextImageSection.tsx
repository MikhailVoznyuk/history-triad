import {Title, TextBlock} from "@/shared/ui/text-blocks";
import {FilmImage} from "@/shared/ui/images/fim-image";

type TextImageBlockData =  {
    id: string;
    title?: string;
    text: string;
    imgSrc: string;
    imgEffect?: 'sepia' | 'invert'
}

type TextImageBlockProps = Omit<TextImageBlockData, 'id'> & {inverse: boolean}

type TextImageSectionProps = {
    title?: string;
    blocks: TextImageBlockData[];
}

function TextImageBlock(props: TextImageBlockProps) {
    return (
        <div className={`relative flex justify-center gap-32 items-center ${props.inverse && "flex-row-reverse"}`}>
            <div className="flex flex-col gap-3 basis-2/5">
                {props.title &&
                    <Title
                        title={props.title}
                        lineNeeded={false}
                        titleClassName="text-gold text-xl font-bold"

                    />
                }
                <TextBlock text={props.text} />
            </div>
            <FilmImage
                imageClassName="w-[600px] h-auto"
                width={400}
                height={300}
                imgSrc={props.imgSrc}
                alt="Text block image"
                effectNeeded
                sepiaNeeded={props.imgEffect === "sepia"}
                invertNeeded={props.imgEffect === "invert"}
                shadowBorderNeeded
            />

        </div>
    )
}
export function TextImageSection({title, blocks} : TextImageSectionProps) {
    return (

        <div className="flex flex-col gap-30 items-center">
            {title && <Title title={title} lineNeeded={true}  isCentered={true} containerClassName="-mb-12" />}
            {blocks.map((block, i) => (
                <TextImageBlock
                    key={block.id}
                    title={block.title}
                    text={block.text}
                    imgSrc={block.imgSrc}
                    imgEffect={block.imgEffect}
                    inverse={!!(i % 2)}
                />
            ))}
        </div>
    )
}