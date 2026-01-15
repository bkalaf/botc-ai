// src/server/demonBluffs.ts
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { demonBluffs } from '../prompts/demonBluffs';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';

const DemonBluffsReturnSchema = z
    .object({
        shown: z
            .object({
                roles: z
                    .array(
                        z.enum([
                            'monk',
                            'empath',
                            'fortuneteller',
                            'undertaker',
                            'virgin',
                            'librarian',
                            'investigator',
                            'washerwoman',
                            'chef',
                            'mayor',
                            'slayer',
                            'soldier',
                            'ravenkeeper',
                            'saint',
                            'recluse',
                            'drunk',
                            'butler'
                        ])
                    )
                    .min(3)
                    .max(3)
                    .describe('The three bluff roles chosen - must be out of play and on the script.')
            })
            .strict(),
        reasoning: z
            .string()
            .describe(
                'Brief ST philosophy explaining why this bluff set supports Evil while preserving a playable deduction space. Limit to 2 sentences max, preferably 1.'
            )
    })
    .strict();

export const demonBluffsServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(demonBluffs, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(DemonBluffsReturnSchema, 'DemonBluffsOutput')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });
