// src/prompts/impClaimPlanner.ts
import { claimPlanner } from './claimPlanner';
import { PromptSpec } from './prompt-types';

/**
 * Thin wrapper around claimPlanner with Imp-specific emphasis.
 * You can do the same for each Minion by changing the role-specific “additionalConsiderations”.
 */
export const impClaimPlanner: PromptSpec = {
    ...claimPlanner,
    id: 'player-imp-claim-planner',
    version: '1.0',
    title: 'Imp – Claim & Bluff Planning (3-Lane)',
    tags: ['botc', 'player', 'imp', 'claims', 'bluffs'],
    additionalConsiderations: [
        ...(claimPlanner.additionalConsiderations ?? []),
        `Avoid claims that prevent later star-pass stories.`,
        `Plan a narrative for no-death nights.`,
        `Keep early claims resilient to out-of-play risk.`
    ]
};
