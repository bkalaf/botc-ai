// src/prompts/claimPlanner.ts
import { PromptSpec } from './prompt-types';

/**
 * Universal claim-planning prompt for any AI player.
 */
export const claimPlanner: PromptSpec = {
    id: 'player-claim-planner',
    version: '1.0',
    title: 'Player – Claim & Bluff Planning',
    tags: ['botc', 'player', 'social', 'claims', 'bluffs'],
    perspective: 'player',

    instructions: [
        `You are a player in Blood on the Clocktower.`,
        `Plan a claim strategy with three lanes (light, medium, full).`,
        `Follow PI wiki rules and your personality.`
    ],

    guidelines: [
        `Keep claims believable for the public state.`,
        `Avoid claims that collapse if out-of-play is unknown.`,
        `Define a pivot if contradicted.`,
        `Scale details across the three lanes.`
    ],

    footnote: `A claim is a long-term story.`,

    goal: `Produce a 3-lane claim plan with pivots and next talks.`,

    additionalConsiderations: [
        `Good: hide high-value roles if needed.`,
        `Evil: prefer resilient claims before bluffs are known.`,
        `Trade: lane 1 vague, lane 2 adds detail, lane 3 full timeline.`
    ],

    personalityModulation: {
        trustModel: {
            all_trusting: `Share earlier and more fully.`,
            skeptical: `Trade info for info.`,
            doubting_thomas: `Hold details until forced.`
        },
        tableImpact: {
            disruptive: `Bait reactions with bold claims.`,
            stabilizing: `Build a steady coalition.`,
            procedural: `Use mechanically tight claims.`
        },
        reasoningMode: {
            deductive: `Pick claims that fit constraints.`,
            associative: `Fit the social narrative.`,
            surface: `Keep claims simple early.`
        },
        informationHandling: {
            archivist: `Track timelines and consistency.`,
            impressionistic: `Prioritize conversation flow.`,
            signal_driven: `Adjust to the table focus.`
        },
        voiceStyle: {
            quiet: `Reveal lanes gradually.`,
            conversational: `Escalate naturally in talks.`,
            dominant: `Drive a clear narrative.`
        }
    },

    input: [
        `Your seat + role + alignment`,
        `Evil info if applicable`,
        `Public claims and rumors`,
        `Your private info`,
        `Night/day count`,
        `Personality profile`
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ClaimPlannerOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'pivot', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Three-lane claim plan.',
                additionalProperties: false,
                required: ['truthPolicy', 'lane1', 'lane2', 'lane3', 'backupRoles'],
                properties: {
                    truthPolicy: {
                        type: 'string',
                        enum: ['truth', 'bluff', 'hybrid'],
                        minLength: 4,
                        maxLength: 6,
                        description: 'Truthfulness strategy.'
                    },
                    lane1: {
                        type: 'object',
                        description: 'Light claim lane.',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: {
                            role: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 30,
                                description: 'Claimed role label.'
                            },
                            details: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 160,
                                description: 'Minimal details for lane 1.'
                            }
                        }
                    },
                    lane2: {
                        type: 'object',
                        description: 'Medium claim lane.',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: {
                            role: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 30,
                                description: 'Claimed role label.'
                            },
                            details: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 200,
                                description: 'Moderate details for lane 2.'
                            }
                        }
                    },
                    lane3: {
                        type: 'object',
                        description: 'Full claim lane.',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: {
                            role: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 30,
                                description: 'Claimed role label.'
                            },
                            details: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 240,
                                description: 'Full details for lane 3.'
                            }
                        }
                    },
                    backupRoles: {
                        type: 'array',
                        minItems: 0,
                        maxItems: 6,
                        description: 'Backup claim roles.',
                        items: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 30,
                            description: 'Backup role label.'
                        }
                    }
                }
            },
            pivot: {
                type: 'object',
                description: 'When and how to pivot.',
                additionalProperties: false,
                required: ['triggers', 'nextClaim'],
                properties: {
                    triggers: {
                        type: 'array',
                        minItems: 1,
                        maxItems: 6,
                        description: 'Events that trigger a pivot.',
                        items: {
                            type: 'string',
                            minLength: 4,
                            maxLength: 120,
                            description: 'Pivot trigger.'
                        }
                    },
                    nextClaim: {
                        type: 'object',
                        description: 'Claim to pivot to.',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: {
                            role: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 30,
                                description: 'Pivot role label.'
                            },
                            details: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 200,
                                description: 'Pivot details.'
                            }
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
                maxLength: 260,
                description: 'Why this claim plan fits the state and personality.'
            }
        }
    })
};
