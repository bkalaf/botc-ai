// src/prompts/librarianTokens.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { outsiderRoles, PromptSpec } from './prompt-types';

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

    input: [
        `Full grimoire`,
        `Outsider count context (and which Outsiders exist on-script)`,
        `Librarian sober/healthy state`
    ],

    output: {
        shown: `object: { role: string, seats: [number, number] } (what the Librarian is shown)`,
        correctSeat: `number|null (which of shown.seats truly has that role; null if none/fully false). This number MUST be one of the two values in shown if defined.`,
        reasoning: 'Brief ST philosophy explaining balance, longevity, and misregistration/sobriety choices.'
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'LibrarianTokensOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['seats'],
                properties: {
                    role: {
                        type: 'string',
                        enum: outsiderRoles,
                        description:
                            'The role shown to the Librarian. Must be an outsider or null if there are no outsiders in play.'
                    },
                    seats: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: {
                            type: 'number',
                            minimum: 0,
                            maximum: playerCount,
                            description:
                                'The two seats that are shown to the Librarian or 0 if there are no outsiders in play.'
                        }
                    }
                }
            },
            correctSeat: {
                type: 'number',
                minimum: 1,
                maximum: playerCount,
                description:
                    'The correct seat for the shown roles. Must be one of the two values in shown.seats if sober and healthy information. null if this is drunk or poisoned information or there are no outsiders in play.'
            },
            reasoning: {
                type: 'string',
                description:
                    'Brief ST philosophy for why this show is good for balance, drama, and plausibility. Max 2 sentences, prefer 1.'
            }
        }
    })
};
