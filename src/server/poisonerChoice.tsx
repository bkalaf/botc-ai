// src/server/poisonerChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { createPrompt } from '../prompts/createPrompt';
import { investigatorTokens } from '../prompts/investigatorTokens';
import { InputSchema } from '../prompts/prompt-types';
import { getClient } from './openaiClient';
import z from 'zod';
import { RootState, AppDispatch } from '../store';
import { filterSeatsByRole } from './filterSeatsByRole';
import { addReminderToken, selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { openDialog } from '../lib/dialogs';
import { addMyNightInfoClaim, selectClaimsByRole, selectMemoryFor } from '../store/memory/memory-slice';
import { selectDay } from '../store/game/game-slice';

const PoisonerChoiceReturnSchema = z.object({
    shown: z.object({
        seat: z.number()
    }),
    reasoning: z.string()
});

export const poisonerChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { personality } = filterSeatsByRole(data.extractedSeats as any, 'poisoner');
        const { system, user } = createPrompt(investigatorTokens, data, { personality });
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(PoisonerChoiceReturnSchema, 'poisonerChoice_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed;
    });

export const poisonerChoiceHandler = (state: RootState, dispatch: AppDispatch) => {
    return async (args: { data: z.infer<typeof InputSchema> }) => {
        const claims = selectClaimsByRole(state, 'poisoner');
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'poisoner');
        if (seat == null) throw new Error(`no poisoner seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            const result = await poisonerChoiceServerFn({ data: { claims, ...args.data } });
            const {
                shown: { seat }
            } = result;
            dispatch(addMyNightInfoClaim({ day, seat: ID, role: 'poisoner', data: { seat } }));
            dispatch(
                addReminderToken({
                    key: 'poisoner_poisoned',
                    source: ID,
                    target: seat,
                    isChanneled: true
                })
            );
        } else {
            await openDialog({
                dispatch,
                dialogType: 'poisonerChoice',
                data: {
                    seatOptions: args.data.extractedSeats.map((x) => ({ id: x.ID, name: x.name }))
                },
                resolve: async ({ seat }: { seat: string }) => {
                    dispatch(
                        addReminderToken({
                            key: 'poisoner_poisoned',
                            source: ID,
                            target: parseInt(seat, 10),
                            isChanneled: true
                        })
                    );
                }
            });
        }
    };
};
