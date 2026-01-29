export function GradientLine({isCentered=false, color="#E7C765"} : {isCentered?: boolean, color?: string}) {
    return (
        <span
            className="h-[2px] w-full rounded-xl"
            style={{
                background: isCentered ? `linear-gradient(to right, transparent, ${color}, transparent)` : `linear-gradient(to right, ${color}, transparent)`
        }}/>
    )
}