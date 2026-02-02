import Image from "next/image";
import styles from './background.module.css'

type BackgroundProps = {
    img: string;
    priority?: boolean
}
export function Background({img, priority=false}: BackgroundProps) {
    return (
        <div className="fixed top-0 left-0  inset-0 pointer-events-none">
            <div className="relative size-full">
                <Image
                    src={img}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={priority}
                    alt="background"
                />
                <div className={styles.dim} />
                <div className={styles.vignette} />
                <div className={styles.oldFilm}>
                    <div className={styles.film}>
                        <div className={styles.effect}>
                            <div className={styles.grain}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}