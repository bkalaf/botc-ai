// src/prompts/worldBuilder.ts
/**
 * Universal world-building prompt for ANY player (Good or Evil).
 * Produces:
 * - hypothesized demon/minions/outsiders in play
 * - outsider count accounting (base vs modified)
 * - elimination reasoning
 * - next conversations (todos)
 *
 * This is the “brain loop” you can run each day after public discussion.
 */
export const worldBuilder: PromptSpec = {
    id: 'player-world-builder',
    version: '1.0',
    title: 'Player – World Builder (Script, Outsider Count, Demon/Minion/Outsider Inference)',
    tags: ['botc', 'player', 'worldbuilding', 'inference'],
    perspective: 'player',

    instructions: [
        `You are an AI player in Blood on the Clocktower.`,
        `Your task is to build and update plausible game worlds using your private info, public claims, and observed outcomes.`,
        `You must explicitly track outsider count math and role-set inference: which Demon, which Minions, and which Outsiders are in play.`,
        `You are not omniscient. You must manage uncertainty, misregistration, and the possibility of drunk/poisoned information.`
    ],

    guidelines: [
        `COHERENCE: A world must explain observed facts (deaths, no-deaths, claims) with minimal special pleading.`,
        `OUTSIDER MATH: Always account for base outsider count plus any modifiers (e.g., Baron). Track both “claimed” and “implied” outsider count.`,
        `SCRIPT INFERENCE: Use elimination: if certain info is impossible under a Demon/Minion set, reduce its weight.`,
        `MISREGISTRATION: Recluse/Spy can distort counts and alignment reads. Treat these as low-frequency but important escape hatches.`,
        `DRUNK/POISON: If an info chain conflicts, consider whether a key piece could be poisoned/drunk before discarding the entire world.`,
        `PERSONALITY CONSISTENCY: Your confidence and willingness to publicly commit to a world must match your personality traits.`
    ],

    footnote: `Worlds win games. Not because they are true, but because they force decisions under uncertainty.`,

    goal: `Produce 2–4 ranked plausible worlds, including outsider math, role-set inference (Demon/Minions/Outsiders), and an action plan for who to talk to next.`,

    additionalConsiderations: [
        `BASE OUTSIDERS: Determine the script’s base outsider count for the player count, then track modifiers (e.g., Baron +2).`,
        `MODIFIED OUTSIDER COUNT: Output both base and modified counts with confidence and why.`,
        `DEMON INFERENCE: Use night patterns (kill style, no-death frequency, star-pass plausibility) to narrow Demon possibilities.`,
        `MINION INFERENCE: Use Investigator pings, poisoning-like inconsistencies, outsider-count anomalies, and social behavior.`,
        `OUTSIDER INFERENCE: Use Librarian pings, outsider count pressure, and “weird” info patterns to infer Drunk/Recluse/etc.`,
        `ELIMINATION: Explicitly list which roles are ruled out and why (mechanical contradiction, too many modifiers, etc.).`
    ],

    input: [
        `Script roles available (all Townsfolk/Outsiders/Minions/Demons on script)`,
        `Player count and seating order`,
        `Public claims (by seat) and timelines`,
        `Public info results (Chef/Empath/FT/etc.) and timelines`,
        `Deaths/no-deaths by night and executions by day`,
        `Your private info (if any)`,
        `Your suspicion map`,
        `Your personality profile`
    ],

    output: {
        shown: `object: {
      outsiderCount: {
        base: number,
        modified: number,
        modifiers: string[],
        confidence: "low" | "medium" | "high"
      },
      candidates: {
        demon: string[],
        minions: string[],
        outsiders: string[]
      },
      worlds: Array<{
        name: string,
        demon: { role: string, seat: number|null },
        minions: Array<{ role: string, seat: number|null }>,
        outsiders: Array<{ role: string, seat: number|null }>,
        coreEvidence: string[],
        weakPoints: string[],
        confidence: "low" | "medium" | "high"
      }>,
      eliminations: string[]
    }`,
        todos: 'number[] (seat numbers to talk to next, in priority order)',
        reasoning: 'In-character explanation of why these worlds are ranked and what you’re trying to test next.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'WorldBuilderOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['outsiderCount', 'candidates', 'worlds', 'eliminations'],
                properties: {
                    outsiderCount: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['base', 'modified', 'modifiers', 'confidence'],
                        properties: {
                            base: { type: 'number', minimum: 0 },
                            modified: { type: 'number', minimum: 0 },
                            modifiers: { type: 'array', items: { type: 'string' } },
                            confidence: { type: 'string', enum: ['low', 'medium', 'high'] }
                        }
                    },
                    candidates: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['demon', 'minions', 'outsiders'],
                        properties: {
                            demon: { type: 'array', items: { type: 'string' } },
                            minions: { type: 'array', items: { type: 'string' } },
                            outsiders: { type: 'array', items: { type: 'string' } }
                        }
                    },
                    worlds: {
                        type: 'array',
                        items: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['name', 'demon', 'minions', 'outsiders', 'coreEvidence', 'weakPoints', 'confidence'],
                            properties: {
                                name: { type: 'string' },
                                demon: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: ['role', 'seat'],
                                    properties: {
                                        role: { type: 'string' },
                                        seat: { type: ['number', 'null'] }
                                    }
                                },
                                minions: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['role', 'seat'],
                                        properties: {
                                            role: { type: 'string' },
                                            seat: { type: ['number', 'null'] }
                                        }
                                    }
                                },
                                outsiders: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['role', 'seat'],
                                        properties: {
                                            role: { type: 'string' },
                                            seat: { type: ['number', 'null'] }
                                        }
                                    }
                                },
                                coreEvidence: { type: 'array', items: { type: 'string' } },
                                weakPoints: { type: 'array', items: { type: 'string' } },
                                confidence: { type: 'string', enum: ['low', 'medium', 'high'] }
                            }
                        }
                    },
                    eliminations: { type: 'array', items: { type: 'string' } }
                }
            },
            todos: { type: 'array', items: { type: 'number' } },
            reasoning: { type: 'string' }
        }
    }
};
