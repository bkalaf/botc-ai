// src/prompts/washerwomanTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';

export const washerwomanTokens: PromptSpec = {
    id: 'st-washerwoman-tokens',
    version: '3.0',
    title: 'Washerwoman – First Night Townsfolk Ping',
    tags: ['botc', 'storyteller', 'washerwoman', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Choose what the Washerwoman learns: show a Townsfolk role and two candidate seats, one of which is correct (unless the Washerwoman is drunk/poisoned and you choose a legal falsehood).`,

    additionalConsiderations: [
        `DEFAULT (SOBER/HEALTHY): Pick an in-play Townsfolk role and two candidates with exactly one correct.`,
        `SPY REGISTRATION: Spy may register as Good/Townsfolk. Use to widen worlds without making Evil detection trivial.`,
        `DRUNK/POISONED WASHERWOMAN: You may show a Townsfolk role not in play and/or make both candidates wrong. Keep it script-plausible and discussion-worthy.`,
        `AVOID AUTO-CONFIRM: Don’t create a ping that instantly hard-confirms through obvious cross-checks unless needed for balance.`,
        `NARRATIVE VALUE: Prefer pings that create interesting cross-checks rather than isolated facts.`
    ],

    input: [`Full grimoire`, `Washerwoman sober/healthy state`, `Script context (which Townsfolk roles exist on-script)`],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Washerwoman is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false)`,
        reasoning: 'Brief ST philosophy explaining balance, plausibility, and any misregistration/sobriety choices.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'WasherwomanTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'correctSeat', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['role', 'seats'],
                properties: {
                    role: { type: 'string' },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: { type: 'number' }
                    }
                }
            },
            correctSeat: { type: ['number', 'null'] },
            reasoning: { type: 'string' }
        }
    }
};
