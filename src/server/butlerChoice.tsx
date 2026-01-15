// src/server/butlerChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { ClaimsInputSchema, InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { playerButlerChooseMaster } from '../prompts/playerButlerChooseMaster';
import { RootState, AppDispatch } from '../store';
import { selectDay } from '../store/game/game-slice';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addMyNightInfoClaim } from '../store/memory/memory-slice';
import { openDialog } from '../lib/dialogs';

const PlayerButlerReturnSchema = z
    .object({
        chosenSeat: z
            .number()
            .gte(1)
            .lte(15)
            .describe('Seat number of the player you choose as your Master. This must not be yourself.'),
        reasoning: z
            .string()
            .min(1)
            .describe(
                'A brief in-character explanation of why this player was chosen as your Master. Limit 2 sentences prefer 1.'
            )
    })
    .strict();

export const butlerChoiceServerFn = createServerFn({ method: 'POST' })
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
            response_format: zodResponseFormat(PlayerButlerReturnSchema, 'ButlerChooseMaster')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed;
    });

export const butlerHandler = (state: RootState, dispatch: AppDispatch) => {
    return async ({ data: { claims, ...data } }: { data: z.infer<typeof ClaimsInputSchema> }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'butler');
        if (seat == null) throw new Error(`no butler seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            const result = await butlerChoiceServerFn({ data: { claims, ...data } });
            const { chosenSeat } = result;
            console.log(`chosenSeat`, chosenSeat);
            dispatch(
                addMyNightInfoClaim({
                    ID,
                    seat: chosenSeat,
                    role: 'butler',
                    data: { chosenSeat },
                    day
                })
            );
        } else {
            const {
                value: { chosenSeat }
            } = await openDialog({
                dispatch,
                dialogType: 'butlerChoice',
                data: {
                    seatOptions: data.extractedSeats.map((seat) => ({ id: seat.ID, name: seat.name }))
                }
            });
            dispatch(
                addMyNightInfoClaim({
                    ID,
                    seat: chosenSeat,
                    role: 'butler',
                    data: { chosenSeat },
                    day
                })
            );
        }
    };
};
