import {useMemo} from 'react';

export default function usePositions(r: number) {
    return useMemo(() => {
        const R = r;
        const a = Math.PI / 6;
        const cx = Math.cos(a);
        const sy = Math.sin(a);


        return {
            center: {x: 0, y: -R * 0.4, ang: 0},
            top: {x: 0, y: -R, ang: -90},
            bottom: {x: 0, y: R, ang: 90},
            left: {x: -R, y: 0, ang: 180},
            right: {x: R, y: 0, ang: 0},
            topLeft: {x: -cx * R, y: -sy * R, ang: -150},
            topRight: {x: cx  * R, y: -sy * R, ang: -30},
            bottomLeft: {x: -cx * R, y: sy * R, ang: 150},
            bottomRight: {x: cx * R, y: sy * R, ang: 30}
        } as const
    }, [r]);
}

export type Positions = ReturnType<typeof usePositions>;
export type Position = Positions[keyof Positions];
export type PositionKey = keyof Positions;