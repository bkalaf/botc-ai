// src/prompts/mayorBounce.ts
import { genericStorytellerCore } from './_genericStorytellerCore';

export const mayorBounce: PromptSpec = {
    id: 'st-mayor-bounce',
    version: '3.0',
    title: 'Mayor – Bounce Decision',
    tags: ['botc', 'storyteller', 'mayor', 'night', 'kill'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Determine whether the Mayor's ability redirects the night kill, and if so, which living player becomes the new target.`,

    additionalConsiderations: [
        `LEGALITY: You may only redirect to a LIVING player.`,
        `SOBRIETY: If the Mayor is Drunk or Poisoned, the bounce fails (acknowledge this in reasoning even if the app enforces it).`,
        `DRAMA: Early bounces create mystery; late bounces can be merciful or cruel depending on the game state.`,
        `INTERACTION: Redirecting into on-death roles (e.g. Ravenkeeper) can create interesting outcomes, but avoid repeating patterns that scream “Mayor bounce.”`
    ],

    input: [
        `Full grimoire`,
        `Original night kill target seat number`,
        `Mayor seat number and sober/healthy state`,
        `Living/dead status list`
    ],

    output: {
        shown: 'object: { shouldBounce: boolean, targetSeat: number|null } (targetSeat is the redirected target if bouncing; null if no bounce)',
        reasoning: 'Brief ST philosophy explaining balance/drama and why this redirection (or no redirection) serves the game.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'MayorBounceOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['shouldBounce', 'targetSeat'],
                properties: {
                    shouldBounce: { type: 'boolean' },
                    targetSeat: { type: ['number', 'null'] }
                }
            },
            reasoning: { type: 'string' }
        }
    }
};
