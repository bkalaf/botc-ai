// src/prompts/demonBluffs.ts
import { playerRoles, PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const demonBluffs: PromptSpec = {
    id: 'st-demon-bluffs',
    version: '3.0',
    title: 'Setup – Select Demon Bluffs',
    tags: ['botc', 'storyteller', 'setup', 'demon', 'bluffs'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Pick three out-of-play roles as Demon bluffs that enable lies without collapsing solvability.`,

    additionalConsiderations: [
        `Cover early, mid, and late claim paths.`,
        `Ensure each bluff is mechanically plausible on this script.`,
        `Only pick from the out-of-play list.`
    ],

    input: [`Grimoire`, `Out-of-play roles list`, `Script context`, `Player experience notes (optional)`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'DemonBluffsOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'The chosen bluff payload.',
                additionalProperties: false,
                required: ['roles'],
                properties: {
                    roles: {
                        type: 'array',
                        description: 'Exactly three out-of-play bluff roles.',
                        minItems: 3,
                        maxItems: 3,
                        items: {
                            type: 'string',
                            enum: playerRoles,
                            minLength: 2,
                            maxLength: 30,
                            description: 'Role name from the script.'
                        }
                    }
                }
            },
            reasoning: {
                type: 'string',
                description: 'Why these bluffs help Evil while keeping counterplay.',
                minLength: 1,
                maxLength: 240
            }
        }
    })
};
