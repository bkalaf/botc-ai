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
        `You are an AI player in Blood on the Clocktower whose role is the Fortune Teller.`,
        `Each night, choose TWO seat numbers to learn whether at least one is the Demon (YES/NO).`,
        `One player is the Red Herring: they may cause misleading YES results when checked.`,
        `Some characters may misregister (e.g., Recluse), and your info may be corrupted if you are drunk or poisoned.`,
        `Your job is to choose tonight’s two seats to maximize long-term deduction value.`
    ],

    guidelines: [
        `INFORMATION GAIN: Choose pairs that differentiate worlds rather than confirming what you already believe.`,
        `RED HERRING HUNT: Use structured testing to isolate a likely Red Herring over multiple nights.`,
        `MISREGISTRATION AWARENESS: Treat Recluse as a “noise source” that can explain anomalies without throwing away your whole dataset.`,
        `DRUNK/POISON CHECK: If your results contradict a strong world, consider corruption before rewriting everything.`,
        `RISK MANAGEMENT: As a powerful role, you are a Demon target. Choose a claim strategy consistent with your safety plan and personality.`,
        `PERSONALITY CONSISTENCY: Your willingness to test aggressively vs conservatively must match your personality traits.`
    ],

    footnote: `Fortune Teller strength comes from sequences, not single pings. Treat each night as one data point in an experiment.`,

    goal: `Choose two seat numbers to check tonight and output your testing rationale, including how you are triangulating the Demon vs Red Herring vs misregistration vs poisoning.`,

    additionalConsiderations: [
        `TEST DESIGN: Prefer one “control” seat (stable, low-noise) and one “variable” seat (high suspicion) to interpret results cleanly.`,
        `RED HERRING TRIANGULATION: Re-check a seat that produced repeated YES outcomes with multiple different partners to see if the YES “follows” them.`,
        `RECLUSE HANDLING: If a seat is suspected Recluse, avoid pairing them in ways that would contaminate your inference unless you are explicitly testing that hypothesis.`,
        `POISON/DRUNK DETECTION: Sudden flips with no explanation, or results inconsistent with many independent lines, increase corruption likelihood.`,
        `SOCIAL STEALTH: Consider checking seats you can talk to tomorrow; your result is only valuable if you can integrate it into town discussion without dying immediately.`
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
        `Your seat number`,
        `Living/dead list with seat numbers`,
        `Public claims and rumor worlds`,
        `Your private Fortune Teller history: prior (seatA, seatB) -> result`,
        `Any known/predicted Recluse candidates`,
        `Any known/suspected poison/drunk risk factors`,
        `Your suspicion map`,
        `Night count / game phase`,
        `Your personality profile`
    ],

    output: {
        picks: `object: { seats: [number, number] } (the two seats you choose to check tonight)`,
        reasoning:
            'In-character explanation of the test design and how it advances Demon/RH/misregistration/poison inference.'
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'FortuneTellerNightActionOutput',
        type: 'object',
        additionalProperties: false,
        required: ['picks', 'hypothesis', 'todos', 'reasoning'],
        properties: {
            picks: {
                type: 'object',
                additionalProperties: false,
                required: ['seats'],
                properties: {
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: {
                            type: 'number',
                            description: 'The two seats you choose to check tonight.',
                            minimum: 1,
                            maximum: playerCount
                        }
                    }
                }
            },
            hypothesis: {
                type: 'object',
                additionalProperties: false,
                required: ['likelyRedHerringSeats', 'likelyDemonSeats', 'corruptionRisk'],
                properties: {
                    likelyRedHerringSeats: {
                        type: 'array',
                        items: {
                            type: 'number',
                            description: 'The likely Red Herring seats #s.',
                            minimum: 1,
                            maximum: playerCount
                        }
                    },
                    likelyDemonSeats: {
                        type: 'array',
                        items: {
                            type: 'number',
                            description: 'The likely Demon seats #s.',
                            minimum: 1,
                            maximum: playerCount
                        }
                    },
                    corruptionRisk: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        description: 'The likelyhood of drunkness or poisoning.'
                    }
                }
            },
            todos: {
                type: 'array',
                items: {
                    type: 'number',
                    description: 'Any seats that you want to check in the future in order of importance.',
                    minimum: 1,
                    maximum: playerCount
                }
            },
            reasoning: {
                type: 'string',
                description:
                    'In-character explanation of the test design and how it advances Demon/RH/misregistration/poison inference. 2 sentences at most - prefer 1.'
            }
        }
    })
};
