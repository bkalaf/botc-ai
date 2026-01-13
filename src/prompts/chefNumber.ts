// src/prompts/chefNumber.ts
import { genericStorytellerCore } from './_genericStorytellerCore';
import { PromptSpec } from './prompt-types';

export const chefNumber: PromptSpec = {
    id: 'st-chef-number',
    version: '3.0',
    title: 'Chef – Evil Adjacent Pair Count',
    tags: ['botc', 'storyteller', 'chef', 'info'],
    perspective: 'storyteller',

    ...genericStorytellerCore,

    goal: `Determine the Chef's number: the count of immediately adjacent pairs of Evil players sitting next to each other (seating is circular). Examine the seating like a linked list with the highest number seat connecting back to 1. Go through the list and calculate the number of evil immediate pairs (any good players in between break up the pairs). So, if for example, it went 1-monk, 2-imp, 3-saint, 4-baron, the correct count would be 0 whereas 1-recluse (good, but misregisters), 2-imp (evil), 3-saint (good), 4-baron (evil) could be either 2, or 0 depending on if we counted the recluse as evil in this example.`,

    additionalConsiderations: [
        `SEATING IS CIRCULAR: The last seat is adjacent to seat 0.`,
        `ADJACENT PAIRS ARE THOSE IMMEDIATELY ADJACENT: Meaning that seat 3 and 4 being evil is a pair, seat 3 and 5 being evil is not a pair, unless 4 is evil as well and then that would be 2 pairs (3 and 4 & 4 and 5)`,
        `COUNTING RULE: Each adjacent Evil-Evil connection counts as 1 pair. Three Evils in a row produces 2 pairs.`,
        `MISREGISTRATION: Recluse may register as Evil; Spy may register as Good. Apply selectively to create useful ambiguity.`,
        `SOBER/HEALTHY CHEF: Default to the true count unless you have a strong reason to deviate legally.`,
        `DRUNK/POISONED CHEF: If giving an incorrect count, prefer a nearby number that still generates plausible seating worlds.`,
        `PATTERN QUALITY: Aim for a number that creates multiple competing seating theories rather than a single dominant solve.`
    ],

    input: [
        `Seating order with seat numbers`,
        `Full grimoire (including actual alignments, and whether Recluse/Spy are in play)`,
        `Chef sober/healthy state`
    ],

    output: {
        count: "number (Chef's reported adjacent Evil pair count)",
        reasoning: {
            type: 'string',
            description:
                'Brief ST philosophy explaining the choice, including any misregistration and/or sobriety considerations.'
        }
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ChefNumberOutput',
        type: 'object',
        additionalProperties: false,
        required: ['count', 'reasoning'],
        properties: {
            count: {
                type: 'number',
                minimum: 0,
                maximum: 6,
                description: 'The chefs reported adjacent Evil pair count.'
            },
            reasoning: {
                type: 'string',
                description:
                    'Brief ST philosophy explaining the choice, including any misregistration and/or sobriety considerations.'
            }
        }
    }
};
