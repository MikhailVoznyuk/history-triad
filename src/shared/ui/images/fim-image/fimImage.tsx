import Image from "next/image";
import styles from "./filmImage.module.css";

type FilmImageProps = {
    imgSrc: string;
    width?: number;
    height?: number;
    fill?: number;
    sizes?: string;
    alt: string;
    effectNeeded?: boolean;
    sepiaNeeded?: boolean;
    invertNeeded?: boolean;
    containerClassName?: string;
    imageClassName?: string;
}

type AdditionalProps = {
    width?: number;
    height?: number
    fill?: boolean;
    sizes?: string;
}

export function FilmImage(props: FilmImageProps) {
    const addProps: AdditionalProps = {}

    if (props.fill) {
        addProps.fill = true;
        addProps.sizes = props.sizes;
    } else {
        addProps.width = props.width;
        addProps.height = props.height;
    }


    return (
        <div className={`relative size-fit ${props.containerClassName || ''}`}>
            <Image
                className={`object-cover rounded-xl ${props.imageClassName || ''}`}
                src={props.imgSrc}
                alt={props.alt}
                {...addProps}
            />
            {
                props.effectNeeded && (
                    <div
                        className={`${styles.oldFilm} ${props.sepiaNeeded ? styles.sepia : ''} ${props.invertNeeded ? styles.invert : ''}`}>
                        <div className={styles.film}>
                            <div className={styles.effect}>
                                <div className={styles.grain}></div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}