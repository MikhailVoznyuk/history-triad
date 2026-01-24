import {useMemo} from "react";
import InteractiveParticles from "@/widgets/person-hero/ui/InteractiveParticles";
import {Title, TextBlock} from "@/shared/ui/text-blocks";


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
        <div className="relative h-screen inset-0 flex justify-between p-12">
            <div className="relative flex flex-col gap-3 text-cloud font-cormorant">
                <Title title={(curIdx !== -1) ? headers[curIdx].fullName : ''} />
                <TextBlock text={curIdx !== -1 ? headers[curIdx].description : ''} />
            </div>
            <div className="relative h-full py-2 w-[800px]">
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