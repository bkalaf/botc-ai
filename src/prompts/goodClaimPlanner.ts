// src/prompts/goodClaimPlanner.ts
import { claimPlanner } from './claimPlanner';
import { PromptSpec } from './prompt-types';

/**
 * Wrapper for Townsfolk/Outsiders to plan:
 * - hard-claim real role early
 * - delay + bluff stack to avoid demon targeting
 * - “upgrade bluff” for kill deterrence / nomination deterrence
 */
export const goodClaimPlanner: PromptSpec = {
    ...claimPlanner,
    id: 'player-good-claim-planner',
    version: '1.0',
    title: 'Good – Claim Strategy (Truth vs Bluff, 3-Lane)',
    tags: ['botc', 'player', 'good', 'claims', 'bluffs'],
    additionalConsiderations: [
        ...(claimPlanner.additionalConsiderations ?? []),
        `Delay if you are a high-value Demon target.`,
        `Plan when to reveal the truth.`,
        `Use lane escalation to build trust.`
    ]
};
