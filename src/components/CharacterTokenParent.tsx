// src/components/CharacterTokenParent.tsx
import { TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Tooltip } from './ui/tooltip';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { Label } from './ui/label';
import { Children } from '../types';
import { SkullIcon } from 'lucide-react';
import shroudImg from './../assets/images/town/shroud.png';
import { Badge } from './ui/badge';

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
    isAlive,
    characterType,
    alignment,
    seatID
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
                    className='absolute grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring data-[is-alive=false]:bg-black/50 group'
                    data-is-alive={isAlive}
                    style={{ width: tokenSize, height: tokenSize, left: x, top: y }}
                    type='button'
                    onClick={() => alert('CLICKED')}
                >
                    {/* <div
                        className='absolute inset-0 h-full w-full rounded-full border-0 ring-0 outline-0 data-[character-type="demon"]:bg-rose-300/80 data-[character-type="minion"]:bg-orange-300/80 data-[character-type="outsider"]:bg-purple-300/80 data-[character-type="townsfolk"]:bg-blue-300/80'
                        data-character-type={characterType}
                    /> */}
                    <div
                        className='invisible data-[is-alive=false]:visible absolute inset-0 h-full w-full rounded-full bg-black/65 z-10  border-0 ring-0 outline-0'
                        data-is-alive={isAlive}
                    />
                    <Badge className='absolute right-0 top-1/2 min-w-6 h-6 z-40 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-extrabold text-lg group-data-[is-alive=false]:invisible'>
                        1
                    </Badge>
                    <Badge className='absolute left-0 top-1/2 min-w-6 h-6 z-40 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white font-extrabold text-lg group-data-[is-alive=false]:invisible'>
                        1
                    </Badge>
                    <img
                        src={shroudImg}
                        alt=''
                        className='absolute top-0 w-1/3 h-2/3 invisible z-30 data-[is-alive=false]:visible'
                        draggable={false}
                        data-is-alive={isAlive}
                    />
                    <SkullIcon
                        className='absolute inset-0 w-full h-full object-over pointer-events-none invisible data-[is-marked=true]:visible z-20 opacity-50 group-data-[is-alive=false]:invisible'
                        data-is-marked={isMarked}
                    />
                    {children}
                    <span className='place-self-center text-center bg-transparent mx-auto transform -translate-y-full absolute w-full top-1/7 z-30 font-black text-black text-base'>
                        <Label className='w-full min-w-fit rounded-md shadow-inner border-black border-2 bg-white text-black text-sm text-center font-bold px-1 py-0.5 justify-center z-30'>
                            {$$ROLES[role]?.name}
                        </Label>
                    </span>
                    <Label
                        className='w-full min-w-fit rounded-md shadow-inner border-white border-2 bg-black text-white text-center text-sm absolute bottom-0 font-bold transform translate-y-1/2 data-[character-type=demon]:bg-red-500 data-[character-type=minion]:bg-orange-500 data-[character-type=outsider]:bg-cyan-500 data-[character-type=townsfolk]:bg-blue-500 data-[character-type=traveler]:bg-yellow-500 px-1.5 py-0.5 justify-center z-30'
                        htmlFor=''
                        data-character-type={$$ROLES[role].team}
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
