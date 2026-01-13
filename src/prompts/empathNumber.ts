// src/prompts/empathNumber.ts
import { PromptSpec } from './prompt-types';
import { genericStorytellerCore } from './_genericStorytellerCore';

export const empathNumber: PromptSpec = {
    id: 'st-empath-number',
    version: '3.0',
    title: 'Empath – Evil Neighbor Count',
    tags: ['botc', 'storyteller', 'empath', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Determine the Empath's number tonight: the count of Evil among the Empath's two LIVING neighbors (0, 1, or 2).`,

    additionalConsiderations: [
        `LIVING ONLY: Only living neighbors are counted.`,
        `MISREGISTRATION: Recluse may register as Evil; Spy may register as Good. Use this to shape uncertainty, not to create chaos.`,
        `SOBER/HEALTHY EMPATH: Default to the true count unless you have a strong legal reason to deviate.`,
        `DRUNK/POISONED EMPATH: If giving an incorrect number, keep it plausible and pattern-friendly across nights.`,
        `ANTI-TELEGRAPH: Avoid results that scream “poisoned” unless you intentionally want that tension.`
    ],

    input: [
        `Empath seat number and its two neighbors (including living/dead status)`,
        `Full grimoire`,
        `Empath sober/healthy state`,
        `Night number and prior Empath results (if any)`
    ],

    output: {
        count: "number (Empath's reported Evil neighbor count: 0, 1, or 2)",
        reasoning: {
            type: 'string',
            description:
                'Brief ST philosophy explaining the result, including misregistration and sobriety considerations.'
        }
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'EmpathNumberOutput',
        type: 'object',
        additionalProperties: false,
        required: ['count', 'reasoning'],
        properties: {
            count: { type: 'number', minimum: 0, maximum: 2, description: 'Empaths reported evil neighbor count.' },
            reasoning: {
                type: 'string',
                description:
                    'Brief ST philosophy explaining the result, including misregistration and sobriety considerations.'
            }
        }
    }
};
