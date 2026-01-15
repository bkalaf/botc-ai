// src/prompts/drunkChoice.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const drunkChoice: PromptSpec = {
    id: 'st-drunk-choice',
    version: '3.0',
    title: 'Setup – Choose the Drunk',
    tags: ['botc', 'storyteller', 'setup', 'drunk'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Choose the Townsfolk player who is the Drunk.`,

    additionalConsiderations: [
        `Pick a role where bad info creates long-term tension.`,
        `Avoid hard-confirming or unsolvable outcomes.`,
        `Must be a Townsfolk.`
    ],

    input: [`Setup grimoire`, `Script context`, `Player experience notes (optional)`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'DrunkChoiceOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Chosen Drunk seat.',
                additionalProperties: false,
                required: ['seat'],
                properties: {
                    seat: {
                        type: 'integer',
                        minimum: 1,
                        maximum: Math.max(1, playerCount),
                        description: 'Seat made Drunk (must be Townsfolk).'
                    }
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this Drunk choice fits the setup.'
            }
        }
    })
};
