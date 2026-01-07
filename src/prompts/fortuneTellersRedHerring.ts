// src/prompts/fortuneTellersRedHerring.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const fortuneTellersRedHerring: PromptSpec = {
    id: 'st-ft-red-herring',
    version: '3.0',
    title: 'Fortune Teller – Red Herring Placement',
    tags: ['botc', 'storyteller', 'fortune-teller', 'setup', 'misdirection'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Choose which player receives the Fortune Teller's Red Herring reminder token, creating durable misdirection without nullifying the Fortune Teller. Per the FORTUNE TELLER ability this must be a GOOD character - e.g. TOWNSFOLK, OUTSIDER or the SPY.`,

    additionalConsiderations: [
        `LONGEVITY: Prefer a target unlikely to die early or hard-confirm themselves.`,
        `PLAUSIBILITY: The target should plausibly be the Demon socially or mechanically.`,
        `SUBTLETY: Avoid placements that collapse immediately under basic logic.`,
        `SCRIPT SYNERGY: Ensure this misdirection complements other sources of uncertainty (drunk/poison/bluffs).`,
        `CANNOT BE ASSIGNED to a MINION or DEMON`,
        `BE WARY: Don't assign this to the RECLUSE as the RECLUSE's ability already causes it to misregister as a demon so putting a RED HERRING on a RECLUSE is a waste, generally.    `
    ],

    input: [
        `Full grimoire`,
        `Script context (roles in play, expected bluff structure)`,
        `Optional player experience notes`
    ],

    output: {
        shown: 'object: { seat: number } (the seat with the Red Herring token)',
        reasoning:
            'Brief ST philosophy explaining why this placement sustains Fortune Teller tension across the game. Limit to 2 sentences max, preferably 1.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'FortuneTellersRedHerringOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['seat'],
                properties: { seat: { type: 'number' } }
            },
            reasoning: { type: 'string' }
        }
    }
};
