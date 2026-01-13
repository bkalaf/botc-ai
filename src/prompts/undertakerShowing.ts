// src/prompts/undertakerShowing.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const undertakerShowing: PromptSpec = {
    id: 'st-undertaker-showing',
    version: '3.0',
    title: 'Undertaker – Role Reveal for Executed Player',
    tags: ['botc', 'storyteller', 'undertaker', 'info', 'execution'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Determine which role to show the Undertaker for the most recently executed player.`,

    additionalConsiderations: [
        `EXECUTED PLAYER: Use the most recently executed player (the one executed during the day that just ended).`,
        `SOBRIETY & HEALTH: If Undertaker is drunk/poisoned, the shown role may be incorrect. Keep it coherent, not random.`,
        `MISREGISTRATION: Apply Recluse/Spy registrations intentionally. If Recluse is drunk/poisoned, do not misregister them.`,
        `COLLISION VALUE: When lying (legally), pick a role that meaningfully collides with current claims rather than a random role.`
    ],

    input: [`Recently executed player's seat number`, `Full grimoire`, `Undertaker sober/healthy state`],

    output: {
        role: 'string (role shown to the Undertaker for the executed player)',
        reasoning: {
            type: 'string',
            description:
                'Brief ST philosophy explaining balance, plausibility, and any misregistration/sobriety choices. 2 sentence limit, prefer 1 sentence.'
        }
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'UndertakerShowingOutput',
        type: 'object',
        additionalProperties: false,
        required: ['role', 'reasoning'],
        properties: {
            role: { type: 'string' },
            reasoning: { type: 'string' }
        }
    })
};
