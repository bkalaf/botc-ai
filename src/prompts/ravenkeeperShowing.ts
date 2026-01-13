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

    goal: `Determine which role to show the Ravenkeeper about their chosen target after the Ravenkeeper dies at night.`,

    additionalConsiderations: [
        `TARGET INTEGRITY: Honor the Ravenkeeper’s chosen target exactly; do not “redirect” their choice.`,
        `SOBRIETY AT DEATH: Evaluate the Ravenkeeper’s sobriety/health at the moment of death for whether their info can be false.`,
        `MISREGISTRATION: Use Recluse/Spy registration options deliberately. If Recluse is drunk/poisoned, do not misregister them.`,
        `ENDGAME POWER: Ravenkeeper info can hard-lock worlds late. Prefer roles that create debate unless the game state needs a hard reveal.`
    ],

    input: [`Full grimoire`, `Ravenkeeper target seat number`, `Ravenkeeper sober/healthy state at time of death`],

    output: {
        role: 'string (role shown to the Ravenkeeper for the chosen target)',
        reasoning: {
            type: 'string',
            description:
                'Brief ST philosophy explaining balance, plausibility, and any misregistration/sobriety choices. 2 sentence limit, prefer 1 sentence.'
        }
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'RavenkeeperShowingOutput',
        type: 'object',
        additionalProperties: false,
        required: ['role', 'reasoning'],
        properties: {
            role: { type: 'string' },
            reasoning: { type: 'string' }
        }
    })
};
