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
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';

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
        const promptText = createPrompt(investigatorTokens, data, { personality });
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Player.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(PoisonerChoiceReturnSchema, 'poisonerChoice_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });
    
export const poisonerChoiceHandler = (state: RootState, dispatch: AppDispatch) => {
    return async (args: { data: z.infer<typeof InputSchema> }) => {
        const seat = selectSeatByRole(state, 'poisoner');
        if (seat == null) throw new Error(`no poisoner seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
        } else {
            const 
        }
    }
}