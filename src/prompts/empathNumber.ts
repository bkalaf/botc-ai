// src/prompts/empathNumber.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const empathNumber: PromptSpec = {
    id: 'st-empath-number',
    version: '3.0',
    title: 'Empath – Evil Neighbor Count',
    tags: ['botc', 'storyteller', 'empath', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Return the Empath number: Evil among the two living neighbors (0-2).`,

    additionalConsiderations: [
        `Count living neighbors only.`,
        `Recluse/Spy misregistration only if legal.`,
        `If drunk/poisoned, give a plausible value.`,
        `Avoid neon “poisoned” signals unless intentional.`
    ],

    input: [`Empath seat + living neighbors`, `Grimoire`, `Empath sobriety/health`, `Night number`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'EmpathNumberOutput',
        type: 'object',
        additionalProperties: false,
        required: ['count', 'reasoning'],
        properties: {
            count: {
                type: 'integer',
                minimum: 0,
                maximum: 2,
                description: 'Empath’s reported Evil neighbor count.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                description: 'Why this value is legal and helpful.'
            }
        }
    })
};
