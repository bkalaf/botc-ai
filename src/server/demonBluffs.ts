// src/server/demonBluffs.ts
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { demonBluffs } from '../prompts/demonBluffs';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';

const DemonBluffsReturnSchema = z.object({
    shown: z.object({
        roles: z.array(z.string())
    }),
    reasoning: z.string()
});

export const demonBluffsServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(demonBluffs, data);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(DemonBluffsReturnSchema, 'demonbluff_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });
