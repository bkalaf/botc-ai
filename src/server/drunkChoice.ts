// src/server/drunkChoice.ts
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { drunkChoice } from '../prompts/drunkChoice';
import { getClient } from './openaiClient';

const DrunkChoiceReturnSchema = z
    .object({
        shown: z
            .object({
                seat: z.number().gte(1).lte(15).describe('The seat # of the player made drunk. Must be a townsfolk.')
            })
            .strict(),
        reasoning: z
            .string()
            .describe(
                'Brief ST philosophy explaining balance, longevity, and expected misinformation arc. Limit to 2 sentences max, preferably 1.'
            )
    })
    .strict();

export const drunkChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(drunkChoice, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(DrunkChoiceReturnSchema, 'DrunkChoiceOutput')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });
