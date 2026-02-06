'use client';

import React, {createContext, useContext, useEffect, useMemo, useCallback, useRef, useState} from 'react';

type MusicApi = {
    isPlaying: boolean;
    isBlocked: boolean;
    volume: number;
    start: () => void;
    toggle: () => void;
    stop: () => void;
    setVol: (b: number) => void;
}

const Ctx = createContext<MusicApi | null>(null);

export function useMusic() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useMusic must be used within MusicProvider");
    return v;
}

export function MusicProvider({ children }: {children: React.ReactNode}) {
    const a = useRef<HTMLAudioElement | null>(null);
    const src = useMemo(() => '/audio/theme.mp3', []);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.35);

    useEffect(() => {
        a.current = document.createElement('audio');
        a.current.src = src;
        a.current.loop = true;
        a.current.preload = 'auto';
        a.current.volume = volume;

        return () => {
            a.current?.pause();
            a.current = null;

        }
    }, []);

    useEffect(() => {
        if (a.current) {
            a.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const el = a.current;
        if (!el) return;

        let wasPlaying = false;

        const onVis = () => {
            if (document.hidden) {
                wasPlaying = !el.paused;
                el.pause();
                setIsPlaying(false);

            } else {
                wasPlaying = false;
            }
        };

        const onPageHide = () => {
            el.pause();
            setIsPlaying(false);
        };

        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("pagehide", onPageHide);

        return () => {
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("pagehide", onPageHide);
        }
    }, []);

    const play = useCallback(async () => {
        if (!a.current) return;

        try {
            await a.current.play();
            setIsPlaying(true);
            setIsBlocked(false);
        } catch {
            setIsPlaying(false);
            setIsBlocked(true);
        }
    }, [])

    const pause = useCallback(() => {
        if (!a.current) return;
        a.current.pause();
        setIsPlaying(false);
    }, []);

    const start = useCallback(() => {
        if (!a.current) return;
        play();
    }, [play]);

    const stop = useCallback(() => {
        if (!a.current) return;
        a.current.pause();
        a.current.currentTime = 0;
        setIsPlaying(false);

    }, []);

    const toggle = useCallback(async () => {
        if (!a.current) return;

        if (isPlaying) {
            a.current.pause();
            setIsPlaying(false);
        } else {
           await a.current.play();
           setIsPlaying(true);
        }

    }, [isPlaying])

    const setVol = useCallback((vol: number) => {
        setVolume(Math.min(1, Math.max(0, vol)));
    }, [])

    const value = useMemo(() => (
        {isPlaying, isBlocked, volume, start, play, pause, toggle, stop, setVol}
    ), [isPlaying, isBlocked, volume, start, play, pause, toggle, stop, setVol]);

    return (
        <Ctx.Provider value={value}>{children}</Ctx.Provider>
    )
}