// src/prompts/spyIntel.ts
import { PromptSpec } from './prompt-types';

export const spyIntel: PromptSpec = {
    id: 'player-spy-intel',
    version: '1.0',
    title: 'Spy – Process Grimoire & Coordinate',
    tags: ['botc', 'player', 'spy', 'intel', 'coordination'],
    perspective: 'player',

    instructions: [
        `You are the Spy in Blood on the Clocktower with full grimoire access.`,
        `Turn truth into a safe Evil plan without outing yourself.`,
        `Follow PI wiki rules and your personality.`
    ],

    guidelines: [
        `Avoid perfect-info tells.`,
        `Support Demon survival and believable bluffs.`,
        `Share enough to coordinate, not enough to expose you.`
    ],

    footnote: `Turn knowledge into plausible stories.`,

    goal: `Provide a coordination plan, bluff options, and next talks.`,

    additionalConsiderations: [
        `Avoid bluff collisions with real roles.`,
        `Call out top info threats.`,
        `Share high-level constraints instead of raw truth.`
    ],

    input: [
        `Full grimoire truth`,
        `Your seat`,
        `Demon + Minion seats`,
        `Public claims`,
        `Table suspicions`,
        `Day/night count`,
        `Personality profile`
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'SpyIntelOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Spy coordination plan.',
                additionalProperties: false,
                required: [
                    'safeClaims',
                    'unsafeClaims',
                    'suggestedBluffs',
                    'killPrioritySeats',
                    'misinformationTargets',
                    'sharePlan'
                ],
                properties: {
                    safeClaims: {
                        type: 'array',
                        minItems: 0,
                        maxItems: 10,
                        description: 'Claims considered safe to use.',
                        items: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 40,
                            description: 'Safe claim label.'
                        }
                    },
                    unsafeClaims: {
                        type: 'array',
                        minItems: 0,
                        maxItems: 10,
                        description: 'Claims to avoid.',
                        items: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 40,
                            description: 'Unsafe claim label.'
                        }
                    },
                    suggestedBluffs: {
                        type: 'object',
                        description: 'Recommended bluff sets for Demon and Minions.',
                        additionalProperties: false,
                        required: ['demon', 'minions'],
                        properties: {
                            demon: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 6,
                                description: 'Suggested Demon bluffs.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 30,
                                    description: 'Role name.'
                                }
                            },
                            minions: {
                                type: 'object',
                                description: 'Per-minion bluff suggestions by name/seat key.',
                                additionalProperties: {
                                    type: 'array',
                                    minItems: 0,
                                    maxItems: 6,
                                    items: {
                                        type: 'string',
                                        minLength: 2,
                                        maxLength: 30,
                                        description: 'Role name.'
                                    },
                                    description: 'Suggested bluffs for that minion.'
                                }
                            }
                        }
                    },
                    killPrioritySeats: {
                        type: 'array',
                        minItems: 0,
                        maxItems: Math.max(1, playerCount),
                        description: 'High-priority kill targets.',
                        items: {
                            type: 'integer',
                            minimum: 1,
                            maximum: Math.max(1, playerCount),
                            description: 'Seat to prioritize for kills.'
                        }
                    },
                    misinformationTargets: {
                        type: 'array',
                        minItems: 0,
                        maxItems: Math.max(1, playerCount),
                        description: 'Players to mislead.',
                        items: {
                            type: 'integer',
                            minimum: 1,
                            maximum: Math.max(1, playerCount),
                            description: 'Seat to mislead.'
                        }
                    },
                    sharePlan: {
                        type: 'object',
                        description: 'What to share with teammates.',
                        additionalProperties: false,
                        required: ['withDemon', 'withMinions'],
                        properties: {
                            withDemon: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 10,
                                description: 'Key points to share with the Demon.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 80,
                                    description: 'Share item.'
                                }
                            },
                            withMinions: {
                                type: 'array',
                                minItems: 0,
                                maxItems: 10,
                                description: 'Key points to share with Minions.',
                                items: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 80,
                                    description: 'Share item.'
                                }
                            }
                        }
                    }
                }
            },
            todos: {
                type: 'array',
                minItems: 0,
                maxItems: Math.max(1, playerCount),
                description: 'Seats to talk to next, in order.',
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
                maxLength: 260,
                description: 'Why this plan is safe and effective.'
            }
        }
    })
};
