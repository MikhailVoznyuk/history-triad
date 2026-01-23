import InteractiveParticles from "@/widgets/person-hero/ui/InteractiveParticles";

type PersonHeroProps = {
    name: string,
    description: string,
    img: string,
}

export function PersonHero(props: PersonHeroProps) {
    return (
        <div className="h-screen inset-0 flex justify-between">
            <div className="flex flex-col gap-3">
                <h4>{props.name}</h4>
                <h5>{props.description}</h5>
            </div>
            <div className="relative h-full w-[800px]">
                <InteractiveParticles
                    className="h-full w-full"
                    images={[props.img]}
                />
            </div>
        </div>
    )
}