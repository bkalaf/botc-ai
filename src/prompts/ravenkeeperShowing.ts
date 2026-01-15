// src/prompts/ravenkeeperShowing.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const ravenkeeperShowing: PromptSpec = {
    id: 'st-ravenkeeper-showing',
    version: '3.0',
    title: 'Ravenkeeper – Role Reveal on Night Death',
    tags: ['botc', 'storyteller', 'ravenkeeper', 'info', 'death'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Show the Ravenkeeper a role for their chosen target after a night death.`,

    additionalConsiderations: [
        `Honor the chosen target.`,
        `If drunk/poisoned, lie but stay coherent.`,
        `Apply Recluse/Spy misregistration only when legal.`
    ],

    input: [`Grimoire`, `Ravenkeeper target seat`, `Ravenkeeper sobriety at death`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'RavenkeeperShowingOutput',
        type: 'object',
        additionalProperties: false,
        required: ['role', 'reasoning'],
        properties: {
            role: {
                type: 'string',
                minLength: 2,
                maxLength: 30,
                description: 'Role shown for the target.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Why this role is legal and helpful.'
            }
        }
    })
};
