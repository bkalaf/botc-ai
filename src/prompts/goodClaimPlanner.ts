// src/prompts/goodClaimPlanner.ts
import { claimPlanner } from './claimPlanner';

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
        `TARGET MAGNETS: If your real role is a high-value Demon target (FT/Empath/Undertaker/Monk/Mayor), strongly consider delaying or bluffing low-impact early.`,
        `FADE & BAIT: If your real role benefits from dying (Ravenkeeper) or is “spent” early (first-night roles), bluffing stronger can redirect kills or reduce nominations.`,
        `TRUTH WINDOWS: Plan when you will “come clean” (e.g., after you’ve used your ability, after a key execution, or if you are nominated).`,
        `TRUST TRADES: Your lane escalation should support building trust in stages without overexposing you.`
    ]
};
