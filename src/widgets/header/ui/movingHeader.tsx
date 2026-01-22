import React from "react";
import {motion, AnimatePresence} from "framer-motion";

type Header = {
    mainText: string;
    addText?: string;
}

type MovingHeaderProps = {
    idx: number;
    headers: Header[];
    scale?: number;
    loop?: boolean;
    empty: boolean;
}
export function MovingHeader({idx, headers, scale=1.1, loop=true, empty=false}: MovingHeaderProps) {
    const ease = [0.22, 1, 0.36, 1] as const;
    console.log(idx)
    const v = {
        initial: { y: `${(empty)? 0 : 100}%`, opacity: 0 },
        enter: {
            y: "0%",
            opacity: 1,
            transition: { duration: 0.5, ease },
        },
        exit: {
            y: `${(empty) ? 0 : -100}%`,
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

                        {(empty) ?
                            <div className="absolute inset-0">
                                <motion.h5
                                    key={idx}
                                    className="font-cormorant text-center text-xl font-semibold"
                                    initial={{
                                        scale: 1,
                                    }}
                                    animate={{
                                        scale: [1, scale, 1],
                                    }}
                                    transition={{
                                        ease: "easeOut",
                                        duration: 6,
                                        repeat: (loop) ? Infinity : 0,
                                }}>
                                    Выберите персону, нажав по ней на круге
                                </motion.h5>
                            </div>
                            :
                            <div className="absolute inset-0 flex flex-col gap-3">
                                <h5 className="font-cormorant text-center text-xl font-semibold">
                                    {headers[idx].mainText}
                                </h5>
                                {headers[idx].addText &&
                                    <h5 className="font-cormorant text-center text-l font-semibold">
                                        {headers[idx].addText}
                                    </h5>
                                }
                            </div>
                        }


                    </motion.div>

            </AnimatePresence>
    )
}