// src/prompts/demonBluffs.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const demonBluffs: PromptSpec = {
    id: 'st-demon-bluffs',
    version: '3.0',
    title: 'Setup – Select Demon Bluffs',
    tags: ['botc', 'storyteller', 'setup', 'demon', 'bluffs'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Select three out-of-play characters to serve as Demon bluffs, empowering Evil lies while preserving counterplay.`,

    additionalConsiderations: [
        `COVERAGE: Provide three bluffs that support different lie styles (early claim, reactive defense, late pivot).`,
        `PLAUSIBILITY: Bluffs must survive basic mechanical scrutiny given the current setup.`,
        `COUNTERPLAY: Good should be able to interrogate claims without instant collapse.`,
        `PLAYER EXPERIENCE: Match bluff complexity to the Demon’s expected comfort level.`,
        `ONLY PICK FROM THE OUT OF PLAY BLUFFS PROVIDED`
    ],

    input: [
        `Full grimoire`,
        `Full list of out-of-play characters`,
        `Script context (demon type, minions, outsider count)`,
        `Optional player experience notes`
    ],

    output: {
        shown: 'object: { roles: [string, string, string] } (the three bluff roles)',
        reasoning:
            'Brief ST philosophy explaining why this bluff set supports Evil while preserving a playable deduction space. Limit to 2 sentences max, preferably 1.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'DemonBluffsOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['roles'],
                properties: {
                    roles: {
                        type: 'array',
                        minItems: 3,
                        maxItems: 3,
                        items: { type: 'string' }
                    }
                }
            },
            reasoning: { type: 'string' }
        }
    }
};
