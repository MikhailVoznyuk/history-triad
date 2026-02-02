import {useMemo} from "react";
import InteractiveParticles from "@/widgets/person-hero/ui/InteractiveParticles";
import {TextSection} from "@/widgets/text-section";
import {Reveal} from "@/shared/ui/reveal";


export type PersonData = {
    fullName: string;
    description: string;
}

type PersonHeroProps = {
    curIdx: number;
    headers: PersonData[],
    images: string[],
    anchorId?: string
}

export function PersonHero({curIdx, headers, images, anchorId}: PersonHeroProps) {
    const IMAGES = useMemo(() => images, [images])

    return (
        <div className="relative sm:h-screen inset-0 flex justify-between flex-col-reverse sm:flex-row" id={anchorId ?? undefined}>
            <div className="relative sm:top-[18%] w-full sm:w-1/2 flex flex-col gap-3 text-cloud font-cormorant">
                <Reveal>
                    <TextSection
                        title={(curIdx !== -1) ? headers[curIdx].fullName : ''}
                        text={curIdx !== -1 ? headers[curIdx].description : ''}
                        containerClassName="gap-4"
                    />
                </Reveal>
            </div>
            <div className="relative h-[80vh] sm:h-full py-[5vh] w-full sm:w-[800px] fade-full sm:fade-none">
                <InteractiveParticles
                    className="h-full w-full"
                    images={IMAGES}
                    startIndex={curIdx === -1 ? 0 : curIdx}
                    active={curIdx !== -1}
                />
            </div>
        </div>
    )
}