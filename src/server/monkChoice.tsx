// src/server/monkChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { ClaimsInputSchema, InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { playerButlerChooseMaster } from '../prompts/playerButlerChooseMaster';
import { RootState, AppDispatch } from '../store';
import { selectDay } from '../store/game/game-slice';
import { addReminderToken, selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addMyNightInfoClaim } from '../store/memory/memory-slice';
import { openDialog } from '../lib/dialogs';

const MonkChoiceReturnSchema = z
    .object({
        choice: z
            .number()
            .gte(1)
            .lte(15)
            .describe('The seat number of the person you want to protect from the demon this evening.'),
        reasoning: z
            .string()
            .describe(
                'In-character explanation tying protection choice to current information and personality. 2 sentences max - prefer 1.'
            )
    })
    .strict();

export const monkChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(playerButlerChooseMaster, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(MonkChoiceReturnSchema, 'MonkChoiceReturn')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed;
    });

export const monkChoiceHandler = (state: RootState, dispatch: AppDispatch) => {
    return async ({ data: { claims, ...data } }: { data: z.infer<typeof ClaimsInputSchema> }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'monk');
        if (seat == null) throw new Error(`no monk seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            const result = await monkChoiceServerFn({ data: { claims, ...data } });
            const { choice } = result;
            console.log(`choice`, choice);
            dispatch(
                addMyNightInfoClaim({
                    ID,
                    seat: ID,
                    role: 'monk',
                    data: { choice },
                    day
                })
            );
        } else {
            await openDialog({
                dispatch,
                dialogType: 'butlerChoice',
                data: {
                    seatOptions: data.extractedSeats.map((seat) => ({ id: seat.ID, name: seat.name }))
                },
                resolve: async ({ seat }: { seat: string }) => {
                    dispatch(
                        addMyNightInfoClaim({
                            ID,
                            seat: ID,
                            role: 'monk',
                            data: { choice: seat },
                            day
                        })
                    );
                    dispatch(
                        addReminderToken({
                            key: 'monk_protected',
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
