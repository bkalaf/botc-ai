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
    seatID,
    isDrunk,
    isPoisoned,
    reminders,
    reminderSlots,
    reminderTokenSize,
    firstNightOrder,
    otherNightOrder
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
    return (
        <>
            <button
                className='absolute grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring data-[is-alive=false]:bg-black/50 group'
                data-is-alive={isAlive}
                data-is-dead={!isAlive}
                data-character-type={characterType}
                data-alignment={alignment}
                data-is-marked={isMarked ?? false}
                data-is-drunk={isDrunk ?? false}
                data-is-poisoned={isPoisoned ?? false}
                style={{ width: tokenSize, height: tokenSize, left: x, top: y }}
                type='button'
                onClick={() => alert('CLICKED')}
            >
                {/* <div
                        className='absolute inset-0 h-full w-full rounded-full border-0 ring-0 outline-0 data-[character-type="demon"]:bg-rose-300/80 data-[character-type="minion"]:bg-orange-300/80 data-[character-type="outsider"]:bg-purple-300/80 data-[character-type="townsfolk"]:bg-blue-300/80'
                        data-character-type={characterType}
                    /> */}
                <ShadedOverlay />
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
                {reminderSlots && reminderTokenSize ?
                    reminderSlots.map((slot, index) => (
                        <span
                            key={`reminder-slot-${index}`}
                            className='absolute rounded-full border border-dashed border-muted-foreground/40 opacity-0'
                            style={{
                                width: reminderTokenSize,
                                height: reminderTokenSize,
                                left: slot.x - x,
                                top: slot.y - y
                            }}
                            aria-hidden='true'
                            data-reminder-slot
                        />
                    ))
                :   null}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className='place-self-center text-center bg-transparent mx-auto transform -translate-y-full absolute w-full top-1/7 z-30 font-black px-1.5 py-0.5 justify-center'>
                            <Label className='w-full min-w-fit rounded-md shadow-inner border-black border-2 bg-white text-center font-bold px-1 py-0.5 justify-center z-30 transform translate-y-2/3 text-black text-base group-data-[character-type=demon]:bg-red-500 group-data-[character-type=minion]:bg-orange-500 group-data-[character-type=outsider]:bg-cyan-500 group-data-[character-type=townsfolk]:bg-blue-500 group- data-[character-type=traveler]:bg-yellow-500 '>
                                {$$ROLES[role]?.name}
                            </Label>
                        </span>
                    </TooltipTrigger>
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
                <Label
                    className='w-full min-w-fit rounded-md shadow-inner border-white border-2 bg-black text-white text-center text-sm absolute bottom-0 font-bold transform translate-y-1/2 data-[character-type=demon]:bg-red-500 data-[character-type=minion]:bg-orange-500 data-[character-type=outsider]:bg-cyan-500 data-[character-type=townsfolk]:bg-blue-500 data-[character-type=traveler]:bg-yellow-500 px-1.5 py-0.5 justify-center z-30'
                    htmlFor=''
                    data-character-type={$$ROLES[role].team}
                >
                    {name}
                </Label>
            </button>
        </>
    );
}
