// src/prompts/mayorBounce.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const mayorBounce: PromptSpec = {
    id: 'st-mayor-bounce',
    version: '3.0',
    title: 'Mayor – Bounce Decision',
    tags: ['botc', 'storyteller', 'mayor', 'night', 'kill'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Decide whether the Mayor bounce redirects the night kill, and to whom.`,

    additionalConsiderations: [
        `Only living players can be redirected to.`,
        `If Mayor is drunk/poisoned, no bounce.`,
        `Avoid patterns that hard-confirm a bounce.`
    ],

    input: [`Grimoire`, `Original kill target seat`, `Mayor seat + sobriety`, `Living/dead list`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'MayorBounceOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Bounce decision and redirected target.',
                additionalProperties: false,
                required: ['shouldBounce', 'targetSeat'],
                properties: {
                    shouldBounce: { type: 'boolean', description: 'Whether or not the kill will bounce.' },
                    targetSeat: {
                        anyOf: [
                            {
                                type: 'integer',
                                minimum: 1,
                                maximum: Math.max(1, playerCount),
                                description: 'Seat to redirect to.'
                            },
                            { type: 'null', description: 'No redirect.' }
                        ],
                        description: 'Redirected seat or null.'
                    }
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this bounce choice serves the game.'
            }
        }
    })
};
