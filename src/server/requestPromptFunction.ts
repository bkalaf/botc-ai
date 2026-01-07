// src/server/requestPromptFunction.ts
import { createServerFn } from '@tanstack/react-start';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';
import { createPrompt } from '@/prompts/createPrompt';
import { InputSchema, PromptSpec } from '@/prompts/prompt-types';
import { client } from './openaiClient';

export const requestPromptFunction = <
    ReturnZodObject extends z.ZodObject<any, any>,
    TInSchema extends z.infer<typeof InputSchema> = z.infer<typeof InputSchema>
>(
    promptSpec: PromptSpec,
    ReturnZodObject: ReturnZodObject,
    InSchema: TInSchema = InputSchema as any
) =>
    createServerFn({
        method: 'POST'
    })
        .inputValidator((input: typeof InputSchema) => (InSchema as any).parse(input))
        .handler(async ({ data }) => {
            const promptText = createPrompt(promptSpec, data);
            const response = await client.chat.completions.parse({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                    { role: 'user', content: promptText }
                ],
                response_format: zodResponseFormat(ReturnZodObject, 'demon_bluff_decision')
            });

            const parsed = response.choices?.[0]?.message?.parsed as z.infer<ReturnZodObject> | null;
            if (parsed == null) {
                throw new Error('no parsed decision');
            }

            return parsed as any;
        });
