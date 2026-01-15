// src/prompts/undertakerShowing.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const undertakerShowing: PromptSpec = {
    id: 'st-undertaker-showing',
    version: '3.0',
    title: 'Undertaker – Role Reveal for Executed Player',
    tags: ['botc', 'storyteller', 'undertaker', 'info', 'execution'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Show the Undertaker a role for the most recently executed player.`,

    additionalConsiderations: [
        `Use the last executed player.`,
        `If drunk/poisoned, lie but stay coherent.`,
        `Apply Recluse/Spy misregistration only when legal.`
    ],

    input: [`Executed player seat`, `Grimoire`, `Undertaker sobriety/health`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'UndertakerShowingOutput',
        type: 'object',
        additionalProperties: false,
        required: ['role', 'reasoning'],
        properties: {
            role: {
                type: 'string',
                minLength: 2,
                maxLength: 30,
                description: 'Role shown to the Undertaker.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this role is legal and useful.'
            }
        }
    })
};
