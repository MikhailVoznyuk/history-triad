import {useState, useEffect, useRef, useMemo} from "react";
import {motion, AnimatePresence, LayoutGroup} from "framer-motion";
import {FilmImage} from "@/shared/ui/images/fim-image";
import {ArrowButton} from "@/shared/ui/buttons";
import {Title} from "@/shared/ui/text-blocks";
import styles from "./gallery.module.css"

type GalleryItem = {
    id: string;
    src: string;
    alt?: string;
    caption?: string;
}

type GalleryItemProps = {
    items: GalleryItem[];
    title?: string;
}

const clamp = (i: number, n: number) => {
    if (i < 0) return n - 1;
    if (i > n - 1) return 0;
    return i;
}

const getSize = (w: number) => {
    if (w >= 1400) return "lg";
    if (w >= 640) return "md";
    return "sm";
}

const getInitInd = (el: HTMLDivElement | null) => {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const w = getSize(rect.width);
    return (w === "lg" ? 1 : 0);
}


export function Gallery({items, title}: GalleryItemProps) {


    const [ind, setInd] = useState<number>(0);
    const [scSize, setScSize] = useState<string>("sm");

    const [wrapWidth, setWrapWidth] = useState<number>(0);
    const raf = useRef<number | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const goNext = () => setInd(clamp(ind + 1, items.length));
    const goPrev = () => setInd(clamp(ind - 1, items.length));

    useEffect( () => {
        const updateWrapWidth = () => {
            const el = wrapRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setWrapWidth(rect.width);
        }

        const calcWidth = () => {
            raf.current = null;
            setScSize(getSize(window.innerWidth));
            updateWrapWidth();
        }

        const onResize = () => {
            if (raf.current !== null) return;
            raf.current = requestAnimationFrame(calcWidth);
        }

        calcWidth();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (raf.current !== null) cancelAnimationFrame(raf.current);
        }
    }, []);

    useEffect(() => {


    }, [scSize]);

    const blockWidth: number[] = (scSize === "sm")
        ? [320, 320]
        : [400, 360];

    const start = (scSize === "sm")
        ? 0
        : 400;

    const step = blockWidth[0];

    const transX = (scSize === "sm") ?
        step * ind :
        (ind == 0) ?
        start :
        -(step * (ind - 1));

    return (
        <section className="flex flex-col items-center gap-8 w-full"

        >
            {title && <Title isCentered={true}>{title}</Title>}
            <div className="relative "
                 style={{
                     width: scSize !== "sm" ? "1200px" : "320px"
                 }}

            >
                <div className={`relative overflow-hidden ${(scSize != "sm") ? styles.maskFade : ""}`}

                >
                    <motion.div
                        className={`inset-0 relative flex items-center`}
                        animate={{x: transX}}
                        transition={{ type: "tween", duration: 0.45 }}
                        ref={wrapRef}
                    >
                        {items.map((item: GalleryItem, i) => {
                            const scale = `scale(${(scSize === 'sm' || ind === i) ? 1 : 0.8})`;

                            return (
                                <div key={item.id} style={
                                    {
                                        transform: scale,
                                        transformOrigin: "50% 50%",
                                        transition: "0.3s ease"
                                    }
                                }>
                                    <FilmImage
                                        imgSrc={item.src}
                                        alt={""}
                                        fill
                                        containerClassName="aspect-[16/9]"
                                        containerStyle={{
                                            width: `${blockWidth[0]}px`,
                                            transition: "0.3s ease"
                                        }}
                                        sizes={`${blockWidth[0]}px`}
                                    />
                                </div>
                            )}
                        )
                    }

                    </motion.div>
                </div>
                <div
                    className="absolute w-full flex justify-between"
                    style={{top: 'calc(50% - 20px)'}}
                >
                    <ArrowButton onClick={goPrev} dir="left"  />
                    <ArrowButton onClick={goNext} dir="right" />
                </div>
            </div>
        </section>
    )
}