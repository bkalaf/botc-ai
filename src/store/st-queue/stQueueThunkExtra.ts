// src/store/st-queue/stQueueThunkExtra.ts
import { Roles } from '../../data/types';
import { $$serverFirstFns } from '../../server';
import { demonBluffsServerFn } from '../../server/demonBluffs';
import { drunkChoiceServerFn } from '../../server/drunkChoice';
import { fortuneTellerRedHerringServerFn } from '../../server/fortunetellerRedHerring';
import { travelerAlignmentServerFn } from '../../server/travelerAlignment';
import { selectDay, selectPhase } from '../game/game-slice';
import {
    selectSeatedPlayers,
    selectDemonBluffs,
    selectOutOfPlay,
    setMaskedRole,
    addReminderToken,
    setDemonBluffs,
    setAlignment
} from '../grimoire/grimoire-slice';
import type { StorytellerQueueThunkExtra, IStorytellerQueueItem } from '../st-queue-types';

export const stQueueThunkExtra: StorytellerQueueThunkExtra = {
    stHandlers: {
        first_night: async (task: IStorytellerQueueItem, api) => {
            console.log(`task`, task);
            const func = $$serverFirstFns[task.id as keyof typeof $$serverFirstFns];
            if (func == null) throw new Error(`could not find: ${task.id}`);
            const extractedSeats = selectSeatedPlayers(api.getState());
            const demonBluffs = selectDemonBluffs(api.getState());
            const outOfPlay = selectOutOfPlay(api.getState());
            const nightNumber = selectDay(api.getState());
            const phase = selectPhase(api.getState());
            const input = {
                extractedSeats,
                demonBluffs,
                outOfPlay,
                nightNumber,
                phase,
                ...task.payload
            };

            console.log(`input`, input);
            const result = await func(api.getState(), api.dispatch)({ data: input } as any);
            console.log(`result`, result);
            return result;
        },
        prompt: async (task: IStorytellerQueueItem, api) => {
            const extractedSeats = selectSeatedPlayers(api.getState());
            const demonBluffs = selectDemonBluffs(api.getState());
            const outOfPlay = selectOutOfPlay(api.getState());
            const nightNumber = selectDay(api.getState());
            const phase = selectPhase(api.getState());
            const storytellerRoutes: Record<string, typeof drunkChoiceServerFn> = {
                drunkchoice: drunkChoiceServerFn,
                fortuneteller_redherring: fortuneTellerRedHerringServerFn,
                demonbluffs: demonBluffsServerFn,
                traveler_alignment: travelerAlignmentServerFn as any
            };
            const callbacks = {
                drunkchoice: async ({ shown: { seat }, reasoning }: { shown: { seat: number }; reasoning: string }) => {
                    console.log(`reasoning: `, reasoning);
                    api.dispatch(setMaskedRole({ seatID: seat, mask: 'drunk' }));
                    api.dispatch(
                        addReminderToken({ key: 'drunk_is_the_drunk', target: seat, source: seat, isChanneled: false })
                    );
                },
                fortuneteller_redherring: async ({
                    shown: { seat },
                    reasoning
                }: {
                    shown: { seat: number };
                    reasoning: string;
                }) => {
                    console.log(`reasoning: `, reasoning);
                    const result = selectSeatedPlayers(api.getState()).find(
                        (player) => player.role === 'fortuneteller' || player.thinks === 'fortuneteller'
                    );
                    if (result == null) throw new Error('could not find the fortuneteller');
                    const { ID: source } = result;
                    api.dispatch(
                        addReminderToken({ key: 'fortuneteller_red_herring', source, target: seat, isChanneled: false })
                    );
                },
                demonbluffs: async ({
                    shown: { roles },
                    reasoning
                }: {
                    shown: { roles: Roles[] };
                    reasoning: string;
                }) => {
                    console.log(`reasoning: `, reasoning);
                    api.dispatch(setDemonBluffs(roles as any));
                },
                traveler_alignment: async ({
                    alignment,
                    travelerID,
                    reasoning
                }: {
                    alignment: 'good' | 'evil';
                    reasoning: string;
                    travelerID: number;
                }) => {
                    console.log(`reasoning: `, reasoning);
                    api.dispatch(setAlignment({ seatID: travelerID, alignment }));
                }
            };
            const input = {
                extractedSeats,
                demonBluffs,
                outOfPlay,
                nightNumber,
                phase,
                ...task.payload
            };

            console.log(`input`, input);
            const routeKey = task.id as keyof typeof storytellerRoutes;
            const retFunc = callbacks[routeKey as keyof typeof callbacks];
            if (retFunc == null) {
                throw new Error(`unknown storyteller route ${task.id}`);
            }
            const route = storytellerRoutes[routeKey];
            console.log(`route`, route.url);
            const response = await route({ data: input });
            console.log(`response`, response);
            return retFunc(response);
        }
    }
};
