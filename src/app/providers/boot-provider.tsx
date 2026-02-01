"use client"

import React, {createContext, useContext, useMemo, useState, useCallback} from "react";

type BootApi = {
    isBooting: boolean;
    start: () => void;
    done: () => void;
}

const Ctx = createContext<BootApi | null>(null);

export function BootProvider({children} : {children: React.ReactNode}) {
    const [isBooting, setIsBooting] = useState<boolean>(true);

    const start = useCallback(() => setIsBooting(true), []);
    const done =useCallback(() => setIsBooting(false), [])

    const value = useMemo(() => ({
        isBooting,
        start,
        done,
    }), [isBooting, start, done]);


    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBoot() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useBoot must be used within BootProvider");
    return v;
}