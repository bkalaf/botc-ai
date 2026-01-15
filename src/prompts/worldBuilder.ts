// src/prompts/worldBuilder.ts
import { PromptSpec } from './prompt-types';

/**
 * Universal world-building prompt for any player.
 */
export const worldBuilder: PromptSpec = {
    id: 'player-world-builder',
    version: '1.0',
    title: 'Player – World Builder',
    tags: ['botc', 'player', 'worldbuilding', 'inference'],
    perspective: 'player',

    instructions: [
        `You are a player in Blood on the Clocktower.`,
        `Build plausible worlds from public info and your private info.`,
        `Follow Pandemonium Institute wiki rules.`
    ],

    guidelines: [
        `Worlds must explain observed deaths, claims, and results.`,
        `Track outsider count math and role-set constraints.`,
        `Treat misregistration and poison as possible but not default.`
    ],

    footnote: `Worlds should stay solvable and testable.`,

    goal: `Produce 2–4 ranked worlds with outsider math and next talks.`,

    additionalConsiderations: [
        `List eliminations with mechanical reasons.`,
        `Separate strong evidence from weak points.`,
        `Match confidence to the data quality.`
    ],

    input: [
        `Script roles list`,
        `Player count + seating`,
        `Public claims + timelines`,
        `Public info results`,
        `Deaths/no-deaths + executions`,
        `Your private info`,
        `Suspicion map`,
        `Personality profile`
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'WorldBuilderOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'World summary and ranked hypotheses.',
                additionalProperties: false,
                required: ['outsiderCount', 'candidates', 'worlds', 'eliminations'],
                properties: {
                    outsiderCount: {
                        type: 'object',
                        description: 'Outsider count math.',
                        additionalProperties: false,
                        required: ['base', 'modified', 'modifiers', 'confidence'],
                        properties: {
                            base: {
                                type: 'integer',
                                minimum: 0,
                                maximum: Math.max(1, playerCount),
                                description: 'Base outsider count for player count.'
                            },
                            modified: {
                                type: 'integer',
                                minimum: 0,
                                maximum: Math.max(1, playerCount),
                                description: 'Modified outsider count after effects.'
                            },
                            modifiers: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 6,
                                description: 'Effects that changed the outsider count.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 60,
                                    description: 'Modifier summary.'
                                }
                            },
                            confidence: {
                                type: 'string',
                                enum: ['low', 'medium', 'high'],
                                minLength: 3,
                                maxLength: 6,
                                description: 'Confidence in the outsider math.'
                            }
                        }
                    },
                    candidates: {
                        type: 'object',
                        description: 'Shortlists of possible roles.',
                        additionalProperties: false,
                        required: ['demon', 'minions', 'outsiders'],
                        properties: {
                            demon: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 6,
                                description: 'Likely Demon roles.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 30,
                                    description: 'Demon role name.'
                                }
                            },
                            minions: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 8,
                                description: 'Likely Minion roles.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 30,
                                    description: 'Minion role name.'
                                }
                            },
                            outsiders: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 8,
                                description: 'Likely Outsider roles.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 30,
                                    description: 'Outsider role name.'
                                }
                            }
                        }
                    },
                    worlds: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 4,
                        description: 'Ranked plausible worlds.',
                        items: {
                            type: 'object',
                            additionalProperties: false,
                            required: [
                                'name',
                                'demon',
                                'minions',
                                'outsiders',
                                'coreEvidence',
                                'weakPoints',
                                'confidence'
                            ],
                            properties: {
                                name: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 40,
                                    description: 'Short world label.'
                                },
                                demon: {
                                    type: 'object',
                                    description: 'Demon guess for this world.',
                                    additionalProperties: false,
                                    required: ['role', 'seat'],
                                    properties: {
                                        role: {
                                            type: 'string',
                                            minLength: 2,
                                            maxLength: 30,
                                            description: 'Demon role name.'
                                        },
                                        seat: {
                                            anyOf: [
                                                {
                                                    type: 'integer',
                                                    minimum: 1,
                                                    maximum: Math.max(1, playerCount),
                                                    description: 'Seat of the Demon.'
                                                },
                                                { type: 'null', description: 'Unknown seat.' }
                                            ],
                                            description: 'Demon seat or null.'
                                        }
                                    }
                                },
                                minions: {
                                    type: 'array',
                                    minItems: 0,
                                    maxItems: Math.max(1, playerCount),
                                    description: 'Minion guesses for this world.',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['role', 'seat'],
                                        properties: {
                                            role: {
                                                type: 'string',
                                                minLength: 2,
                                                maxLength: 30,
                                                description: 'Minion role name.'
                                            },
                                            seat: {
                                                anyOf: [
                                                    {
                                                        type: 'integer',
                                                        minimum: 1,
                                                        maximum: Math.max(1, playerCount),
                                                        description: 'Seat of the Minion.'
                                                    },
                                                    { type: 'null', description: 'Unknown seat.' }
                                                ],
                                                description: 'Minion seat or null.'
                                            }
                                        }
                                    }
                                },
                                outsiders: {
                                    type: 'array',
                                    minItems: 0,
                                    maxItems: Math.max(1, playerCount),
                                    description: 'Outsider guesses for this world.',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['role', 'seat'],
                                        properties: {
                                            role: {
                                                type: 'string',
                                                minLength: 2,
                                                maxLength: 30,
                                                description: 'Outsider role name.'
                                            },
                                            seat: {
                                                anyOf: [
                                                    {
                                                        type: 'integer',
                                                        minimum: 1,
                                                        maximum: Math.max(1, playerCount),
                                                        description: 'Seat of the Outsider.'
                                                    },
                                                    { type: 'null', description: 'Unknown seat.' }
                                                ],
                                                description: 'Outsider seat or null.'
                                            }
                                        }
                                    }
                                },
                                coreEvidence: {
                                    type: 'array',
                                    minItems: 0,
                                    maxItems: 8,
                                    description: 'Evidence supporting this world.',
                                    items: {
                                        type: 'string',
                                        minLength: 4,
                                        maxLength: 120,
                                        description: 'Evidence note.'
                                    }
                                },
                                weakPoints: {
                                    type: 'array',
                                    minItems: 0,
                                    maxItems: 8,
                                    description: 'Weak points or contradictions.',
                                    items: {
                                        type: 'string',
                                        minLength: 4,
                                        maxLength: 120,
                                        description: 'Weak point note.'
                                    }
                                },
                                confidence: {
                                    type: 'string',
                                    enum: ['low', 'medium', 'high'],
                                    minLength: 3,
                                    maxLength: 6,
                                    description: 'Confidence in this world.'
                                }
                            }
                        }
                    },
                    eliminations: {
                        type: 'array',
                        minItems: 0,
                        maxItems: 12,
                        description: 'Roles ruled out and why.',
                        items: {
                            type: 'string',
                            minLength: 4,
                            maxLength: 120,
                            description: 'Elimination note.'
                        }
                    }
                }
            },
            todos: {
                type: 'array',
                minItems: 0,
                maxItems: Math.max(1, playerCount),
                description: 'Seats to talk to next, in priority order.',
                items: {
                    type: 'integer',
                    minimum: 1,
                    maximum: Math.max(1, playerCount),
                    description: 'Seat to prioritize.'
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 300,
                description: 'Why these worlds are ranked and what to test next.'
            }
        }
    })
};
