"use client"

import {useMemo} from "react";

import Header from "@/widgets/header";
import {MovingBackground} from "@/shared/ui/background";
import {useSelectPerson} from "@/features/select-person";
import {InteractiveParticles} from "@/widgets/person-hero/ui/InteractiveParticles";
import {PersonHero} from "@/widgets/person-hero/ui/PersonHero";
import type {PersonData} from "@/widgets/person-hero/ui/PersonHero";

const BACKGROUND_URLS = [
    '/backgrounds/background1.jpg',
    '/backgrounds/background1.jpg',
    '/backgrounds/background2.jpg',
    '/backgrounds/background3.jpg'
];

export default function Home() {
    const person = useSelectPerson();
    const PORTRAITS = useMemo(() => [
        'persons/portrait1.webp',
        'persons/portrait2.webp',
        'persons/portrait3.webp'
    ], []);
    const PERSON_HEADERS = useMemo<Array<PersonData>>(() => [
        {fullName: 'Григорий Григорьевич Елисеев', description: 'Описание'},
        {fullName: 'Николай Михайлович Мартьянов', description: 'Описание'},
        {fullName: 'Митрофан Варламович Лагидзе', description: 'Описание'}
    ], [])
    return (
        <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
            <main className='text-white'>
                <MovingBackground images={BACKGROUND_URLS} idx={person.idx}/>
                <Header />
                <PersonHero
                    curIdx={person.idx}
                    images={PORTRAITS}
                    headers={PERSON_HEADERS}
                />

            </main>
        </div>
    );
}
