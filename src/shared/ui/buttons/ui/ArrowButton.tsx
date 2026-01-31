import {useState, useMemo} from "react";
import {twMerge} from "tailwind-merge";

type SecondaryButtonProps={
    onClick: () => void;
    dir: 'top' | 'bottom' | 'left' | 'right';
    rotateOnClick?: boolean;
    className?: string;
}

export function ArrowButton({onClick, dir, rotateOnClick, className=''}: SecondaryButtonProps) {
    const anglesHash = useMemo(() => ({
        top: -90,
        bottom: 90,
        right: 0,
        left: -180
    }), []);
    const [angle, setAngle] = useState(anglesHash[dir]);

    return (
        <button onClick={() => {
            onClick()
            if (rotateOnClick) {setAngle((angle + 180) % 360)}
        }} className={twMerge(
            "relative rounded-full bg-gold border-0 size-12 flex justify-center items-center",
            className
        )}
        style={{
            transform: `rotate(${angle}deg)`,
            transition: "0.3s ease-in-out",
        }}>
            <span className="absolute rounded-xl bg-graphite w-4 h-0.5"
                style={{
                    transform: "rotate(45deg)",
                    top: "calc(50% - 5px)"
                }}
            />
            <span className="absolute rounded-xl bg-graphite w-4 h-0.5"
                  style={{
                      transform: "rotate(-45deg)",
                      top: "calc(50% + 5px)"
                  }}
            />
        </button>
    )




}