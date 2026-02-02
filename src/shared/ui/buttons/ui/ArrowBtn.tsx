import {useState, useMemo} from "react";
import {twMerge} from "tailwind-merge";
import React from "react";

type SecondaryButtonProps={
    onClick: () => void;
    dir: 'top' | 'bottom' | 'left' | 'right';
    rotateOnClick?: boolean;
    className?: string;
    wrapperClassName?: string;
    style?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
}

export function ArrowBtn(
    {
        onClick,
        dir,
        rotateOnClick,
        className='',
        wrapperClassName='',
        style={},
        wrapperStyle={}
    }: SecondaryButtonProps) {
    const anglesHash = useMemo(() => ({
        top: -90,
        bottom: 90,
        right: 0,
        left: -180
    }), []);
    const [angle, setAngle] = useState(anglesHash[dir]);

    return (
        <div className={twMerge("size-fit", wrapperClassName)} style={wrapperStyle}>
            <button onClick={() => {
                onClick()
                if (rotateOnClick) {setAngle((angle + 180) % 360)}
            }} className={twMerge(
                "relative rounded-full bg-gold border-0 size-10 sm:size-12 flex justify-center items-center origin-center cursor-pointer",
                className
            )}
                    style={{
                        transform: `rotate(${angle}deg)`,
                        transition: "0.3s ease-in-out",
                        ...style
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
                          top: "calc(50% + 5px)",
                      }}
                />
            </button>
        </div>

    )




}