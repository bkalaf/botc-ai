// src/server/chefNumber.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { chefNumber } from '../prompts/chefNumber';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim, addMyNightInfoClaim } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';

const ChefNumberReturnSchema = z.object({
    count: z.int(),
    reasoning: z.string()
});

export const chefNumberServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(chefNumber, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(ChefNumberReturnSchema, 'chefnumber_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const chefHandler = (state: RootState, dispatch: AppDispatch) => {
    const func = async ({ value }: { value: { count: number } }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'chef');
        if (seat == null) throw new Error(`no chef seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    seat: ID,
                    role: 'chef',
                    data: { count: value.count },
                    day
                })
            );
            clearTask(dispatch);
        } else {
            const result = await openDialog({ dispatch, dialogType: 'chefInfo', data: { count: value.count } });
            if (result.confirmed) {
                clearTask(dispatch);
            }
        }
    };
    return buildHandler(chefNumberServerFn, func);
};
