// src/server/minionInfo.tsx
import z from 'zod';
import { InputSchema } from '../prompts/prompt-types';
import { CharacterTypes } from '../data/types';
import { addClaim } from '../store/memory/memory-slice';
import { RootState, AppDispatch } from '../store';
import { openDialog } from '@/lib/dialogs';
import { clearTask } from './clearTask';
import { $$ROLES } from '@/data/types';
import { runTasks } from '../store/st-queue/st-queue-slice';

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
        const minionDialogData = {
            demons: demons.map((el) => ({ id: el.ID, name: el.name })),
            minions: minions.map((el) => ({ id: el.ID, name: el.name }))
        };
        const funcs = evilTeam.map((element) => {
            return async () => {
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
                    return;
                }
                const result = await openDialog({ dispatch, dialogType: 'minionInfo', data: minionDialogData });
                if (result.confirmed) {
                    dispatch(runTasks());
                }
            };
        });
        await reduceToPromise(dispatch, ...funcs);
    };
}

export function demonInfo(state: RootState, dispatch: AppDispatch) {
    return async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        const demons = getTypesFromSeats(data.extractedSeats as any, 'demon');
        const bluffNames = (data.demonBluffs ?? []).map((role) => $$ROLES[role].name);
        const funcs = demons.map((element) => {
            return async () => {
                if (element.controledBy === 'ai') {
                    dispatch(addClaim({ ID: element.ID, role: element.role, data: { bluffs: data.demonBluffs } }));
                    return;
                }
                const result = await openDialog({ dispatch, dialogType: 'demonInfo', data: { bluffs: bluffNames } });
                if (result.confirmed) {
                    dispatch(runTasks());
                }
            };
        });
        await reduceToPromise(dispatch, ...funcs);
    };
}
