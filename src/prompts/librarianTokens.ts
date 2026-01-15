// src/prompts/librarianTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { outsiderRoles, PromptSpec } from './prompt-types';

export const librarianTokens: PromptSpec = {
    id: 'st-librarian-tokens',
    version: '3.0',
    title: 'Librarian – First Night Outsider Ping',
    tags: ['botc', 'storyteller', 'librarian', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Show an Outsider role and two seats, with one true unless drunk/poisoned.`,

    additionalConsiderations: [
        `Sober/healthy: one seat must be correct.`,
        `Drunk/poisoned: role and seats may be fully false.`,
        `If no Outsider in play, show none.`
    ],

    input: [`Grimoire`, `Outsider count + script`, `Librarian sobriety/health`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'LibrarianTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'correctSeat', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Role and candidate seats shown.',
                additionalProperties: false,
                required: ['role', 'seats'],
                properties: {
                    role: {
                        anyOf: [
                            {
                                type: 'string',
                                enum: outsiderRoles,
                                minLength: 3,
                                maxLength: 20,
                                description: 'Outsider role shown.'
                            },
                            { type: 'null', description: 'No Outsider shown.' }
                        ],
                        description: 'Outsider role or null if none in play.'
                    },
                    seats: {
                        type: 'array',
                        minItems: 0,
                        maxItems: 2,
                        description: 'Two candidate seats, or empty if none.',
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
                    { type: 'null', description: 'No true seat (drunk/poisoned or none in play).' }
                ],
                description: 'Which shown seat is true, or null.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 240,
                description: 'Why this result is legal and useful.'
            }
        }
    })
};
