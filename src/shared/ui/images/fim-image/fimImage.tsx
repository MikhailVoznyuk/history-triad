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
    shadowBorder?: number[];
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
    let borderParams: (number[] | null) = null;
    if (props.shadowBorder) {
        borderParams = [];
        if (props.shadowBorder.length > 0) {
            borderParams.push(props.shadowBorder[0]);
        }
        if (props.shadowBorder.length > 1) {
            borderParams.push(props.shadowBorder[1]);
        }

    }
    if (props.fill) {
        addProps.fill = true;
        addProps.sizes = props.sizes;
    } else {
        addProps.width = props.width;
        addProps.height = props.height;
    }

    return (
        <div className={`relative size-fit overflow-hidden ${props.containerClassName || ''}  ${props.sepiaNeeded ? styles.sepia : ''}`}>
            <Image
                className={`object-cover rounded-xl ${props.imageClassName || ''}`}
                src={props.imgSrc}
                alt={props.alt}
                {...addProps}
            />
            {borderParams &&
                <div className="absolute top-0 left-0 rounded-xl inset-0 "
                style={{
                    background: "rgba(0, 0, 0, 0.2)",

                    boxShadow: `0 0 ${borderParams[0] ?? 0}px ${borderParams[1] ?? 0}px rgba(0, 0, 0, 0.86) inset`,
                }}/>
            }
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