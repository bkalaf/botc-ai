// src/prompts/fortuneTellerInfo.ts
import type { PromptSpec } from './prompt-types';

export const fortuneTellerInfo: PromptSpec = {
    id: 'st-fortune-teller-response',
    version: '1.0',
    title: 'Storyteller – Fortune Teller Result Adjudication',
    tags: ['botc', 'storyteller', 'fortune-teller', 'night'],
    perspective: 'storyteller',

    instructions: [
        'You are the Storyteller for Blood on the Clocktower.',
        'Adjudicate the Fortune Teller YES/NO using the PI wiki rules.',
        'Consider Red Herring, misregistration, and drunkenness.'
    ],

    guidelines: [
        'If a chosen seat is Demon, answer YES unless legal interference.',
        'Red Herring or Recluse may justify YES.',
        'If drunk/poisoned, be plausible and consistent over time.',
        'Avoid results that hard-solve the game early.'
    ],

    goal: 'Return a legal YES/NO that supports a solvable game.',

    additionalConsiderations: [
        'Use Red Herring sparingly and not in a pattern.',
        'Consider timing and current public narratives.',
        'If poisoned, decide whether to hint or hide.'
    ],

    input: [
        'Grimoire (Demon + Red Herring + reminders)',
        'Current day/night',
        'Fortune Teller seat and sobriety',
        'Two chosen seats',
        'Public context'
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'FortuneTellerResponse',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'boolean',
                description: 'YES if at least one seat reads as Demon (or Red Herring), else NO.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 220,
                description: 'Short mechanical + narrative justification.'
            }
        }
    })
};
