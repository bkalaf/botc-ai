// src/components/CharacterTokenParent.tsx
import { TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Tooltip } from './ui/tooltip';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { Label } from './ui/label';
import { Children } from '../types';
import { SkullIcon } from 'lucide-react';
import shroudImg from './../assets/images/town/shroud.png';
import { ShadedOverlay } from './ShadedOverlay';
import { FirstNightOrderBadge } from './FirstNightOrderBadge';
import { OtherNightOrderBadge } from './OtherNightOrderBadge';
import { RoleLabel } from './RoleLabel';
import { useAppSelector } from '@/store/hooks';
import {
    selectShowFirstNightOrder,
    selectShowNightOrder,
    selectShowOtherNightOrder
} from '@/store/settings/settings-slice';
import { CharacterTokenBase, DeathTokenBase, TokenBase } from './CharacterTokenBase';

export function CharacterTokenParent({
    ImgSize,
    x,
    y,
    name,
    role,
    children,
    isMarked,
    isAlive,
    characterType,
    alignment,
    isDrunk,
    isPoisoned,
    // reminderSlots,
    // reminderTokenSize,
    firstNightOrder,
    otherNightOrder,
    tokenSize
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
    isMarked?: boolean;
    characterType: CharacterTypes;
    alignment: 'good' | 'evil';
    isDrunk?: boolean;
    isPoisoned?: boolean;
    reminders?: string;
    reminderSlots?: Array<{ x: number; y: number }>;
    reminderTokenSize?: number;
    firstNightOrder?: number;
    otherNightOrder?: number;
}) {
    const { firstNight, firstNightReminder, otherNight, otherNightReminder, ability } = $$ROLES[role];
    const displayFirstNightOrder = firstNightOrder ?? firstNight;
    const displayOtherNightOrder = otherNightOrder ?? otherNight;
    const showNightOrder = useAppSelector(selectShowNightOrder);
    const showFirstNightOrder = useAppSelector(selectShowFirstNightOrder);
    const showOtherNightOrder = useAppSelector(selectShowOtherNightOrder);
    return (
        <>
            <button
                className='absolute grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring data-[alive-state="dead"]:bg-black/50 group'
                data-is-alive={isAlive}
                data-is-dead={!isAlive}
                data-character-type={characterType}
                data-alignment={alignment}
                data-is-marked={isMarked ?? false}
                data-is-drunk={isDrunk ?? false}
                data-is-poisoned={isPoisoned ?? false}
                data-alive-state={isAlive ? 'alive' : 'dead'}
                style={{ width: tokenSize, height: tokenSize, left: x, top: y }}
                type='button'
                onClick={() => alert('CLICKED')}
            >
                <CharacterTokenBase />
                <DeathTokenBase />
                {/* <ShadedOverlay /> */}

                <img
                    src={shroudImg}
                    alt=''
                    className='absolute top-0 w-1/3 h-2/3 invisible z-30 group-data-[is-dead=true]:visible'
                    draggable={false}
                    data-is-alive={isAlive}
                />
                {showNightOrder && showFirstNightOrder ?
                    <FirstNightOrderBadge
                        order={displayFirstNightOrder}
                        reminder={firstNightReminder}
                    />
                :   null}
                {showNightOrder && showOtherNightOrder ?
                    <OtherNightOrderBadge
                        order={displayOtherNightOrder}
                        reminder={otherNightReminder}
                    />
                :   null}

                <Tooltip>
                    <TooltipTrigger asChild></TooltipTrigger>
                    <TooltipContent className='z-40'>
                        <Label className='bg-slate-700 px-1.5 py-0.5 rounded-lg text-white text-lg text-wrap '>
                            {ability}
                        </Label>
                    </TooltipContent>
                </Tooltip>
                <FirstNightOrderBadge
                    order={displayFirstNightOrder}
                    reminder={firstNightReminder}
                />
                <OtherNightOrderBadge
                    order={displayOtherNightOrder}
                    reminder={otherNightReminder}
                />
                <div className='absolute bottom-0 text-white flex flex-col w-full text-2xl py-2 transform translate-y-1/2'>
                    <span
                        // className='flex place-self-center text-center bg-transparent mx-auto transform -translate-y-full w-full top-1/7 z-30 font-black px-1.5 py-0.5 justify-center'
                        className='font-rubik flex text-center transform font-extrabold text-base justify-center z-30 font-lg px-1.5 py-0.5 bg-black text-white'
                        id='role'
                    >
                        <RoleLabel role={'undertaker'} />
                    </span>
                    <Label
                        // className='w-full min-w-fit rounded-md shadow-inner border-white border-2 bg-black text-white text-center text-sm absolute bottom-0 font-bold transform translate-y-1/2 data-[character-type=demon]:bg-red-500 data-[character-type=minion]:bg-orange-500 data-[character-type=outsider]:bg-cyan-500 data-[character-type=townsfolk]:bg-blue-500 data-[character-type=traveler]:bg-yellow-500 px-1.5 py-0.5 justify-center z-30'
                        className='font-rubik flex bg-black w-full min-w-fit rounded-md shadow-inner text-white text-center font-extrabold text-base z-30 justify-center items-center border-2 border-gray-400 group-data-[character-type="demon"]:bg-rose-500 group-data-[character-type="minion"]:bg-fuchsia-400  group-data-[character-type="townsfolk"]:bg-blue-500 group-data-[character-type="traveler"]:bg-yellow-500 group-data-[character-type="outsider"]:bg-teal-500'
                        htmlFor=''
                        id='team'
                        data-character-type={$$ROLES[role].team}
                    >
                        NAME
                    </Label>
                </div>
            </button>
        </>
    );
}
