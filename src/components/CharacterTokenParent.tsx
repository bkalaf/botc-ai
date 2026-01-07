// src/components/CharacterTokenParent.tsx
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { Label } from './ui/label';
import { Children } from '../types';
import shroudImg from './../assets/images/town/shroud.png';
import { FirstNightOrderBadge } from './FirstNightOrderBadge';
import { OtherNightOrderBadge } from './OtherNightOrderBadge';
import { NameLabel, RoleLabel } from './RoleLabel';
import { CharacterTokenBase, DeathTokenBase } from './CharacterTokenBase';
import { TooltipText } from './TooltipText';

export function CharacterTokenParent({
    x,
    y,
    name,
    role,
    isMarked,
    isAlive,
    characterType,
    alignment,
    isDrunk,
    isPoisoned,
    reminderSlots,
    reminderTokenSize,
    firstNightOrder,
    otherNightOrder,
    tokenSize,
    children
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
    const { firstNightReminder, otherNightReminder, ability } = $$ROLES[role];
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
                {children}
                <img
                    src={shroudImg}
                    alt=''
                    className='absolute top-0 w-1/3 h-2/3 invisible z-30 group-data-[is-dead=true]:visible'
                    draggable={false}
                    data-is-alive={isAlive}
                />

                {reminderSlots && reminderTokenSize ?
                    reminderSlots.map((slot, index) => (
                        <div
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
                        <RoleLabel role={role} />
                    </TooltipTrigger>
                    <TooltipContent className='bg-transparent w-auto'>
                        <TooltipText text={ability} />
                    </TooltipContent>
                </Tooltip>
                <NameLabel name={name ?? ''} />
                {/* <div className='absolute bottom-0 text-white flex flex-col w-full text-2xl transform'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <RoleLabel role={role} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-transparent w-auto'>
                            <TooltipText text={ability} />
                        </TooltipContent>
                    </Tooltip>
                    <NameLabel name={name ?? ''} />
                </div> */}
                <FirstNightOrderBadge
                    order={firstNightOrder ?? 0}
                    reminder={firstNightReminder}
                />
                <OtherNightOrderBadge
                    order={otherNightOrder ?? 0}
                    reminder={otherNightReminder}
                />
            </button>
        </>
    );
}
