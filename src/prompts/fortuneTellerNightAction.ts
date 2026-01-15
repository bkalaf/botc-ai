// src/prompts/fortuneTellerNightAction.ts
import { PromptSpec } from './prompt-types';

/**
 * Fortune Teller nightly pick:
 * - choose 2 seats
 * - interpret/plan around Red Herring
 * - account for Recluse misregistration and possible drunk/poison
 * - output next “tests” + todos
 */
export const fortuneTellerNightAction: PromptSpec = {
    id: 'player-fortune-teller-night-action',
    version: '1.0',
    title: 'Fortune Teller – Night Ping Selection',
    tags: ['botc', 'player', 'fortune-teller', 'night', 'info'],
    perspective: 'player',

    instructions: [
        `You are the Fortune Teller in Blood on the Clocktower.`,
        `Pick two seats to test; results can be warped by Red Herring, misregistration, or poisoning.`,
        `Follow Pandemonium Institute wiki rules for this role.`
    ],

    guidelines: [
        `Pick pairs that split worlds, not just confirm.`,
        `Use repeated tests to isolate a Red Herring.`,
        `If results clash, consider poison before discarding a world.`,
        `Keep your testing style aligned with personality.`
    ],

    footnote: `Treat each night as a data point, not a verdict.`,

    goal: `Choose two seats and explain the test plan.`,

    additionalConsiderations: [
        `Use a stable “control” seat when possible.`,
        `Avoid contaminating tests with likely Recluse unless testing that.`,
        `Check seats you can discuss tomorrow.`
    ],

    personalityModulation: {
        trustModel: {
            all_trusting: `Prefer checking seats the town is already debating and share results earlier.`,
            skeptical: `Prefer checks that hedge against misinformation and validate independent lines.`,
            doubting_thomas: `Assume claims are traps; prioritize mechanically informative checks over social consensus.`
        },
        tableImpact: {
            disruptive: `Favor checks that challenge the dominant narrative or expose “too neat” stories.`,
            stabilizing: `Favor checks that strengthen a coherent town solve and reduce chaos.`,
            procedural: `Favor structured experiments (control/variable) and consistent test plans.`
        },
        reasoningMode: {
            deductive: `Choose pairs that eliminate multiple worlds at once depending on YES/NO outcome.`,
            associative: `Choose pairs that test the social network of trust and contradiction.`,
            surface: `Choose obvious suspects or obvious “trusted” players for simple reads.`
        },
        informationHandling: {
            archivist: `Track a running matrix of prior checks and choose the next check to maximize disambiguation.`,
            impressionistic: `Choose based on current vibes and who feels most dangerous.`,
            signal_driven: `React to loud accusations or major claim shifts and test them directly.`
        },
        voiceStyle: {
            quiet: `Favor safer, less revealing checks and plan to share later.`,
            conversational: `Balance stealth with usefulness; choose checks you can justify in chats.`,
            dominant: `Choose checks that support the narrative you intend to drive tomorrow.`
        }
    },

    input: [
        `Your seat`,
        `Living/dead list`,
        `Public claims`,
        `Prior tests (seatA, seatB -> result)`,
        `Recluse candidates`,
        `Poison/drunk risk factors`,
        `Suspicion map`,
        `Night count`,
        `Personality profile`
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'FortuneTellerNightActionOutput',
        type: 'object',
        additionalProperties: false,
        required: ['picks', 'hypothesis', 'todos', 'reasoning'],
        properties: {
            picks: {
                type: 'object',
                description: 'The chosen two seats to test.',
                additionalProperties: false,
                required: ['seats'],
                properties: {
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: {
                            type: 'integer',
                            description: 'Seat to check tonight.',
                            minimum: 1,
                            maximum: Math.max(1, playerCount)
                        }
                    }
                }
            },
            hypothesis: {
                type: 'object',
                description: 'Current working model after tonight’s test.',
                additionalProperties: false,
                required: ['likelyRedHerringSeats', 'likelyDemonSeats', 'corruptionRisk'],
                properties: {
                    likelyRedHerringSeats: {
                        type: 'array',
                        description: 'Likely Red Herring seats (if any).',
                        minItems: 0,
                        maxItems: Math.max(1, playerCount),
                        items: {
                            type: 'integer',
                            description: 'Seat that might be Red Herring.',
                            minimum: 1,
                            maximum: Math.max(1, playerCount)
                        }
                    },
                    likelyDemonSeats: {
                        type: 'array',
                        description: 'Likely Demon seats (if any).',
                        minItems: 0,
                        maxItems: Math.max(1, playerCount),
                        items: {
                            type: 'integer',
                            description: 'Seat that might be the Demon.',
                            minimum: 1,
                            maximum: Math.max(1, playerCount)
                        }
                    },
                    corruptionRisk: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        minLength: 3,
                        maxLength: 6,
                        description: 'Estimated poison/drunk risk.'
                    }
                }
            },
            todos: {
                type: 'array',
                description: 'Future seats to test, in priority order.',
                minItems: 0,
                maxItems: Math.max(1, playerCount),
                items: {
                    type: 'integer',
                    description: 'Seat to consider checking later.',
                    minimum: 1,
                    maximum: Math.max(1, playerCount)
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 240,
                description: 'Short rationale for the chosen test.'
            }
        }
    })
};
