import {twMerge} from "tailwind-merge";
import React from 'react';

type StepButtonProps = {
    onClick: () => void;
    direction: 'inc' | 'dec';
    btnClassName?: string;
    btnStyle?: React.CSSProperties;
}

export function StepButton(
    {
        onClick,
        direction,
        btnClassName='',
        btnStyle={},
    }: StepButtonProps) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                'relative size-10 rounded-full flex justify-center items-center',
                btnClassName)
            }
            style={btnStyle}
        >
            <span className='asbolute w-6 h-1 bg-black'/>
            { direction === 'inc' &&
                <span
                    className='absolute w-6 h-1 bg-black origin-center'
                    style={{
                        transform: 'rotate(90deg)'
                    }}
                />
            }
        </button>
    )
}

