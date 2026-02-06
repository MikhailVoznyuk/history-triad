import Image from "next/image";
import {useState, useRef, useCallback} from "react";
import {StepButton} from "@/shared/ui/buttons";
import {useMusic} from "@/app/providers/MusicProvider";


type MusicControlProps = {
    isVisible: boolean;
}

export function MusicControl({isVisible}: MusicControlProps) {
    const isIOS = () =>
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);


    const music = useMusic();
    const [isActive, setIsActive] = useState<boolean>(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const usedIOS = isIOS();

    const updateTimeout = () => {
        if (closeTimeoutRef.current !== null) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        closeTimeoutRef.current = setTimeout(() => setIsActive(false), 3000)
    };

    const widgetOnClick = () => {

        if (closeTimeoutRef.current !== null && isActive) {
            //clearTimeout(closeTimeoutRef.current);
        }

        setIsActive((a) => !a);
    }

    const toggleMusic = () => music.toggle();

    const volumeStepOnClick = useCallback((type: 'inc' | 'dec')=> {
        if (type === 'inc') {
            music.setVol(+(music.volume + 0.05).toFixed(2));
        } else {
            music.setVol(+(music.volume - 0.05).toFixed(2));
        }

        //updateTimeout();
    }, [music]);





    // Функции для потенциально скрытия панели при смещении с нее курсора

    /* const onPointerEnter = () => (
        isActive &&  closeTimeoutRef.current !== null && clearTimeout(closeTimeoutRef.current)
    );

    const onPointerLeave = () => {
        if (isActive && closeTimeoutRef.current !== null) {
            closeTimeoutRef.current = setTimeout(() => setIsActive(false), 1000);
        }
    }

    */

    return (
        <div
            className='fixed z-10 left-4 sm:left-8 bottom-4 sm:bottom-8 '
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s easeOut',
            }}
        >
            <div className='relative size-full flex items-center'>
                <button
                    onClick={widgetOnClick}
                    className={`size-10 sm:size-12 rounded-full flex justify-center items-center ${music.isPlaying ? 'bg-gold' : 'bg-cloud'} duration-300 ease-out`}
                    style={{
                        boxShadow: '0 0 4px rgb(0, 0, 0)',
                    }}
                >
                    <Image
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 origin-center ${isActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} transition-all delay-0 ease-out `}
                        src='/icons/note.svg'
                        alt='note icon'
                        width={20}
                        height={20}
                        style={{
                            opacity: isActive ? 0 : 1,

                            transition: '0.3s easeOut',
                        }}
                    />

                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 origin-center ${!isActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} transition-all delay-0 ease-out `}>
                        <div className='relative size-full'>
                            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 rounded-xl bg-graphite rotate-45'/>
                            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 rounded-xl bg-graphite -rotate-45'/>
                            <span />
                        </div>

                    </div>
                </button>
                <div className={`absolute -z-1 left-6 sm:left-8  bg-cloud rounded-r-full h-9 sm:h-10 ${!isActive ? 'w-0' : (usedIOS) ? 'w-[171px] sm:w-[193px]' : 'w-50 sm:w-56'} transition-all duration-300 ease-out delay-75 overflow-hidden`}>
                    <div className='relative size-full p-1 pl-5 flex gap-2 font-mono font-normal text-graphite text-text-center'>
                        {
                            !isIOS() && (
                                <div className='flex gap-1 items-center px-1'>
                                    <StepButton onClick={() => volumeStepOnClick('dec')} direction='dec'  disabled={music.volume === 0}/>
                                    <span className='text-lg sm:text-xl w-11 text-center'>{`${Math.round(music.volume * 100)}%`}</span>
                                    <StepButton onClick={() =>  volumeStepOnClick('inc')} direction='inc' disabled={music.volume === 1}/>
                                </div>
                            )

                        }

                        <button
                            onClick={toggleMusic}
                            className='w-14 sm:w-16 flex justify-center items-center font-semibold px-1 sm:px-2 py-0.5 rounded-3xl text-base  sm:text-lg bg-gold hover:bg-white transition-all duration-300 ease-out delay-75'>
                            {music.isPlaying ? 'Выкл' : 'Вкл'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}