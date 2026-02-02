import {twMerge} from "tailwind-merge";
import React from "react";


export function CloseBtn({onClick, className="", style={}}: {
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <button onClick={onClick} className={twMerge(
            "relative rounded-full bg-cloud border-0 size-8 sm:size-10 flex justify-center items-center origin-center hover:scale-105 cursor-pointer",
            className
        )}
                style={{
                    transition: "0.3s ease-in-out",
                    ...style
                }}>
            <span className="absolute rounded-xl bg-graphite w-5 h-0.5"
                  style={{
                      transform: "rotate(45deg)",
                      top: "calc(50% - 1px)"
                  }}
            />
            <span className="absolute rounded-xl bg-graphite w-5 h-0.5"
                  style={{
                      transform: "rotate(-45deg)",
                      top: "calc(50% - 1px)"
                  }}
            />
        </button>
    )
}