import {Title, TextBlock} from "@/shared/ui/text-blocks";
import {FilmImage} from "@/shared/ui/images/fim-image";
import {Reveal} from "@/shared/ui/reveal";

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
        <div className={`relative flex flex-col-reverse sm:flex-row justify-center gap-10 sm:gap-32 items-center ${props.inverse && "sm:flex-row-reverse"}`}>
            <div className="flex flex-col gap-3 basis-2/5">
                {props.title &&
                    <Reveal>
                        <Title
                            title={props.title}
                            lineNeeded={false}
                            titleClassName="text-gold text-3xl font-bold"

                        />
                    </Reveal>

                }
                <Reveal>
                    <TextBlock text={props.text} />
                </Reveal>

            </div>
            <Reveal>
                <FilmImage
                    imageClassName="w-[500px] h-auto"
                    width={400}
                    height={300}
                    imgSrc={props.imgSrc}
                    alt="Text block image"
                    effectNeeded
                    sepiaNeeded={props.imgEffect === "sepia"}
                    invertNeeded={props.imgEffect === "invert"}
                    shadowBorder={[40, 20]}
                />
            </Reveal>
        </div>
    )
}
export function TextImageSection({title, blocks} : TextImageSectionProps) {
    return (

        <div className="flex flex-col gap-28 sm:gap-30 items-center">
            {title &&
                <Reveal>
                    <Title title={title} lineNeeded={true}  isCentered={true} containerClassName=" sm:-mb-12" />
                </Reveal>}
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