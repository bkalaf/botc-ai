// src/prompts/poisonerNightAction.ts
import { PromptSpec } from './prompt-types';

/**
 * Player-perspective prompt (does not use genericStorytellerCore).
 * Output naming convention aligned: use `shown` + `reasoning`.
 */
export const poisonerNightAction: PromptSpec = {
    id: 'player-poisoner-night-action',
    version: '3.0',
    title: 'Poisoner – Night Poison Target',
    tags: ['botc', 'player', 'poisoner', 'night'],
    perspective: 'player',

    instructions: [
        `You are the Poisoner in Blood on the Clocktower.`,
        `Pick one seat to poison each night, using partial info and your personality.`,
        `Follow Pandemonium Institute wiki rules.`
    ],

    guidelines: [
        `Protect the Demon and prolong uncertainty.`,
        `Avoid obvious poison patterns.`,
        `Match risk to personality.`
    ],

    footnote: `Each poison is a public commitment to a story.`,

    goal: `Choose a poison target that best advances Evil.`,

    additionalConsiderations: [
        `Poison info roles or key social leaders.`,
        `Consider Empath-neighbor distortion.`,
        `Only poison Evil in rare, high-value cases.`
    ],
    personalityModulation: {
        trustModel: {
            all_trusting: `Poisoners rely more on public claims`,
            skeptical: `Poisoners hedge against misinformation.`,
            doubting_thomas: `Poisoners assume claims are traps.`
        },
        tableImpact: {
            disruptive: `Poisoners favor bold or unexpected targets.`,
            stabilizing: `Poisoners protect existing Evil narratives.`,
            procedural: `Poisoners prefer mechanically sound, low-variance poisons.`
        },
        reasoningMode: {
            deductive: `Poisoners target constraint-breaking roles (Empath, Chef).`,
            associative: `Poisoners target players central to social narratives.`,
            surface: `Poisoners target obvious info claims or loud players.`
        },
        informationHandling: {
            archivist: `Poisoners consider poisoning history and claim timelines.`,
            impressionistic: `Poisoners act on current vibes and pressure.`,
            signal_driven: `Poisoners react to loud or repeated information.`
        },
        voiceStyle: {
            quiet: `Poisoners favor self-protection and subtlety.`,
            conversational: `Poisoners balance cover with impact.`,
            dominant: `Poisoners may poison to support narratives they intend to push.`
        }
    },
    // Keep your existing personality modulation format if you already have it in code elsewhere;
    // we leave it optional here since you may inject it at runtime.
    input: [
        `Your seat`,
        `Demon seat`,
        `Minion seats`,
        `Living/dead list`,
        `Public claims`,
        `Suspicion map`,
        `Poison history`,
        `Personality profile`
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'PoisonerNightActionOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Chosen poison target.',
                additionalProperties: false,
                required: ['seat'],
                properties: {
                    seat: {
                        type: 'integer',
                        minimum: 1,
                        maximum: Math.max(1, playerCount),
                        description: 'Seat to poison tonight.'
                    }
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this target advances Evil.'
            }
        }
    })
};
