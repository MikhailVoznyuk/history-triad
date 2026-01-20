"use client"

import React from "react";
import {createContext, useContext, useMemo} from "react";

type Ctx = {
    idx: number,
    set: (n: number) => void
}

const C = createContext<Ctx | null>(null);

export function SelectPersonProvider(
    {
        children,
        initial = 0
    } : {
        children: React.ReactNode,
        initial?: number
    }
) {
    const [idx, setIdx] = React.useState(() => initial);
    const

    const v = useMemo(() => {
        const set = (n: number) => setIdx(n);
        return {idx, set}
    }, [idx, setIdx]);

    return (
        <C.Provider value={v}>{children}</C.Provider>
    )
}

export function useSelectPerson() {
    const v = useContext(C);
    if (!v) throw new Error("useSelectPerson must be used inside SelectPersonProvider");
    return v;
}