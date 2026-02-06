import {twMerge} from "tailwind-merge";
import React from "react"

export function Label({children, className="", style={}}:
                      {
                          children: React.ReactNode,
                          className?: string,
                          style?: React.CSSProperties
                      }) {
    return (
        <span
            className={twMerge("font-cormorant text-base sm:text-lg text-cloud select-none", className)}
              style={style}
        >
            {children}</span>
    )
}