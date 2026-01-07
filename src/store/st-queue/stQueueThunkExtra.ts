// src/store/st-queue/stQueueThunkExtra.ts
import { Roles } from '../../data/types';
import {
    drunkChoiceServerFn,
    fortunetellerRedHerringServerFn,
    demonBluffsServerFn,
    travelerAlignmentServerFn
} from '../../server/serverFns';
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
        prompt: async (task: IStorytellerQueueItem, api) => {
            const extractedSeats = selectSeatedPlayers(api.getState());
            const demonBluffs = selectDemonBluffs(api.getState());
            const outOfPlay = selectOutOfPlay(api.getState());
            const nightNumber = selectDay(api.getState());
            const phase = selectPhase(api.getState());
            const calls = {
                drunkchoice: drunkChoiceServerFn,
                fortuneteller_redherring: fortunetellerRedHerringServerFn,
                demonbluffs: demonBluffsServerFn,
                traveler_alignment: travelerAlignmentServerFn
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
                        (player) => player.role === 'fortuneteller'
                    );
                    if (result == null) throw new Error('could not find the fortuneteller');
                    const { ID: source } = result;
                    api.dispatch(
                        addReminderToken({ key: 'fortuneteller_redherring', source, target: seat, isChanneled: false })
                    );
                },
                demonblufs: async ({
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

            const func = calls[task.id as keyof typeof calls];
            const retFunc = callbacks[task.id as keyof typeof callbacks];
            const response = await func({ data: input as any });
            return retFunc(response);
        }
    }
};
