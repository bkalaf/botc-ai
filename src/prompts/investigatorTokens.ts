// src/prompts/investigatorTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';

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
        `MISREGISTRATION: Recluse may register as Evil/Minion. Use to widen worlds without making the ping obviously “weird.”`,
        `DRUNK/POISONED INVESTIGATOR: You may show a Minion not in play and/or make both candidates wrong. Keep it script-plausible and discussion-worthy.`,
        `AVOID TRIVIAL COLLAPSE: Don’t choose candidates that will be instantly hard-cleared by obvious cross-checks unless you want that collision.`,
        `SOCIAL VALUE: Prefer a ping that pressures Evil but doesn’t pin the whole game on day 1.`
    ],

    input: [`Full grimoire`, `Investigator sober/healthy state`, `Script context (which Minion roles exist on-script)`],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Investigator is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false)`,
        reasoning: 'Brief ST philosophy for why this show is good for balance, drama, and plausibility.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'InvestigatorTokensOutput',
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
