// src/prompts/travelerAlignment.ts
import type { PromptSpec } from './prompt-types';

export const travelerAlignment: PromptSpec = {
    id: 'st-traveler-alignment',
    version: '1.0',
    title: 'Storyteller – Decide Traveler Alignment',
    tags: ['botc', 'storyteller', 'traveler', 'alignment'],
    perspective: 'storyteller',

    instructions: [
        'You are the Storyteller for Blood on the Clocktower.',
        'Assign a Traveler alignment using PI wiki guidance and the current game state.',
        'Balance tension without hard-deciding the game.'
    ],

    guidelines: [
        'Use alignment to stabilize a tilted game.',
        'Keep it narratively coherent and interesting.',
        'Avoid choices that hard-end the game.'
    ],

    goal: 'Choose GOOD or EVIL for the Traveler to improve balance and tension.',

    additionalConsiderations: [
        'Lean Good if Evil has momentum; lean Evil if Good is confirmed.',
        'Consider Traveler role swinginess and timing.',
        'Account for current misinformation effects.'
    ],

    input: [
        'Grimoire + reminders',
        'Current day/night',
        'Public context',
        'Traveler seat + role',
        'Imbalance indicators'
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'TravelerAlignmentDecision',
        type: 'object',
        additionalProperties: false,
        required: ['alignment', 'travelerID', 'reasoning'],
        properties: {
            alignment: {
                type: 'string',
                enum: ['good', 'evil'],
                minLength: 4,
                maxLength: 4,
                description: 'Chosen alignment for the Traveler.'
            },
            travelerID: {
                type: 'integer',
                minimum: 1,
                maximum: Math.max(1, playerCount),
                description: 'Traveler seat number.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 240,
                description: 'Why this alignment improves balance and tension.'
            }
        }
    })
};
