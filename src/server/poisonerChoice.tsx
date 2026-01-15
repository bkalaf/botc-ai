// src/server/poisonerChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { createPrompt } from '../prompts/createPrompt';
import { investigatorTokens } from '../prompts/investigatorTokens';
import { ClaimsInputSchema, InputSchema } from '../prompts/prompt-types';
import { getClient } from './openaiClient';
import z from 'zod';
import { RootState, AppDispatch } from '../store';
import { filterSeatsByRole } from './filterSeatsByRole';
import { addReminderToken, selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { openDialog } from '../lib/dialogs';
import { addMyNightInfoClaim, selectClaimsByRole, selectMemoryFor } from '../store/memory/memory-slice';
import { selectDay } from '../store/game/game-slice';
import { poisonerNightAction } from '../prompts/poisonerNightAction';

const PoisonerChoiceReturnSchema = z
    .object({
        shown: z
            .object({
                seat: z.number().gte(1).lte(15).describe('The seat of the person that will be poisoned this evening.')
            })
            .strict(),
        reasoning: z
            .string()
            .describe(
                'In-character explanation of why this seat was chosen, reflecting personality and partial information. Max 2 sentences - prefer 1.'
            )
    })
    .strict();

export const poisonerChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => ClaimsInputSchema.parse(data))
    .handler(async ({ data }) => {
        const { personality } = filterSeatsByRole(data.extractedSeats as any, 'poisoner');
        const { system, user } = createPrompt(poisonerNightAction, data, { personality });
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(PoisonerChoiceReturnSchema, 'PoisonerNightActionOutput')
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
            dispatch(addMyNightInfoClaim({ day, ID, seat: ID, role: 'poisoner', data: { seat } }));
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
