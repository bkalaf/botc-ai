// src/prompts/investigatorTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { minionRoles, playerRoles, PromptSpec } from './prompt-types';

export const investigatorTokens: PromptSpec = {
    id: 'st-investigator-tokens',
    version: '3.0',
    title: 'Investigator – First Night Minion Ping',
    tags: ['botc', 'storyteller', 'investigator', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Choose what the Investigator learns: show a Minion role and two candidate seats, one of which is correct (unless the Investigator is drunk/poisoned and you choose a legal falsehood).`,

    additionalConsiderations: [
        `DEFAULT (SOBER/HEALTHY): Pick an in-play Minion role and two candidates with exactly one correct.`,
        `MISREGISTRATION: Recluse may register as Evil and as any Minion. Use to widen worlds without making the ping obviously “weird.”`,
        `DRUNK/POISONED INVESTIGATOR: You may show a Minion not in play and/or make both candidates wrong. Keep it script-plausible and discussion-worthy.`,
        `AVOID TRIVIAL COLLAPSE: Don’t choose candidates that will be instantly hard-cleared by obvious cross-checks unless you want that collision.`,
        `SOCIAL VALUE: Prefer a ping that pressures Evil but doesn’t pin the whole game on day 1.`
    ],

    input: [`Full grimoire`, `Investigator sober/healthy state`, `Script context (which Minion roles exist on-script)`],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Investigator is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false) - if this is a number it must be one of the two values in shown.seats`,
        reasoning: 'Brief ST philosophy for why this show is good for balance, drama, and plausibility.'
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'InvestigatorTokensOutput',
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
                        enum: minionRoles,
                        description: 'The role shown to the Investigator. Must be a minion.'
                    },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: {
                            type: 'number',
                            minimum: 1,
                            maximum: playerCount,
                            description: 'The two seats that are shown to the Investigator'
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
