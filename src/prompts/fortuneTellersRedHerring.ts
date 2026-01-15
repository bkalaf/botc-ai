// src/prompts/fortuneTellersRedHerring.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const fortuneTellersRedHerring: PromptSpec = {
    id: 'st-ft-red-herring',
    version: '3.0',
    title: 'Fortune Teller – Red Herring Placement',
    tags: ['botc', 'storyteller', 'fortune-teller', 'setup', 'misdirection'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Assign the Red Herring to a Good player to add misdirection without invalidating the Fortune Teller.`,

    additionalConsiderations: [
        `Target should live long enough to matter.`,
        `Keep it plausible and subtle.`,
        `Must be Good (not Minion/Demon).`,
        `Avoid Recluse unless you have a strong reason.`
    ],

    input: [`Grimoire`, `Script context`, `Player experience notes (optional)`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'FortuneTellersRedHerringOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Chosen Red Herring seat.',
                additionalProperties: false,
                required: ['seat'],
                properties: {
                    seat: {
                        type: 'integer',
                        minimum: 1,
                        maximum: Math.max(1, playerCount),
                        description: 'The seat with the Red Herring token.'
                    }
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this placement sustains tension without breaking solvability.'
            }
        }
    })
};
