// src/prompts/librarianTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';

export const librarianTokens: PromptSpec = {
    id: 'st-librarian-tokens',
    version: '3.0',
    title: 'Librarian – First Night Outsider Ping',
    tags: ['botc', 'storyteller', 'librarian', 'first-night', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Choose what the Librarian learns: show an Outsider role and two candidate seats, one of which is correct (unless the Librarian is drunk/poisoned and you choose a legal falsehood).`,

    additionalConsiderations: [
        `DEFAULT (SOBER/HEALTHY): Pick an in-play Outsider role and two candidates with exactly one correct.`,
        `DRUNK OUTSIDER WEIGHTING: The Drunk Outsider often creates durable uncertainty without hard-confirmation.`,
        `SPY REGISTRATION: Spy may register as Outsider. Use to widen plausible worlds, not to create obvious “ST trickery.”`,
        `RECLUSE INTERACTION: Recluse misregistration should be believable and not immediately self-revealing.`,
        `DRUNK/POISONED LIBRARIAN: You may show an Outsider not in play and/or make both candidates wrong. Keep it coherent with outsider-count discussions.`
    ],

    input: [`Full grimoire`, `Outsider count context (and which Outsiders exist on-script)`, `Librarian sober/healthy state`],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Librarian is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false)`,
        reasoning: 'Brief ST philosophy explaining balance, longevity, and misregistration/sobriety choices.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'LibrarianTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'correctSeat', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['role', 'seats'],
                properties: {
                    role: { type: 'string' },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: { type: 'number' }
                    }
                }
            },
            correctSeat: { type: ['number', 'null'] },
            reasoning: { type: 'string' }
        }
    }
};
