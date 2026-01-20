import {motion, AnimatePresence} from "framer-motion";
import {Background} from "./Background";

type MovingBackgroundProps = {
    images: string[];
    idx: number;
}
export function MovingBackground({images, idx}: MovingBackgroundProps) {
    return (
        <div className="fixed top-0 left-0 -z-0 inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
                <motion.div
                    key={idx}
                    className="absolute inset-0"
                    initial={{
                        y: "100%"
                    }}
                    animate={{
                        y: "0%",
                    }}
                    exit={{
                        y: "-100%"
                    }}
                    transition={{
                        duration: 0.9,
                        ease: "easeInOut"
                    }}
                    style={{
                        willChange: "transform"
                    }}
                >
                    <Background img={images[idx]} priority/>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}