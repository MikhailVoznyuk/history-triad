"use client";

import React from "react";
import {BootOverlay} from "@/app/providers/boot-overlay";
import {BootProvider} from "@/app/providers/boot-provider";
import {SelectPersonProvider} from "@/features/select-person";

export function AppProviders({children}: {children: React.ReactNode}) {
    return (
        <SelectPersonProvider>
            <BootProvider>
                <BootOverlay />
                {children}
            </BootProvider>
        </SelectPersonProvider>
    )
}
