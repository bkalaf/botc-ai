// src/server/minionInfo.tsx
import z from 'zod';
import { InputSchema } from '../prompts/prompt-types';
import { CharacterTypes } from '../data/types';
import { addDemonBluffsClaim, addEvilTeamClaim } from '../store/memory/memory-slice';
import { RootState, AppDispatch } from '../store';
import { openDialog } from '@/lib/dialogs';
import { clearTask } from './clearTask';
import { $$ROLES } from '@/data/types';
import { closeDialog } from '../store/ui/ui-slice';

function getTypesFromSeats(seats: z.infer<typeof InputSchema>['extractedSeats'], characterType: CharacterTypes) {
    return Object.values(seats)
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
        const seats = Object.values(data.extractedSeats)
            .filter((x) => evilTeam.map((y) => y.ID).includes(x.ID))
            .some((x) => x.controledBy === 'human');
        dispatch(
            addEvilTeamClaim({
                day: 1,
                source: 'storyteller',
                ID: 0,
                data: {
                    demons: demons.map((x) => x.ID),
                    minions: minions.map((x) => x.ID)
                }
            })
        );
        if (seats) {
            return await openDialog({
                dispatch,
                dialogType: 'minionInfo',
                data: minionDialogData,
                resolve: async () => {
                    dispatch(closeDialog());
                }
            });
        }
    };
}

export function demonInfo(state: RootState, dispatch: AppDispatch) {
    return async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        const demons = getTypesFromSeats(data.extractedSeats as any, 'demon');
        const bluffNames = (data.demonBluffs ?? []).map((role) => $$ROLES[role].name);
        for (const element of demons) {
            if (element.controledBy === 'ai') {
                dispatch(
                    addDemonBluffsClaim({ data: { demonBluffs: data.demonBluffs ?? [] }, day: 1, ID: element.ID })
                );
                return;
            }
            return await openDialog({
                dispatch,
                dialogType: 'demonInfo',
                data: { bluffs: bluffNames },
                resolve: async () => {
                    dispatch(closeDialog());
                }
            });
        }
    };
}
