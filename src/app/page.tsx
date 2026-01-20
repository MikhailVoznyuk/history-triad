"use client"

import React from "react";
import Header from "@/widgets/header";
import {MovingBackground} from "@/shared/ui/background";
import {useSelectPerson} from "@/features/select-person";

const BACKGROUND_URLS = [
    '/backgrounds/background1.jpg',
    '/backgrounds/background1.jpg',
    '/backgrounds/background2.jpg',
    '/backgrounds/background3.jpg'
];

export default function Home() {
    const person = useSelectPerson();

    return (
        <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
            <main className='text-white'>
                <MovingBackground images={BACKGROUND_URLS} idx={person.idx}/>
                <Header />
            </main>
        </div>
    );
}
