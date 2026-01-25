import {useMemo} from "react";
import InteractiveParticles from "@/widgets/person-hero/ui/InteractiveParticles";
import {TextSection} from "@/widgets/text-section";


export type PersonData = {
    fullName: string;
    description: string;
}

type PersonHeroProps = {
    curIdx: number;
    headers: PersonData[],
    images: string[],
}

export function PersonHero({curIdx, headers, images}: PersonHeroProps) {
    const IMAGES = useMemo(() => images, [images])

    return (
        <div className="relative h-screen inset-0 flex justify-between">
            <div className="relative top-[18%] w-1/2 flex flex-col gap-3 text-cloud font-cormorant">
                <TextSection
                    title={(curIdx !== -1) ? headers[curIdx].fullName : ''}
                    text={curIdx !== -1 ? headers[curIdx].description : ''}
                    containerClassName="gap-4"
                />
            </div>
            <div className="relative h-full py-[5vh] w-[800px]">
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