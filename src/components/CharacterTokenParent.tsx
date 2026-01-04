// src/components/CharacterTokenParent.tsx
import { TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Tooltip } from './ui/tooltip';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { Label } from './ui/label';
import { Children } from '../types';
import { SkullIcon } from 'lucide-react';
import shroudImg from './../assets/images/town/shroud.png';

// src/components/CharacterTokenParent.tsx
export function CharacterTokenParent({
    tokenSize,
    x,
    y,
    name,
    thinks,
    role,
    children,
    isMarked,
    isAlive
}: {
    tokenSize: number;
    x: number;
    y: number;
    role: Roles;
    thinks?: Roles;
    name?: string;
    seatID: number;
    children?: Children;
    isAlive: boolean;
    isMarked: boolean;
    characterType: CharacterTypes;
    alignment: 'good' | 'evil';
}) {
    return (
        <>
            <Tooltip>
                <button
                    className='absolute grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring'
                    style={{ width: tokenSize, height: tokenSize, left: x, top: y }}
                    type='button'
                    onClick={() => alert('CLICKED')}
                >
                    <img
                        src={shroudImg}
                        alt=''
                        className='absolute top-0 w-1/2 h-1/2 invisible z-30 data-is-alive:false:visible'
                        draggable={false}
                        data-is-alive={isAlive}
                    />
                    <SkullIcon
                        className='absolute inset-0 w-full h-full object-over pointer-events-none invisible data-[is-marked=true]:visible z-20 opacity-50'
                        data-is-marked={isMarked}
                    />
                    {children}
                    <span className='text-center bg-transparent mx-auto'>{$$ROLES[role]?.name}</span>
                    <Label
                        className='w-full min-w-fit rounded-md shadow-inner border-white border-2 bg-black text-white text-center text-sm absolute bottom-0 font-bold transform translate-y-1/2 data-[character-type=demon]:bg-red-500 data-[character-type=minion]:bg-orange-500 data-[character-type=outsider]:bg-cyan-500 data-[character-type=townsfolk]:bg-blue-500 data-[character-type=traveler]:bg-yellow-500 px-1.5 py-0.5 justify-center'
                        htmlFor=''
                        data-character-type={role === 'empath' ? 'townsfolk' : 'demon'}
                    >
                        {name}
                    </Label>
                </button>
                <TooltipTrigger>
                    <TooltipContent>Ability Text</TooltipContent>
                </TooltipTrigger>
            </Tooltip>
        </>
    );
}
