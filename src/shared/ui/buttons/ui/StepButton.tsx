import {twMerge} from "tailwind-merge";
import React from 'react';

type StepButtonProps = {
    onClick: () => void;
    direction: 'inc' | 'dec';
    disabled?: boolean;
    btnClassName?: string;
    btnStyle?: React.CSSProperties;
}

export function StepButton(
    {
        onClick,
        direction,
        disabled,
        btnClassName='',
        btnStyle={},
    }: StepButtonProps) {
    return (
        <button

            onClick={onClick}
            disabled={disabled}
            className={twMerge(
                `relative size-7 sm:size-8 rounded-full flex justify-center items-center bg-gold hover:bg-white ${disabled ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300 ease-out`,
                btnClassName)
            }
            style={btnStyle}
        >
            <span className='asbolute w-4 sm:w-5 h-0.5 bg-graphite rounded-xl'/>
            { direction === 'inc' &&
                <span
                    className='absolute w-4 sm:w-5 h-0.5 bg-graphite origin-center rounded-xl'
                    style={{
                        transform: 'rotate(90deg)'
                    }}
                />
            }
        </button>
    )
}

