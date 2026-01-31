"use client"

import {useMemo} from "react";

import Header from "@/widgets/header";
import {MovingBackground} from "@/shared/ui/background";
import {useSelectPerson} from "@/features/select-person";
import {PersonHero} from "@/widgets/person-hero/ui/PersonHero";
import {TextImageSection} from "@/widgets/text-image-section";
import {VerticalTimeLine} from "@/widgets/timeline/ui/VerticalTimeLine";
import {Gallery} from "@/widgets/gallery";
import {TIMELINE} from "@/widgets/timeline/model/data";
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
        {fullName: 'Митрофан Варламович Лагидзе', description: 'Изобретатель и предприниматель, сумевший превратить личную идею в новую культуру вкуса. Ученик аптекаря, он выбрал путь натуральных компонентов и настойчивых экспериментов, создавая сиропы из ягод, фруктов и трав родной Грузии. Его подход изменил представление о безалкогольных напитках: лимонад из ремесленного опыта стал массовым явлением, а имя Лагидзе закрепилось как знак качества, который пытались повторять и подделывать.'}
    ], [])
    return (
        <div className="flex min-h-screen items-center justify-center bg-black font-sans ">
            <main className='w-full font-cormorant text-cloud'>
                <MovingBackground images={BACKGROUND_URLS} idx={person.idx}/>
                <div className="relative z-1">
                    <Header />
                    <div className="px-12 mt-12 flex flex-col gap-32">
                        <PersonHero
                            curIdx={person.idx}
                            images={PORTRAITS}
                            headers={PERSON_HEADERS}
                        />
                        <TextImageSection
                            title="Пример блоков с картинками"
                            blocks={[
                                {
                                    id: "0",
                                    title: PERSON_HEADERS[2].fullName,
                                    text: PERSON_HEADERS[2].description,
                                    imgSrc: "/backgrounds/background1.jpg",
                                    imgEffect: "sepia",
                                },
                                {
                                    id: "1",
                                    title: PERSON_HEADERS[2].fullName,
                                    text: PERSON_HEADERS[2].description,
                                    imgSrc: "/backgrounds/background1.jpg",
                                    imgEffect: "sepia",
                                },
                                {
                                    id: "2",
                                    title: PERSON_HEADERS[2].fullName,
                                    text: PERSON_HEADERS[2].description,
                                    imgSrc: "/backgrounds/background1.jpg",
                                    imgEffect: "sepia",
                                }
                            ]}
                        />
                        <VerticalTimeLine
                            title="Хронология событый"
                            items={TIMELINE}
                        />
                        <Gallery
                            title="Галлерея"
                            items={[
                                {id: "i0", src: "/backgrounds/background1.jpg", caption: "Фото номер 1"},
                                {id: "i1", src: "/backgrounds/background2.jpg", caption: "Фото номер 2"},
                                {id: "i2", src: "/backgrounds/background3.jpg", caption: "Фото номер 3"},
                                {id: "i3", src: "/backgrounds/background2.jpg", caption: "Фото номер 4"}
                            ]}
                        />

                    </div>

                </div>
            </main>
        </div>
    );
}
