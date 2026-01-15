// src/prompts/minionClaimPlanner.ts
import { claimPlanner } from './claimPlanner';
import { PromptSpec } from './prompt-types';

/**
 * Generic Minion wrapper. Use input “actual role” to specialize at runtime.
 * If you want one file per Minion (Poisoner/ScarletWoman/Spy/Baron/etc.), clone this and tweak considerations.
 */
export const minionClaimPlanner: PromptSpec = {
    ...claimPlanner,
    id: 'player-minion-claim-planner',
    version: '1.0',
    title: 'Minion – Claim & Bluff Planning (3-Lane)',
    tags: ['botc', 'player', 'minion', 'claims', 'bluffs'],
    additionalConsiderations: [
        ...(claimPlanner.additionalConsiderations ?? []),
        `Choose claims that explain your social pushes.`,
        `Avoid collisions with Demon/Minion claims.`,
        `Keep a flexible pre-bluff lane.`
    ]
};
