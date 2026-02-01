"use client"

import {useMemo, useEffect, useCallback} from "react";

import Header from "@/widgets/header";
import {MovingBackground} from "@/shared/ui/background";
import {useSelectPerson} from "@/features/select-person";
import {PersonHero} from "@/widgets/person-hero/ui/PersonHero";
import {TextSection} from "@/widgets/text-section";
import {TextImageSection} from "@/widgets/text-image-section";
import {VerticalTimeLine} from "@/widgets/timeline/ui/VerticalTimeLine";
import {Gallery} from "@/widgets/gallery";
import {TIMELINE} from "@/widgets/timeline/model/data";
import {persons} from "@/entities/model/data/persons";
import type {PersonData} from "@/widgets/person-hero/ui/PersonHero";
import type {ContentSection} from "@/entities/model/types";


const BACKGROUND_URLS = [
    '/backgrounds/background02.jpg',
    '/backgrounds/background1.jpg',
    '/backgrounds/background2.jpg',
    '/backgrounds/background3.jpg'
];

export default function Home() {
    const person = useSelectPerson();
    const r = useCallback((s: ContentSection) => {
        switch (s.t) {
            case "text":
                return <TextSection key={s.id} title={s.title} text={s.text} />;
            case "textImage":
                return <TextImageSection key={s.id} title={s.title}  blocks={s.blocks} />
            case "timeline":
                return <VerticalTimeLine key={s.id} title={s.title} items={s.items} />
            case "gallery":
                return <Gallery key={s.id} title={s.title} items={s.items} />
            default:
                return <div></div>
        }
    }, [])

    const PORTRAITS = useMemo(() => [
        'persons/eliseev/portrait.webp',
        'persons/martyanov/portrait.webp',
        'persons/lagidze/portrait.webp'
    ], []);

    const PERSON_HEADERS = useMemo<Array<PersonData>>(() => [
        {fullName: 'Григорий Григорьевич Елисеев', description: 'Предприниматель, при котором семейное дело выросло в сеть знаменитых магазинов нового типа. Елисеевские торговые дома стали не просто местом покупки продуктов, а городским пространством с собственными правилами: здесь важны были внешний вид, порядок, витрины, качество товара и манера обслуживания. Для своего времени это было заметным шагом вперед: торговля становилась публичной, «цивилизованной» и ориентированной на впечатление, удобство и доверие покупателя.'},
        {fullName: 'Николай Михайлович Мартьянов', description: 'Провизор и ученый-ботаник, человек, который превратил частный интерес к природе и предметам старины в городское дело. Поселившись в Минусинске в 1874 году, он собрал вокруг себя круг единомышленников и добился учреждения публичного музея. 6 июня 1877 года был утвержден устав, и эта дата считается основанием старейшего музея Сибири. В течение 27 лет Мартьянов руководил музеем, организовывал экспедиции, собирал ботанические, археологические и этнографические коллекции и сделал Минусинск заметной точкой на научной карте своего времени.'},
        {fullName: 'Митрофан Варламович Лагидзе', description: 'Изобретатель и предприниматель, сумевший превратить личную идею в новую культуру вкуса. Ученик аптекаря, он выбрал путь натуральных компонентов и настойчивых экспериментов, создавая сиропы из ягод, фруктов и трав родной Грузии. Его подход изменил представление о безалкогольных напитках: лимонад из ремесленного опыта стал массовым явлением, а имя Лагидзе закрепилось как знак качества, который пытались повторять и подделывать.'}
    ], [])

    useEffect(() => {
        const lock = person.idx === -1;
        if (lock) {
            window.scrollTo(0, 0);
            document.body.style.height = "100vh";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.height = "";
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.height = "";
            document.body.style.overflow = "";
        }
    }, [person.idx]);
    const anchorId = "hero";
    useEffect(() => {
        if (person.idx === -1) return;
        console.log(person.idx);
        requestAnimationFrame(() => {
            const el = document.getElementById(anchorId);
            el?.scrollIntoView({behavior: "smooth", block: "start"});
        })
    }, [person, anchorId]);

    const sections: ContentSection[] | null = ((person.idx !== -1) ? (persons[person.idx]?.sections ?? null) : null)

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-black font-sans "
        >
            <main className='w-full font-cormorant text-cloud'>
                <MovingBackground images={BACKGROUND_URLS} idx={person.idx}/>
                <div className="relative z-1">
                    <Header />
                    <div className="px-4 md:px-12 mt-12 flex flex-col gap-32 justify-start">
                        <PersonHero
                            curIdx={person.idx}
                            images={PORTRAITS}
                            headers={PERSON_HEADERS}
                            anchorId={anchorId}
                        />
                        {sections && sections.length > 0 && sections.map((s) => r(s))}

                    </div>

                </div>
            </main>
        </div>
    );
}
