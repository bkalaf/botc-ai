// src/prompts/impClaimPlanner.ts
import { claimPlanner } from './claimPlanner';

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
        `IMP SURVIVAL: Your claim should minimize getting executed while keeping you free to shape night outcomes.`,
        `STAR-PASS COMPATIBILITY: Avoid claims that make a sudden death look impossible if you intend to star-pass later.`,
        `SINK-KILL NARRATIVES: If you plan no-death nights, pick claims/bluffs (yours or teammates) that can “explain” them (Monk/Soldier framing).`,
        `BEFORE BLUFFS ARE KNOWN: Use resilient claims that are unlikely to be out-of-play contradictions and that don’t require precise first-night info.`
    ]
};
