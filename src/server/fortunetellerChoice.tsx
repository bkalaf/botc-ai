// src/server/fortunetellerChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { ClaimsInputSchema, InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { fortuneTellerNightAction } from '../prompts/fortuneTellerNightAction';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim, addMyNightInfoClaim, getClaimsFor, selectClaimsByRole } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { FortuneTellerInfoInputSchema, fortuneTellerInfoServerFn } from './fortunetellerInfo';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';
import { closeDialog } from '../store/ui/ui-slice';

const FortuneTellerChoiceReturnSchema = z.object({
    picks: z.object({
        seats: z.array(z.number())
    }),
    reasoning: z.string()
});

export const fortuneTellerChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => ClaimsInputSchema.parse(data))
    .handler(async ({ data }) => {
        const { claims } = data;
        const personality = data.extractedSeats.find((x) => x.thinks ?? x.role === 'fortuneteller')?.personality;
        const { system, user } = createPrompt(fortuneTellerNightAction, data, { personality, claims } as any);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(FortuneTellerChoiceReturnSchema, 'fortuneteller_choice_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed;
    });

export const fortuneTellerChoiceHandler = (state: RootState, dispatch: AppDispatch) => {
    const getInfo = async ({
        data: { ID, controledBy, ...data }
    }: {
        data: z.infer<typeof FortuneTellerInfoInputSchema> & { ID: number; controledBy: 'ai' | 'human' };
    }) => {
        const day = selectDay(state);
        const response = await fortuneTellerInfoServerFn({ data });
        const { seats, shown } = response;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    seat: ID,
                    day,
                    role: 'fortuneteller',
                    data: {
                        seats,
                        shown
                    }
                })
            );
            clearTask(dispatch);
        } else {
            return await new Promise<void>((res) => {
                openDialog({
                    dispatch,
                    dialogType: 'fortunetellerInfo',
                    data: { shown },
                    resolve: async () => {
                        dispatch(closeDialog());
                        res();
                    }
                });
            });
        }
    };
    const makeChoice = async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        const seat = selectSeatByRole(state, 'fortuneteller');
        if (seat == null) throw new Error(`no fortuneteller seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            const claims = selectClaimsByRole(state, 'fortuneteller');
            const response = await fortuneTellerChoiceServerFn({ data: { claims, ...data } });
            const {
                picks: { seats }
            } = response;
            await getInfo({ data: { ...data, ID, controledBy, seats } });
        } else {
            const result = await openDialog({
                dispatch,
                dialogType: 'fortunetellerChoice',
                data: {
                    seatOptions: data.extractedSeats.map((seat) => ({ id: seat.ID, name: seat.name }))
                }
            });
            if (!result.confirmed) {
                return;
            }
            const { seat1, seat2 } = result.value as { seat1: string; seat2: string };
            await getInfo({
                data: { ...data, ID, controledBy, seats: [parseInt(seat1, 10), parseInt(seat2, 10)] }
            });
        }
    };

    return async (args: { data: z.infer<typeof InputSchema> }) => {
        await makeChoice(args);
    };
};
