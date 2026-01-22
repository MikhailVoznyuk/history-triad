'use client';
import React from "react";

import {useState, useEffect, useRef} from "react";
import NavItem from "@/widgets/header/ui/NavItem";
import usePositions from "@/widgets/header/lib/usePositions";
import {makeTimeline} from "@/shared/lib/anime";
import {initCircle, initPosition, linearMove, arcCW, changeOpacity, customTranslate} from "@/widgets/header/lib/animations";
import {useSelectPerson} from "@/features/select-person";
import {MovingHeader, HeaderEmpty} from "@/widgets/header/ui/movingHeader";

import type {NavItemData} from "@/widgets/header/model/types";
import type {Scope, TL} from "@/shared/lib/anime";
import type {PositionKey} from "@/widgets/header/lib/usePositions";

const PERSONS_DATA: NavItemData[]  = [
    {
        id: '0',
        shortName: 'Елисеев.Г.Г',
        info: '1864–1949',
        img: '/persons/person1.webp',
    },
    {
        id: '1',
        shortName: 'Мартьянов Н.M',
        info: '1844–1904',
        img: '/persons/person2.webp',
    },
    {
        id: '2',
        shortName: 'Лагидзе М.В',
        info: '1869–1960',
        img: '/persons/person3.webp',
    },
]


export default function Navigation() {
    const person = useSelectPerson();
    const [radius, setRadius] = useState(200);
    const positions = usePositions(radius);
    const navOrderRef = useRef<number[]>(PERSONS_DATA.map((el) => +el.id));

    const rootRef = useRef<HTMLDivElement | null>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const scopeRef = useRef<Scope | null>(null);
    const tlRef = useRef<TL | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const headerEmptyRef = useRef<HTMLDivElement | null>(null);

    const [isNavInit, setIsNavInit] = useState<boolean>(false);
    const [isNavUsed, setIsNavUsed] = useState<boolean>(false);

    const onSelect = (item: NavItemData) => {
        person.set(+item.id);

        const tl = makeTimeline({autoplay: true});

        const navOrderPrev = navOrderRef.current.slice();
        const elementsRefPrev = elementsRef.current.slice();
        const newNavOrder = Array.from({length: navOrderPrev.length}, () => -1);
        const newElements: (HTMLDivElement | null)[] = Array.from({length: elementsRefPrev.length}, () => null);

        const orderPositions: PositionKey[] = ['center', 'left', 'right'];
        const orderIndexes = [0, 2, 1];
        const indexRelation = new Map<number, number>();
        if (!isNavUsed) {

            changeOpacity(headerEmptyRef.current, tl, 0, 400);



            const dur = 800;
            const initPositions: PositionKey[] = ['bottomLeft', 'top', 'bottomRight'];
            for (let i = 0; i < navOrderPrev.length; i++) {
                if (navOrderPrev[i] == +item.id) {
                    newNavOrder[0] = navOrderPrev[i];
                    newElements[0] = elementsRefPrev[i];
                    indexRelation.set(0, i);
                    continue;
                }

                switch (i) {
                    case 0:
                        newNavOrder[2] = navOrderPrev[i];
                        newElements[2] = elementsRefPrev[i];
                        indexRelation.set(2, i);
                        break
                    case 1:
                        newNavOrder[1] = navOrderPrev[i];
                        newElements[1] = elementsRefPrev[i];
                        indexRelation.set(1, i);
                        break;
                    case 2:
                        if (newNavOrder[1] == -1) {
                            newNavOrder[1] = navOrderPrev[i];
                            newElements[1] = elementsRefPrev[i];
                            indexRelation.set(1, i);
                        } else {
                            newNavOrder[2] = navOrderPrev[i];
                            newElements[2] = elementsRefPrev[i];
                            indexRelation.set(2, i);
                        }
                }
            }
            for (const i of orderIndexes) {
                const oldInd = indexRelation.get(i) ?? 0;
                const el = elementsRefPrev[oldInd];
                if (tlRef.current) {
                    if (i == 0) {
                        linearMove(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]], 500, 0, 1.4);
                        continue;
                    }
                    arcCW(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]], radius, dur * 0.8, dur);

                }

            }



            tl.then(() => {
                setIsNavUsed(true);

            })




        } else {
            const arcDur = 600;
            const linDur = 400;
            const prevInd = navOrderPrev.findIndex((el) => el === +item.id);
            if (prevInd < 0) return;

            const selectedId = navOrderPrev[prevInd];
            const selectedEl = elementsRefPrev[selectedId];

            newNavOrder[0] = selectedId;
            newElements[0] = selectedEl;

            const prevCenterEl = elementsRefPrev[navOrderPrev[0]];
            const prevLeftEl = elementsRefPrev[navOrderPrev[1]];
            const prevRightEl = elementsRefPrev[navOrderPrev[2]];
            linearMove(prevCenterEl, tl, positions.center, positions.top, linDur);
            linearMove(newElements[0], tl, positions[orderPositions[prevInd]], positions.center, linDur, 0.8 * linDur, 1.4);
            switch (prevInd) {
                case 1:
                    newNavOrder[1] = navOrderPrev[2];
                    newElements[1] = prevRightEl;
                    newNavOrder[2] = navOrderPrev[0];
                    newElements[2] = prevCenterEl;

                    arcCW(newElements[2], tl, positions.top, positions[orderPositions[2]], radius, 0,  arcDur);
                    arcCW(newElements[1], tl, positions[orderPositions[2]], positions[orderPositions[1]], radius, 0.8 * arcDur, arcDur);
                    break
                case 2:
                    newNavOrder[1] = navOrderPrev[0];
                    newElements[1] = prevCenterEl;
                    newNavOrder[2] = navOrderPrev[1];
                    newElements[2] = prevLeftEl;
                    arcCW(newElements[1], tl, positions.top, positions[orderPositions[1]], radius, 0, arcDur);
                    arcCW(newElements[2], tl, positions[orderPositions[1]], positions[orderPositions[2]], radius, 0.8 * arcDur, arcDur);
            }
        }

        navOrderRef.current = newNavOrder;
    }
    useEffect(() => {
        if (isNavInit || isNavUsed) return;
        tlRef.current = makeTimeline({autoplay: true});
        initPosition(elementsRef.current[0], tlRef.current, positions.center, positions.bottomLeft);
        initPosition(elementsRef.current[1], tlRef.current, positions.center, positions.top);
        initPosition(elementsRef.current[2], tlRef.current, positions.center, positions.bottomRight);
        initCircle(circleRef.current);
        changeOpacity(headerEmptyRef.current, tlRef.current, 1, 400);
    }, []);


    console.log('aa', isNavUsed);
    return (
        <div ref={rootRef}
             className={`flex relative justify-center items-center`}
             style={{
                 width: radius * 2,
                 height: radius * 2,
             }}
        >
            <div ref={circleRef} className={`absolute border-cloud border-2 rounded-[50%]`}
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    transform: 'scale(0)'
                }}></div>
            <div className="absolute w-0 h-0 left-1/2 top-1/2">
                {PERSONS_DATA.map(
                    (item) => (
                        <NavItem
                            item={item}
                            ref={(el: HTMLDivElement | null) => {
                                elementsRef.current[+item.id] = el
                            }}
                            key={item.id}
                            onSelect={() => onSelect(item)}

                        />
                    ))
                }
            </div>
            {
                (isNavUsed) ?
                    <div
                        ref={headerRef}
                        className={"absolute w-fit h-24 min-w-56 left-1/2 top-1/2 -translate-x-1/2  overflow-hidden"}
                        style={{
                            padding: (isNavUsed) ? '0' : '20px',
                            transform: `translateY(30px)`,
                            opacity: (isNavUsed) ? 1 : 0,
                            transition: '0.3s ease'
                        }}
                    >

                        <MovingHeader
                            idx={person.idx}
                            headers={PERSONS_DATA.map(item => {
                                return {
                                    mainText: item.shortName,
                                    addText: item.info,
                                }
                            })}
                        />

                    </div> :
                    <div
                        ref = {headerEmptyRef}
                        className="absolute w-fit h-24 min-w-56 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0">
                        <HeaderEmpty />
                    </div>
            }

        </div>
    )
}