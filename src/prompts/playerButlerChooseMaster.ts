// src/prompts/playerButlerChooseMaster.ts
//src/prompts/playerButlerChooseMaster.ts
import { PromptSpec } from './prompt-types';

export const playerButlerChooseMaster: PromptSpec = {
    id: 'player-butler-choose-master',
    version: '1.0',
    title: 'Butler – Choose Master',
    tags: ['botc', 'player', 'butler', 'night'],
    perspective: 'player',

    instructions: [
        'You are the Butler in Blood on the Clocktower.',
        'Each night choose a living Master; you can only vote if they vote.',
        'Follow PI wiki rules and use partial info.'
    ],

    guidelines: [
        'Pick a reliable voter who is likely to live.',
        'If Good, choose someone you trust; if Evil, consider misdirection.',
        'Keep the choice consistent with your public behavior.'
    ],

    goal: 'Select a Master whose voting behavior supports your strategy.',

    additionalConsiderations: [
        'Late game: avoid Masters who abstain.',
        'If you expect pressure, pick a Master whose votes help your story.'
    ],

    input: [
        'Your seat',
        'Living players list',
        'Public votes/claims',
        'Suspicion map',
        'Current day/night',
        'Personality profile'
    ],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ButlerChooseMaster',
        type: 'object',
        additionalProperties: false,
        required: ['chosenSeat', 'reasoning'],
        properties: {
            chosenSeat: {
                type: 'integer',
                minimum: 1,
                maximum: Math.max(1, playerCount),
                description: 'Seat of the chosen Master (not yourself).'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                description: 'Why this Master choice fits your plan.'
            }
        }
    })
};
