// src/prompts/investigatorTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { minionRoles, playerRoles, PromptSpec } from './prompt-types';

export const investigatorTokens: PromptSpec = {
    id: 'st-investigator-tokens',
    version: '3.0',
    title: 'Investigator – First Night Minion Ping',
    tags: ['botc', 'storyteller', 'investigator', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Show a Minion role and two seats, with one true unless drunk/poisoned.`,

    additionalConsiderations: [
        `Sober/healthy: one seat must be correct.`,
        `Drunk/poisoned: role and seats may be fully false.`,
        `Avoid instant hard-clears.`
    ],

    input: [`Grimoire`, `Investigator sobriety/health`, `Script Minion list`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'InvestigatorTokensOutput',
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
                        type: 'string',
                        enum: minionRoles,
                        minLength: 3,
                        maxLength: 20,
                        description: 'Minion role shown.'
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
