"use client";

import React from "react";
import {BootOverlay} from "@/app/providers/boot-overlay";
import {BootProvider} from "@/app/providers/boot-provider";
import {SelectPersonProvider} from "@/features/select-person";
import {MusicProvider} from "@/app/providers/MusicProvider";

export function AppProviders({children}: {children: React.ReactNode}) {
    return (
        <SelectPersonProvider>
            <MusicProvider>
                <BootProvider>
                    <BootOverlay />
                    {children}
                </BootProvider>
            </MusicProvider>
        </SelectPersonProvider>
    )
}
