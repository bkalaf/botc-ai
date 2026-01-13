// src/server/empathInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { empathNumber } from '../prompts/empathNumber';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim, addMyNightInfoClaim } from '../store/memory/memory-slice';
import { buildHandler } from './buildHandler';
import { openDialog } from '@/lib/dialogs';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';

const EmpathInfoReturnSchema = z.object({
    shown: z.object({
        count: z.int()
    }),
    reasoning: z.string()
});

export const empathNumberServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(empathNumber, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(EmpathInfoReturnSchema, 'empathinfo_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const empathHandler = (state: RootState, dispatch: AppDispatch) => {
    const func = async ({ confirmed, value }: { confirmed: boolean; value: { shown: { count: number } } }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'empath');
        if (seat == null) throw new Error(`no empath seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    seat: ID,
                    day,
                    role: 'empath',
                    data: value?.shown.count
                })
            );
            clearTask(dispatch);
        } else {
            const result = await openDialog({ dispatch, dialogType: 'empathInfo', data: { count: value.shown.count } });
            if (result.confirmed) {
                clearTask(dispatch);
            }
        }
    };
    return buildHandler(empathNumberServerFn, func);
};
