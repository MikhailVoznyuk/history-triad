import {useMemo} from 'react';

export default function usePositions(r: number) {
    return useMemo(() => {
        const R = r;
        const d = Math.SQRT1_2;

        return {
            center: {x: 0, y: -R * 0.4, ang: 0},
            top: {x: 0, y: -R, ang: -90},
            bottom: {x: 0, y: R, ang: 90},
            left: {x: -R, y: 0, ang: 180},
            right: {x: R, y: 0, ang: 0},
            topLeft: {x: -d * R, y: -d * R, ang: -135},
            topRight: {x: d * R, y: -d * R, ang: -45},
            bottomLeft: {x: -d * R, y: d * R, ang: 135},
            bottomRight: {x: d * R, y: d * R, ang: 45}
        } as const
    }, [r]);
}

export type Positions = ReturnType<typeof usePositions>;
export type Position = Positions[keyof Positions];
export type PositionKey = keyof Positions;