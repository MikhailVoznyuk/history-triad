"use client"

import React from "react";
import Header from "@/widgets/header";
import {MovingBackground} from "@/shared/ui/background";
import {useSelectPerson} from "@/features/select-person";
import {InteractiveParticles} from "@/widgets/person-hero/ui/InteractiveParticles";

const BACKGROUND_URLS = [
    '/backgrounds/background1.jpg',
    '/backgrounds/background1.jpg',
    '/backgrounds/background2.jpg',
    '/backgrounds/background3.jpg'
];

export default function Home() {
    const person = useSelectPerson();
    const ALL = React.useMemo(() => [
        'persons/78.png',
        'persons/person2.webp',
        'persons/person3.webp'
    ], []);
    return (
        <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
            <main className='text-white'>
                <MovingBackground images={BACKGROUND_URLS} idx={person.idx}/>
                <Header />
                <div className="relative h-screen w-[1200px]">


                            <InteractiveParticles
                                images={ALL}
                                startIndex={Math.max(0, person.idx)}     // или маппинг idx->картинка
                                active={person.idx !== -1}
                                className="h-full w-full"

                            />
                </div>
            </main>
        </div>
    );
}
