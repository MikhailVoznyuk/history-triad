import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence, LayoutGroup} from "framer-motion";
import {FilmImage} from "@/shared/ui/images/fim-image";
import {ArrowBtn, CloseBtn} from "@/shared/ui/buttons";
import {Title, Label} from "@/shared/ui/text-blocks";
import {Reveal} from "@/shared/ui/reveal";
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




export function Gallery({items, title}: GalleryItemProps) {
    const [ind, setInd] = useState<number>(0);
    const [scSize, setScSize] = useState<string>("sm");
    const [openId, setOpenId] = useState<string | null>(null);

    const raf = useRef<number | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const goNext = () => setInd(clamp(ind + 1, items.length));
    const goPrev = () => setInd(clamp(ind - 1, items.length));

    const AUTOPLAY_MS = 10000;

    useEffect(() => {
        if (openId || items.length < 1) return;

        const id = window.setInterval(() => {
            setInd((i) => clamp(i + 1, items.length));
        }, AUTOPLAY_MS);

        return () => {
            clearInterval(id);
        }

    }, [openId, items.length]);

    useEffect( () => {
        const calcWidth = () => {
            raf.current = null;
            setScSize(getSize(window.innerWidth));
        }

        const onResize = () => {
            if (raf.current !== null) return;
            console.log(scSize);
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

    const active = items[ind];
    const opened = (openId) ? items.find(x => x.id === openId) : null;

    const blockWidth: number[] = (scSize === "sm")
        ? [280, 320]
        : [400, 360];

    const step = blockWidth[0];
    const gap = 30;
    const start = (scSize === "sm")
        ? 0
        : step;

    const transX = (scSize === "sm") ?
        (-step - gap) * ind  :
        (ind == 0) ?
        start :
        -(step * (ind - 1));

    const lid = (id: string) => `gallery-img-${id}`

    return (
        <LayoutGroup id="gallery">
            <section className="flex flex-col items-center gap-8 w-full"

            >
                {title &&
                    <Reveal>
                        <Title isCentered={true}>{title}</Title>
                    </Reveal>
                }
                 <Reveal>
                     <div className="relative flex flex-col items-center gap-6">
                         <div className="relative"
                              style={{
                                  width: scSize !== "sm" ? "1200px" : "280px"
                              }}

                         >
                             <div className={`relative inset-0 overflow-hidden ${(scSize != "sm") ? styles.maskFade : ""}`}

                             >
                                 <motion.div
                                     className={`inset-0 relative flex items-center`}
                                     animate={{x: transX}}
                                     transition={{ type: "tween", duration: 0.45 }}
                                     style={(scSize === "sm") ? {gap} : {}}
                                     ref={wrapRef}
                                 >
                                     {items.map((item: GalleryItem, i) => {
                                         const scale = (scSize === 'sm' || ind === i) ? 1 : 0.8;
                                         const isActive = (scSize == "sm") || (i === ind);
                                         return (
                                             <motion.div
                                                 key={item.id}
                                                 layoutId = {lid(item.id)}
                                                 animate={{
                                                     scale
                                                 }}
                                                 transition={{
                                                     duration: 0.3,
                                                     ease: "easeOut"
                                                 }}
                                                 style={
                                                     {
                                                         transformOrigin: "50% 50%",
                                                         position: "relative",
                                                         pointerEvents: `${isActive ? "auto" : "none"}`,
                                                         cursor: `${isActive ? "zoom-in" : "default"}`
                                                     }}
                                                 onClick={() => isActive && setOpenId(item.id)}
                                                 className="relative"
                                             >
                                                 <FilmImage
                                                     imgSrc={item.src}
                                                     alt={""}
                                                     fill
                                                     containerClassName="aspect-[16/9]"
                                                     containerStyle={{
                                                         width: `${blockWidth[0]}px`,
                                                         transition: "0.3s ease"
                                                     }}
                                                     effectNeeded
                                                     shadowBorder={[10, 2]}
                                                     sizes={`${blockWidth[0]}px`}
                                                     grayScale
                                                 />
                                             </motion.div>
                                         )}
                                     )
                                     }

                                 </motion.div>

                             </div>

                             <ArrowBtn
                                 onClick={goPrev}
                                 dir="left"
                                 wrapperStyle={{
                                     top: "50%",
                                     left: "0",
                                     transform: "translate(-50%, -50%)"
                                 }}
                                 wrapperClassName="absolute"
                             />
                             <ArrowBtn
                                 onClick={goNext}
                                 dir="right"
                                 wrapperStyle={{
                                     top: "50%",
                                     left: "100%",
                                     transform: "translate(-50%, -50%)"
                                 }}
                                 wrapperClassName="absolute"
                             />

                         </div>
                         <div className="flex gap-4">
                             {items.map((item: GalleryItem, i: number) => (
                                 <button
                                     key={item.id}
                                     className={`size-2 sm:size-3 rounded-full cursor-pointer ${ind === i ? "bg-gold" : "bg-cloud"}`}
                                     style={{transition: "0.3s ease"}}
                                     onClick={() => {setInd(i)}}
                                 />
                             ))}
                         </div>
                     </div>
                 </Reveal>


                <AnimatePresence >
                    {opened && openId && active &&  (
                        <motion.div
                            className="fixed inset-0 z-[9999]"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-black/80"
                                onClick={() => setOpenId(null)}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{ opacity: 0 }}

                            >

                                <div className="relative  z-10 w-full h-full flex justify-center items-center p-4 sm-p-8">
                                <motion.div
                                    layoutId={lid(active.id)}
                                    className="relative w-full max-w-[1200px] aspect-[16/12] overflow-hidden"
                                    style={{cursor: "zoom-out"}}
                                    onClick={() => setOpenId(null)}
                                >
                                    <FilmImage
                                        imgSrc={opened.src}
                                        alt=""
                                        fill
                                        containerClassName="aspect-[16/12]"
                                        containerStyle={{width: "100%"}}
                                        shadowBorder={[20, 10]}
                                        sizes="(max-width: 768px) 100vw, 1200px"
                                        grayScale
                                    />
                                    <CloseBtn onClick={() => setOpenId(null)} className="absolute right-3 sm-right-6 top-3 sm-top-6"/>
                                    {opened.caption &&
                                        <div className="absolute left-0 bottom-0 px-2 py-0.5 sm:px-4 sm:py-1 bg-black/70 rounded-tr-2xl "
                                             style={{boxShadow: "0 0 8px 4px rgba(0, 0, 0, 0.7)"}}
                                        >
                                            <Label className="text-base">{opened.caption}</Label>
                                        </div>
                                    }


                                </motion.div>
                            </div>
                            </motion.div>


                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </LayoutGroup>
    )
}