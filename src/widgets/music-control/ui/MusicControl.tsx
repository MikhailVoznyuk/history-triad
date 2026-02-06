import {useState, useRef, useCallback} from "react";
import Image from "next/image";

type MusicControlProps = {
    isVisible: boolean;
    volume: number;
    setVolume: (volume: number) => void;
}

export function MusicControl({isVisible, volume, setVolume}: MusicControlProps) {
    const [isActive, setIsActive] = useState<boolean>(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const updateTimeout = () => {
        if (closeTimeoutRef.current !== null) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        closeTimeoutRef.current = setTimeout(() => setIsActive(false), 3000)
    }
    const VolumeStepOnClick = useCallback((type: 'inc' | 'dec')=> {
        if (type === 'inc') {
            setVolume((volume + 10 <= 100) ? volume + 10 : volume);
        } else {
            setVolume((volume - 10 >= 0) ? volume - 10 : volume);
        }

        updateTimeout();
    }, []);

    const widgetOnClick = () => {
        setIsActive((a) => !a);
        if (closeTimeoutRef.current !== null) {
            clearTimeout(closeTimeoutRef.current);
        }
    }

    return (
        <div
            className='fixed left-3 sm:left-3 bottom-3 sm:bottom-8'
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s easeOut',
        }}
        >
            <div className='relative size-full flex items-center'>
                <button
                    onClick={widgetOnClick}
                    className={`size-8 sm:size-10 rounded-full flex justify-center align-center ${volume > 0 ? 'bg-gold' : 'bg-cloud'} duration-300 ease-out`}
                >
                    <Image
                        className='size-4'
                        src='/icons/note.svg'
                        alt='note icon'
                        width={16}
                        height={16}
                    />
                </button>
                <div className={`absolute left-4 sm:left-5 bg-cloud rounded-r h-fit `}>

                </div>

            </div>


        </div>
    )
}