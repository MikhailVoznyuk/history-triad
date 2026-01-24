import {useMemo} from "react";
import InteractiveParticles from "@/widgets/person-hero/ui/InteractiveParticles";


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
        <div className="h-screen inset-0 flex justify-between">
            <div className="flex flex-col gap-3">
                <h4>{(curIdx !== -1) ? headers[curIdx].fullName : ''}</h4>
                <h5>{(curIdx !== -1) ? headers[curIdx].description : ''}</h5>
            </div>
            <div className="relative h-full w-[800px]">
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