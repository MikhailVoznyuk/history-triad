import {motion, useReducedMotion} from "framer-motion";
import React from "react";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
    once?: boolean;
    amount?: number;
    delay?: number;
}

export function Reveal({
    children,
    className="",
    once = true,
    amount = 0.2,
    delay = 0}: RevealProps) {
    const reduce = useReducedMotion();

    return (
        <motion.div
        className={className}
        initial={reduce? {opacity: 1} : {opacity: 0, y: 16}}
        whileInView={reduce ? {opacity: 1} : {opacity: 1, y: 0}}
        viewport={{once, amount}}
        transition={{duration: 0.45, ease: "easeOut", delay}}

        >
            {children}
        </motion.div>
    )

}