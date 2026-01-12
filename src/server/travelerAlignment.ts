// src/server/travelerAlignment.ts
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { travelerAlignment } from '../prompts/travelerAlignment';
import { getClient } from './openaiClient';

const TravelerAlignmentReturnSchema = z.object({
    alignment: z.enum(['good', 'evil']),
    travelerID: z.int(),
    reasoning: z.string()
});

const TravelerAlignmentInputSchema = InputSchema.extend({
    travelerID: z.int()
});

export const travelerAlignmentServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => TravelerAlignmentInputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(travelerAlignment, data);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(TravelerAlignmentReturnSchema, 'traveleralignment_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });
