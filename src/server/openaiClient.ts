// src/server/openaiClient.ts
import OpenAI from 'openai';
import { createServerOnlyFn } from '@tanstack/react-start';

export const getClient = createServerOnlyFn(() => {
    console.log(`env`, import.meta.env);
    return new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });
});
