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
    shadowBorderNeeded?: boolean;
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

    console.log('sepia', props.sepiaNeeded)

    return (
        <div className={`relative size-fit overflow-hidden ${props.containerClassName || ''}  ${props.sepiaNeeded ? styles.sepia : ''}`}>
            <Image
                className={`object-cover rounded-xl ${props.imageClassName || ''}`}
                src={props.imgSrc}
                alt={props.alt}
                {...addProps}
            />
            {props.shadowBorderNeeded && (
                <div className="absolute top-0 left-0 rounded-xl inset-0 "
                style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    boxShadow: "0 0 40px 20px rgba(0, 0, 0, 0.86) inset",
                }}/>
            )}
            {
                props.effectNeeded && (
                    <div
                        className={`${styles.oldFilm} ${props.invertNeeded ? styles.invert : ''}`}>
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