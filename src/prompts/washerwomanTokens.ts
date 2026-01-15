// src/prompts/washerwomanTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec, townsfolkRoles } from './prompt-types';

export const washerwomanTokens: PromptSpec = {
    id: 'st-washerwoman-tokens',
    version: '3.0',
    title: 'Washerwoman – First Night Townsfolk Ping',
    tags: ['botc', 'storyteller', 'washerwoman', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Show a Townsfolk role and two seats, with one true unless drunk/poisoned.`,

    additionalConsiderations: [
        `Sober/healthy: one seat must be correct.`,
        `Drunk/poisoned: role and seats may be fully false.`,
        `Avoid instant confirmations.`
    ],

    input: [`Grimoire`, `Washerwoman sobriety/health`, `Script Townsfolk list`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'WasherwomanTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'correctSeat', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Role and two candidate seats shown.',
                additionalProperties: false,
                required: ['role', 'seats'],
                properties: {
                    role: {
                        type: 'string',
                        enum: townsfolkRoles,
                        minLength: 3,
                        maxLength: 20,
                        description: 'Townsfolk role shown.'
                    },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        description: 'Two candidate seats.',
                        items: {
                            type: 'integer',
                            minimum: 1,
                            maximum: Math.max(1, playerCount),
                            description: 'Candidate seat.'
                        }
                    }
                }
            },
            correctSeat: {
                anyOf: [
                    {
                        type: 'integer',
                        minimum: 1,
                        maximum: Math.max(1, playerCount),
                        description: 'True seat (must be one of shown.seats).'
                    },
                    { type: 'null', description: 'No true seat (drunk/poisoned).' }
                ],
                description: 'Which shown seat is true, or null if both false.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 240,
                description: 'Why this result is legal and interesting.'
            }
        }
    })
};
