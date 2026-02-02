import {useBoot} from "@/app/providers/boot-provider";
import {AnimatePresence, motion} from "framer-motion";
import {Label} from "@/shared/ui/text-blocks";
import styles from "./bootOverlay.module.css"

export function BootOverlay() {
    const {isBooting} = useBoot();

    return (
        <AnimatePresence>
            {
                isBooting && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/70 backdrop-blur-md"
                        initial={{opacity: 1}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <div className="flex flex-col gap-10 items-center">
                            <div
                                className={`relative w-[160px] h-[160px] ${styles.loader}`}
                            >
                                <div className="size-full border-cloud border-2 rounded-full" />
                                <span className="absolute size-6 top-1/2 left-0 -translate-1/2 bg-cloud rounded-full" />
                                <span className="absolute size-6 top-1/2 left-full -translate-1/2  bg-cloud rounded-full" />
                                <span
                                    className={`absolute size-10 top-1/2 left-1/2 -translate-1/2 bg-cloud rounded-full ${styles.loader__dot}`}
                                />
                            </div>
                            <Label className="text-xl font-semibold">Загрузка…</Label>
                        </div>
                    </motion.div>
                )
            }

        </AnimatePresence>
    )
}