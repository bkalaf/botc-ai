// src/prompts/washerwomanTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec, townsfolkRoles } from './prompt-types';

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

    input: [
        `Full grimoire`,
        `Washerwoman sober/healthy state`,
        `Script context (which Townsfolk roles exist on-script)`
    ],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Washerwoman is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false) if this is a number it must be one of the two values in shown.seats`,
        reasoning: {
            type: 'string',
            description:
                'Brief ST philosophy explaining balance, plausibility, and any misregistration/sobriety choices. 2 sentence limit, prefer 1 sentence.'
        }
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'WasherwomanTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['role', 'seats'],
                properties: {
                    role: {
                        type: 'string',
                        enum: townsfolkRoles,
                        description: 'The role shown to the Washerwoman. Must be a townsfolk.'
                    },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: {
                            type: 'number',
                            minimum: 1,
                            maximum: playerCount,
                            description: 'The two seats that are shown to the Washerwoman'
                        }
                    }
                }
            },
            correctSeat: {
                type: 'number',
                minimum: 1,
                maximum: playerCount,
                description:
                    'The correct seat for the shown roles. Must be one of the two values in shown.seats if sober and healthy information. null if this is drunk or poisoned information.'
            },
            reasoning: {
                type: 'string',
                description:
                    'Brief ST philosophy for why this show is good for balance, drama, and plausibility. Max 2 sentences, prefer 1.'
            }
        }
    })
};
