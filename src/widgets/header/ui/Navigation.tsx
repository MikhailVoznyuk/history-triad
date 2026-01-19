'use client';
import React from "react";

import {useState, useEffect, useRef, useMemo} from "react";
import NavItem from "@/widgets/header/ui/NavItem";
import usePositions from "@/widgets/header/lib/usePositions";
import {makeScope, makeTimeline} from "@/shared/lib/anime";
import {initCircle, initPosition, linearMove, arcCW} from "@/widgets/header/lib/animations";

import type {NavItemData} from "@/widgets/header/model/types";
import type {Scope, TL} from "@/shared/lib/anime";
import type {PositionKey} from "@/widgets/header/lib/usePositions";

const PERSONS_DATA: NavItemData[]  = [
    {
        id: '0',
        shortName: 'Елисеев.Г.Г',
        img: '/persons/person1.webp',
    },
    {
        id: '1',
        shortName: 'Мартьянов Н.M',
        img: '/persons/person2.webp',
    },
    {
        id: '2',
        shortName: 'Лагидзе М.В',
        img: '/persons/person3.webp',
    },
]


export default function Navigation() {
    const [radius, setRadius] = useState(200);
    const positions = usePositions(radius);
    const navOrderRef = useRef<number[]>(PERSONS_DATA.map((el) => +el.id));

    const rootRef = useRef<HTMLDivElement | null>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const scopeRef = useRef<Scope | null>(null);
    const tlRef = useRef<TL | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);

    const isNavInit = useRef(false);
    const isNavUsed = useRef(false);

    const onSelect = (item: NavItemData) => {

        const tl = makeTimeline({autoplay: true});

        const navOrderPrev = navOrderRef.current.slice();
        const elementsRefPrev = elementsRef.current.slice();
        const newNavOrder = Array.from({length: navOrderPrev.length}, () => -1);
        const newElements: (HTMLDivElement | null)[] = Array.from({length: elementsRefPrev.length}, () => null);

        const orderPositions: PositionKey[] = ['center', 'left', 'right'];
        const orderIndexes = [0, 2, 1];
        const indexRelation = new Map<number, number>();
        if (!isNavUsed.current) {
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
                        linearMove(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]]);
                        continue;
                    }
                    arcCW(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]], radius, dur * 0.8, dur);

                }

            }

            console.log(newNavOrder)
            isNavUsed.current = true;

        } else {
            const arcDur = 600;
            const linDur = 400;
            console.log(navOrderPrev)
            const prevInd = navOrderPrev.findIndex((el) => el === +item.id) ?? 100;
            newNavOrder[0] = navOrderPrev[prevInd];
            newElements[0] = elementsRefPrev[prevInd];
            console.log(prevInd)
            linearMove(elementsRefPrev[0], tl, positions.center, positions.bottom, linDur);
            linearMove(newElements[0], tl, positions[orderPositions[prevInd]], positions.center, linDur, 0.8 * linDur);
            switch (prevInd) {
                case 1:
                    newNavOrder[1] = navOrderPrev[2];
                    newElements[1] = elementsRefPrev[2];
                    newNavOrder[2] = navOrderPrev[0];
                    newElements[2] = elementsRefPrev[0];
                    arcCW(newElements[2], tl, positions.bottom, positions[orderPositions[2]], radius, 0,  arcDur);
                    arcCW(newElements[1], tl, positions[orderPositions[2]], positions[orderPositions[1]], radius, 0.8 * arcDur, arcDur);
                    break
                case 2:
                    newNavOrder[1] = navOrderPrev[0];
                    newElements[1] = elementsRefPrev[0];
                    newNavOrder[2] = navOrderPrev[1];
                    newElements[2] = elementsRefPrev[1];
                    arcCW(newElements[1], tl, positions.bottom, positions[orderPositions[1]], radius, 0, arcDur);
                    arcCW(newElements[2], tl, positions[orderPositions[1]], positions[orderPositions[2]], radius, 0.8 * arcDur, arcDur);
            }

        }

        navOrderRef.current = newNavOrder;
        elementsRef.current = newElements;

    }
    useEffect(() => {
        if (isNavInit.current || isNavUsed.current) return;
        console.log('yes')
        tlRef.current = makeTimeline({autoplay: true});
        initPosition(elementsRef.current[0], tlRef.current, positions.center, positions.bottomLeft);
        initPosition(elementsRef.current[1], tlRef.current, positions.center, positions.top);
        initPosition(elementsRef.current[2], tlRef.current, positions.center, positions.bottomRight);
        initCircle(circleRef.current);
        isNavInit.current = true;
    }, []);



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

        </div>
    )
}