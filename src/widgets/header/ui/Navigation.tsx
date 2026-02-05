'use client';
import React from "react";

import {useState, useEffect, useLayoutEffect, useRef} from "react";
import NavItem from "@/widgets/header/ui/NavItem";
import usePositions from "@/widgets/header/lib/usePositions";
import {makeTimeline} from "@/shared/lib/anime";
import {initCircle, initPosition, linearMove, arcCW, changeOpacity, customTranslate} from "@/widgets/header/lib/animations";
import {useSelectPerson} from "@/features/select-person";
import {MovingHeader, HeaderEmpty} from "@/widgets/header/ui/movingHeader";
import {animeUtils} from "@/shared/lib/anime";

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
    {
        id: '3',
        shortName: 'Unknown',
        info: '1869–1960',
        img: '/persons/person3.webp',
    },

]


export default function Navigation() {
    const getRad = () => (typeof window !== "undefined" && window.innerWidth < 500 ) ? 120 : 200;
    const person = useSelectPerson();
    const [radius, setRadius] = useState(getRad());
    const positions = usePositions(radius);
    const navOrderRef = useRef<number[]>(PERSONS_DATA.map((el) => +el.id));

    const rootRef = useRef<HTMLDivElement | null>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const scopeRef = useRef<Scope | null>(null);
    const tlRef = useRef<TL | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const headerEmptyRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const [isNavInit, setIsNavInit] = useState<boolean>(false);
    const [isNavUsed, setIsNavUsed] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const pl = PERSONS_DATA.length;

    const onSelect = (item: NavItemData) => {
        setIsAnimating(true);

        const tl = makeTimeline({autoplay: true});

        const navOrderPrev = navOrderRef.current.slice();
        const elementsRefPrev = elementsRef.current.slice();
        const newNavOrder = Array.from({length: navOrderPrev.length}, () => -1);
        const newElements: (HTMLDivElement | null)[] = Array.from({length: elementsRefPrev.length}, () => null);

        const orderPositions: PositionKey[] = (pl === 3) ?
            ['center', 'left', 'right'] :
            ['center', 'topLeft', 'bottom', 'topRight']
        ;
        const orderIndexes = (pl === 3) ? [0, 2, 1] : [0, 3, 2, 1];
        const indexRelation = new Map<number, number>();
        const choosedInd = navOrderPrev.findIndex((i) => i === +item.id);
        if (!isNavUsed) {

            changeOpacity(headerEmptyRef.current, tl, 0, 400);

            const dur = 800;
            const initPositions: PositionKey[] = (pl === 3) ?
                ['bottomLeft', 'top', 'bottomRight'] :
                ['left', 'top', 'right', 'bottom'];

            for (let i = 0; i < navOrderPrev.length; i++) {
                console.log(i);
                if (navOrderPrev[i] == +item.id) {
                    newNavOrder[0] = navOrderPrev[i];
                    newElements[0] = elementsRefPrev[i];
                    indexRelation.set(0, i);
                    continue;
                }

                switch (i) {
                    case 0:
                        if (pl === 3) {
                            newNavOrder[2] = navOrderPrev[i];
                            newElements[2] = elementsRefPrev[i];
                            indexRelation.set(2, i);
                        } else {
                            newNavOrder[3] = navOrderPrev[i];
                            newElements[3] = elementsRefPrev[i];
                            indexRelation.set(3, i);
                        }
                        break
                    case 1:
                        if (pl === 3) {
                            newNavOrder[1] = navOrderPrev[i];
                            newElements[1] = elementsRefPrev[i];
                            indexRelation.set(1, i);
                        } else {
                            newNavOrder[2] = navOrderPrev[i];
                            newElements[2] = elementsRefPrev[i];
                            indexRelation.set(2, i);
                        }

                        break;
                    case 2:
                        console.log('cheack order', newNavOrder)
                        if (pl === 3) {
                            if (newNavOrder[1] == -1) {
                                newNavOrder[1] = navOrderPrev[i];
                                newElements[1] = elementsRefPrev[i];
                                indexRelation.set(1, i);
                            } else {
                                newNavOrder[2] = navOrderPrev[i];
                                newElements[2] = elementsRefPrev[i];
                                indexRelation.set(2, i);
                            }
                        } else {
                            newNavOrder[1] = navOrderPrev[i];
                            newElements[1] = elementsRefPrev[i];
                            indexRelation.set(1, i);
                        }
                        break;
                    case 3:
                        if (newNavOrder[1] === -1) {
                            newNavOrder[1] = navOrderPrev[i];
                            newElements[1] = elementsRefPrev[i];
                            indexRelation.set(1, i);
                        } else if (newNavOrder[3] === -1) {
                            newNavOrder[3] = navOrderPrev[i];
                            newElements[3] = elementsRefPrev[i];
                            indexRelation.set(3, i);
                        } else {
                            newNavOrder[1] = navOrderPrev[i];
                            newElements[1] = elementsRefPrev[i];
                            newNavOrder[2] = navOrderPrev[i - 1];
                            newElements[2] = elementsRefPrev[i - 1];
                            indexRelation.set(1, i);
                            indexRelation.set(2, i - 1);

                        }
                }
            }

            for (const i of orderIndexes) {
                const oldInd = indexRelation.get(i) ?? 0;
                const el = elementsRefPrev[oldInd];
                console.log(oldInd, initPositions[oldInd],orderPositions[i])
                if (tlRef.current) {
                    if (i == 0) {
                        linearMove(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]], 500, 0, 1.4);
                        continue;
                    }
                    arcCW(el, tl, positions[initPositions[oldInd]], positions[orderPositions[i]], radius, dur * 0.8, dur);
                }
            }

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
            const prevBottomEl = (pl == 4) ? elementsRefPrev[navOrderPrev[2]] : null;
            const prevRightEl = (pl == 4) ? elementsRefPrev[navOrderPrev[3]] : elementsRefPrev[navOrderPrev[2]];
            linearMove(prevCenterEl, tl, positions.center, positions.top, linDur);
            linearMove(newElements[0], tl, positions[orderPositions[prevInd]], positions.center, linDur, 0.8 * linDur, 1.4);
            switch (prevInd) {
                case 1:
                    if (pl === 3) {
                        newNavOrder[1] = navOrderPrev[2];
                        newElements[1] = prevRightEl;
                        newNavOrder[2] = navOrderPrev[0];
                        newElements[2] = prevCenterEl;
                        arcCW(newElements[2], tl, positions.top, positions[orderPositions[2]], radius, 0,  arcDur);
                        arcCW(newElements[1], tl, positions[orderPositions[2]], positions[orderPositions[1]], radius, 0.8 * arcDur, arcDur);

                    } else {
                        newNavOrder[1] = navOrderPrev[2];
                        newElements[1] = prevBottomEl;
                        newNavOrder[2] = navOrderPrev[3];
                        newElements[2] = prevRightEl;
                        newNavOrder[3] = navOrderPrev[0];
                        newElements[3] = prevCenterEl;
                        arcCW(newElements[1], tl, positions[orderPositions[2]], positions[orderPositions[1]], radius, 0, arcDur);
                        arcCW(newElements[2], tl, positions[orderPositions[3]], positions[orderPositions[2]], radius, 0, arcDur);
                        console.log(orderPositions)
                        arcCW(newElements[3], tl, positions.top, positions[orderPositions[3]], radius, 0, arcDur);
                    }
                    break;


                case 2:
                    if (pl === 3) {
                        newNavOrder[1] = navOrderPrev[0];
                        newElements[1] = prevCenterEl;
                        newNavOrder[2] = navOrderPrev[1];
                        newElements[2] = prevLeftEl;
                        arcCW(newElements[1], tl, positions.top, positions[orderPositions[1]], radius, 0, arcDur);
                        arcCW(newElements[2], tl, positions[orderPositions[1]], positions[orderPositions[2]], radius, 0.8 * arcDur, arcDur);
                    } else {
                        newNavOrder[1] = navOrderPrev[3];
                        newElements[1] = prevRightEl;
                        newNavOrder[2] = navOrderPrev[0];
                        newElements[2] = prevCenterEl;
                        newNavOrder[3] = navOrderPrev[1];
                        newElements[3] = prevLeftEl;
                        arcCW(newElements[1], tl, positions[orderPositions[3]], positions[orderPositions[1]], radius, 0.8 * arcDur, arcDur);
                        arcCW(newElements[2], tl, positions.top, positions[orderPositions[2]], radius, 0.8 * arcDur, arcDur);
                        arcCW(newElements[3], tl, positions[orderPositions[1]], positions[orderPositions[3]], radius, 0.8 * arcDur, arcDur);
                    }
                    break

                case 3:
                    if (pl === 3) break;

                    newNavOrder[1] = navOrderPrev[2];
                    newElements[1] = prevBottomEl;
                    newNavOrder[2] = navOrderPrev[0];
                    newElements[2] = prevCenterEl;
                    newNavOrder[3] = navOrderPrev[1];
                    newElements[3] = prevLeftEl;
                    arcCW(newElements[1], tl, positions[orderPositions[2]], positions[orderPositions[1]], radius, 0.8 * arcDur, arcDur);
                    arcCW(newElements[2], tl, positions.top, positions[orderPositions[2]], radius, 0.8 * arcDur, arcDur);
                    arcCW(newElements[3], tl, positions[orderPositions[1]], positions[orderPositions[3]], radius, 0.8 * arcDur, arcDur);


            }
        }

        tl.then(() => {
            setIsAnimating(false);
            setIsNavUsed(true);
            person.set(+item.id);

        })
        navOrderRef.current = newNavOrder;
    }
    useEffect(() => {
        if (isNavInit || isNavUsed) return;
        tlRef.current = makeTimeline({autoplay: true});
        if (pl === 3) {
            initPosition(elementsRef.current[0], tlRef.current, positions.center, positions.bottomLeft);
            initPosition(elementsRef.current[1], tlRef.current, positions.center, positions.top);
            initPosition(elementsRef.current[2], tlRef.current, positions.center, positions.bottomRight);
        } else {
            initPosition(elementsRef.current[0], tlRef.current, positions.center, positions.left);
            initPosition(elementsRef.current[1], tlRef.current, positions.center, positions.top);
            initPosition(elementsRef.current[2], tlRef.current, positions.center, positions.right);
            initPosition(elementsRef.current[3], tlRef.current, positions.center, positions.bottom);
        }
        initCircle(circleRef.current);
        changeOpacity(headerEmptyRef.current, tlRef.current, 1, 400);
    }, []);

    useEffect(() => {
        const calcRad = () => {
            rafRef.current = null;
            const w = window.innerWidth;
            if (w < 500) {
                setRadius(120)
            } else {
                setRadius(200);
            }
        }

        const onResize = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(calcRad);
        }

        calcRad();

        window.addEventListener('resize', onResize);

        return ( () => {
            window.removeEventListener('resize', onResize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        })
    }, []);

    useLayoutEffect(() => {
        const els = elementsRef.current;
        if (!els[0] || !els[1] || !els[2] || (PERSONS_DATA.length === 4 && !els[3])) return;

        const slots: PositionKey[] = PERSONS_DATA.length === 3 ?
            (isNavUsed ?
                ["center", "left", "right"] :
                ["bottomLeft", "top", "bottomRight"]) :
            (isNavUsed ?
                ["center", "topLeft", "bottom", "topRight"] :
                ['left', 'top', 'right', 'bottom'])


        const order = isNavUsed ? navOrderRef.current : ((pl === 3) ? [0, 1, 2] : [0, 1, 2, 3, 4]);

        for (let k = 0; k < slots.length; k++) {
            const id = order[k];
            const el = els[id];
            if (!el) continue;

            const p = positions[slots[k]];

            animeUtils.set(el, {
                translateX: p.x,
                translateY: p.y,
            });
        }
    }, [positions, isNavUsed]);



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
                }} />
            <div className="absolute w-0 h-0 left-1/2 top-1/2">
                {PERSONS_DATA.map(
                    (item) => (
                        <NavItem
                            item={item}
                            ref={(el: HTMLDivElement | null) => {
                                elementsRef.current[+item.id] = el
                            }}
                            key={item.id}
                            onSelect={() => (+item.id != person.idx) && onSelect(item)}
                            isAnimating={isAnimating}
                        />
                    ))
                }
            </div>
            {
                (isNavUsed) ?
                    <div
                        ref={headerRef}
                        className={"absolute w-fit h-24 min-w-44 sm:min-w-56  left-1/2 top-1/2 -translate-x-1/2  overflow-hidden"}
                        style={{
                            padding: (isNavUsed) ? '0' : '20px',
                            transform: `${(radius === 200) ? 'translateY(30px)' : 'translateY(10px)'}`,
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
                        className="absolute w-fit h-20 sm:h-24 min-w-44  sm:min-w-52 flex align-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0">
                        <HeaderEmpty />
                    </div>
            }
        </div>
    )
}