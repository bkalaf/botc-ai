// src/server/minionInfo.tsx
import z from 'zod';
import { InputSchema } from '../prompts/prompt-types';
import { ISeatedPlayer } from '../store/types/player-types';
import { CharacterTypes } from '../data/types';
import { addClaim } from '../store/memory/memory-slice';
import { RootState, AppDispatch } from '../store';
import { closeDialog, showDialog } from '../store/ui/ui-slice';
import { clearTask } from './clearTask';
import { $$ROLES } from '@/data/types';
import { setUnpause } from '../store/st-queue/st-queue-slice';

function getTypesFromSeats(seats: z.infer<typeof InputSchema>['extractedSeats'], characterType: CharacterTypes) {
    return seats
        .filter((arg) => arg.team === characterType)
        .map((arg) => ({
            ID: arg.ID,
            name: arg.name,
            controledBy: arg.controledBy,
            role: arg.role
        }));
}
async function reduceToPromise(dispatch: AppDispatch, ...funcs: (() => Promise<void>)[]) {
    const funcs2 = [...funcs, async () => clearTask(dispatch)];
    return await funcs2.reduce((pv, cv) => async () => {
        await pv();
        await cv();
    })();
}

export function minionInfo(state: RootState, dispatch: AppDispatch) {
    return async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        console.log(`minioninfo`);
        const demons = getTypesFromSeats(data.extractedSeats as any, 'demon');
        const minions = getTypesFromSeats(data.extractedSeats as any, 'minion');
        const evilTeam = [...demons, ...minions];
        const controls = () => {
            return (
                <div className='grid grid-cols-2'>
                    <div className='flex col-start-1'>Demons:</div>
                    {demons.map((el, ix) => (
                        <div
                            key={ix}
                            className='flex col-start-2'
                        >
                            Seat {el.ID}: {el.name}
                        </div>
                    ))}
                    <div className='flex col-start-1'>Minions:</div>
                    {minions.map((el, ix) => (
                        <div
                            key={ix}
                            className='flex col-start-2'
                        >
                            Seat {el.ID}: {el.name}
                        </div>
                    ))}
                </div>
            );
        };
        const funcs = evilTeam.map((element) => {
            return () =>
                new Promise<void>((resolve, reject) => {
                    if (element.controledBy === 'ai') {
                        dispatch(
                            addClaim({
                                ID: element.ID,
                                role: element.role,
                                data: {
                                    minions,
                                    demons
                                }
                            })
                        );
                        return resolve();
                    } else {
                        dispatch(
                            showDialog({
                                options: {
                                    title: 'Evil Team Info',
                                    message: 'You are shown:',
                                    Controls: controls
                                },
                                resolve: () => {
                                    dispatch(closeDialog());
                                    dispatch(setUnpause());
                                    return resolve();
                                },
                                reject: (reason: string) => {
                                    console.log(reason);
                                }
                            })
                        );
                    }
                });
        });
        await reduceToPromise(dispatch, ...funcs);
    };
}

export function demonInfo(state: RootState, dispatch: AppDispatch) {
    return async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        const demons = getTypesFromSeats(data.extractedSeats as any, 'demon');
        const controls = () => {
            return (
                <div className='grid grid-cols-2'>
                    {data.demonBluffs?.map((role) => (
                        <div
                            key={role}
                            className='flex'
                        >
                            {$$ROLES[role].name}
                        </div>
                    ))}
                </div>
            );
        };
        const funcs = demons.map((element) => {
            return () =>
                new Promise<void>((resolve, reject) => {
                    if (element.controledBy === 'ai') {
                        dispatch(addClaim({ ID: element.ID, role: element.role, data: { bluffs: data.demonBluffs } }));
                        return resolve();
                    } else {
                        dispatch(
                            showDialog({
                                options: { title: 'Demon Bluffs', message: 'You are shown:', Controls: controls },
                                resolve: () => {
                                    dispatch(closeDialog());
                                    setUnpause();
                                    return resolve();
                                },
                                reject: (reason: string) => {
                                    console.log(reason);
                                }
                            })
                        );
                    }
                });
        });
        await reduceToPromise(dispatch, ...funcs);
    };
}
