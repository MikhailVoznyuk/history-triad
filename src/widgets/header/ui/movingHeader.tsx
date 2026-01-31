import React from "react";
import {motion, AnimatePresence} from "framer-motion";

type Header = {
    mainText: string;
    addText?: string;
}

type MovingHeaderProps = {
    idx: number;
    headers: Header[];
}

export function MovingHeader({idx, headers}: MovingHeaderProps) {
    const ease = [0.22, 1, 0.36, 1] as const;

    const v = {
        initial: { y: '100%', opacity: 0 },
        enter: {
            y: "0%",
            opacity: 1,
            transition: { duration: 0.5, ease },
        },
        exit: {
            y: `-100%`,
            opacity: 0,
            transition: { duration: 0.5, ease },
        },
    };
    return (
            <AnimatePresence
            >
                    <motion.div
                        key={idx}
                        className="absolute  inset-0"
                        variants={v}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        <div className="absolute inset-0 flex flex-col gap-3">
                            <h5 className="font-cormorant text-center text-xl sm:text-3xl font-semibold">
                                {headers[idx].mainText}
                            </h5>
                            {headers[idx].addText &&
                                <h5 className="font-cormorant text-center text-xl sm:text-2xl font-semibold">
                                    {headers[idx].addText}
                                </h5>
                            }
                        </div>
                    </motion.div>
            </AnimatePresence>
    )
}

export function HeaderEmpty({scale = 1.08} : {scale?: number}   ) {
    return (
        <motion.h5
            key={'header_empty'}
            className="font-cormorant text-center text-2xl font-semibold"
            initial={{
                scale: 1,
            }}
            animate={{
                scale: [1, scale, 1],
            }}
            transition={{
                ease: "easeOut",
                duration: 6,
                repeat: Infinity,
            }}>
            Выберите персону, нажав по ней на круге
        </motion.h5>
    )
}