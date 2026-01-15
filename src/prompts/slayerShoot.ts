// src/prompts/slayerShoot.ts
export const slayerShoot: PromptSpec = {
    id: 'player-slayer-shoot',
    version: '1.0',
    title: 'Slayer – Should I Shoot?',
    tags: ['botc', 'player', 'slayer', 'day'],
    perspective: 'player',

    instructions: [
        `You are the Slayer in Blood on the Clocktower.`,
        `Decide whether to shoot today and who, following PI wiki rules.`,
        `Use partial info and your personality.`
    ],

    guidelines: [
        `Shoot when the outcome teaches the town something.`,
        `Consider social fallout and survivability.`,
        `Match timing to your personality.`
    ],

    footnote: `A shot is a public experiment—make it informative.`,

    goal: `Decide whether to shoot today and pick a target if yes.`,

    additionalConsiderations: [
        `Shoot to prevent bad executions or force contradictions.`,
        `If you might die soon, consider shooting now.`,
        `Beware obvious bait.`
    ],

    personalityModulation: {
        trustModel: {
            all_trusting: `Shoot earlier if trusted players are aligned on a suspect.`,
            skeptical: `Require stronger convergence: multiple independent reasons to shoot.`,
            doubting_thomas: `Assume you’re being manipulated; shoot only on a hard mechanical case or endgame necessity.`
        },
        tableImpact: {
            disruptive: `Shoot earlier to force commitment and break stalemates.`,
            stabilizing: `Delay until the town is aligned to avoid splintering Good.`,
            procedural: `Shoot only when the logic is tight and the informational payoff is clear.`
        },
        reasoningMode: {
            deductive: `Shoot when your best world strongly points to one seat and the shot resolves constraints.`,
            associative: `Shoot the narrative keystone—the player connecting many lies.`,
            surface: `Shoot the loudest or most suspicious claimant if the table is stuck.`
        },
        informationHandling: {
            archivist: `Use vote history, claim contradictions, and timeline integrity as primary drivers.`,
            impressionistic: `Use social pressure and who feels wrong in the moment.`,
            signal_driven: `React to repeated accusations or major public reveals.`
        },
        voiceStyle: {
            quiet: `Prefer later, higher-certainty shots to minimize attention.`,
            conversational: `Balance timing with coalition support—shoot when you can explain it.`,
            dominant: `Shoot to seize the narrative, even if imperfect, as long as it forces progress.`
        }
    },

    input: [`Living/dead list`, `Public claims`, `Suspicion list`, `Vote history`, `Day number`, `Personality profile`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'SlayerShootOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Shoot decision and target.',
                additionalProperties: false,
                required: ['shouldShoot', 'seat'],
                properties: {
                    shouldShoot: { type: 'boolean', description: 'Whether to shoot today.' },
                    seat: {
                        anyOf: [
                            {
                                type: 'integer',
                                minimum: 1,
                                maximum: Math.max(1, playerCount),
                                description: 'Target seat if shooting.'
                            },
                            { type: 'null', description: 'No target if not shooting.' }
                        ],
                        description: 'Target seat or null.'
                    }
                }
            },
            todos: {
                type: 'array',
                description: 'Seats to talk to next, in priority order.',
                minItems: 0,
                maxItems: Math.max(1, playerCount),
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
                maxLength: 240,
                description: 'Why you will or will not shoot.'
            }
        }
    })
};
