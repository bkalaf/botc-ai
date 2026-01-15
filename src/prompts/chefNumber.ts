// src/prompts/chefNumber.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const chefNumber: PromptSpec = {
    id: 'st-chef-number',
    version: '3.0',
    title: 'Chef – Evil Adjacent Pair Count',
    tags: ['botc', 'storyteller', 'chef', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Return the Chef number: adjacent Evil-Evil pairs around a circular seating.`,

    additionalConsiderations: [
        `Use circular adjacency (last seat adjacent to 1).`,
        `Recluse/Spy misregistration only if legal.`,
        `If drunk/poisoned, give a nearby plausible number.`,
        `Prefer results that keep multiple worlds alive.`
    ],

    input: [`Seating order`, `Grimoire (alignments + misregistration roles)`, `Chef sobriety/health`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ChefNumberOutput',
        type: 'object',
        additionalProperties: false,
        required: ['count', 'reasoning'],
        properties: {
            count: {
                type: 'integer',
                minimum: 0,
                maximum: Math.max(1, playerCount),
                description: 'Chef’s reported adjacent Evil pair count.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                description: 'Why this count is legal and useful.'
            }
        }
    })
};
