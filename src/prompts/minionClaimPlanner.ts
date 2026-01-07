// src/prompts/minionClaimPlanner.ts
import { claimPlanner } from './claimPlanner';

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
        `MINION ROLE COVER: Choose claims that explain your behavior (e.g., why you talk to certain players, why you push certain executions).`,
        `COORDINATION: Avoid colliding with Demon/other Minion claims. Prefer complementary lanes (different “tiers” of power).`,
        `SACRIFICE OPTION: Sometimes you want to be executed or killed to validate a world; plan a lane that makes your death useful.`,
        `PRE-BLUFF PHASE: Before official Demon bluffs are known, prioritize flexible claims that don’t require precise out-of-play certainty.`
    ]
};
