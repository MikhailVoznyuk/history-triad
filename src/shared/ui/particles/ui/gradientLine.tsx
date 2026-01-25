export function GradientLine({isCentered=false} : {isCentered?: boolean}) {
    return (
        <span
            className="h-[2px] w-full rounded-xl"
            style={{
                background: isCentered ? 'linear-gradient(to right, transparent, #E7C765, transparent)' : 'linear-gradient(to right, #E7C765, transparent)'
        }}/>
    )
}