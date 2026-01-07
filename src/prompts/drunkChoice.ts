// src/prompts/drunkChoice.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const drunkChoice: PromptSpec = {
    id: 'st-drunk-choice',
    version: '3.0',
    title: 'Setup – Choose the Drunk',
    tags: ['botc', 'storyteller', 'setup', 'drunk'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Select which TOWNSFOLK player is made Drunk during setup, seeding long-term misinformation without collapsing deduction.`,

    additionalConsiderations: [
        `DURATION: Prefer a Drunk choice whose incorrect info compounds over multiple days rather than resolving instantly.`,
        `FAIRNESS: Avoid making the Drunk a role whose failure immediately hard-confirms Evil or creates an unsolvable mess.`,
        `SCRIPT SYNERGY: Align the Drunk with expected poison/madness/bluff pressures already in the script.`,
        `PLAYER EXPERIENCE: Prefer a player who will engage thoughtfully with bad info (avoid brand-new players unless your group enjoys it).`,
        `THE DRUNKED ROLE must be a TOWNSFOLK`
    ],

    input: [
        `Full grimoire (setup state)`,
        `Script context (roles included, outsider count logic)`,
        `Optional player experience notes`
    ],

    output: {
        shown: 'object: { seat: number } (the seat made Drunk)',
        reasoning:
            'Brief ST philosophy explaining balance, longevity, and expected misinformation arc. Limit to 2 sentences max, preferably 1.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'DrunkChoiceOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['seat'],
                properties: {
                    seat: { type: 'number' }
                }
            },
            reasoning: { type: 'string' }
        }
    }
};
