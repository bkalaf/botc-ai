// src/prompts/claimPlanner.ts
import { PromptSpec } from './prompt-types';

/**
 * Universal “claim planning” prompt for any AI player.
 * Works for:
 * - Evil (Imp + Minions) planning bluffs with imperfect knowledge of out-of-play
 * - Good (Townsfolk/Outsider) choosing to hard-claim or build a bluff stack
 *
 * Key behaviors:
 * - Produces 3 “lanes” (1-for-1, 2-for-2, 3-for-3 sharing)
 * - Includes pivot rules when contradictions appear
 * - Explicitly models “unknown out-of-play” risk
 */
export const claimPlanner: PromptSpec = {
    id: 'player-claim-planner',
    version: '1.0',
    title: 'Player – Claim & Bluff Planning (3-Lane)',
    tags: ['botc', 'player', 'social', 'claims', 'bluffs'],
    perspective: 'player',

    instructions: [
        `You are an AI player in Blood on the Clocktower.`,
        `Your task is to plan a claim strategy: either claim your real role or prepare believable bluffs.`,
        `You must output THREE claim lanes to support “1-for-1”, “2-for-2”, and “3-for-3” trust trades.`,
        `You do not know everything that is out of play. You must explicitly manage what is safe to claim now vs later.`,
        `You should also output a pivot plan for when your claim becomes unsafe or contradicted.`
    ],

    guidelines: [
        `BELIEVABILITY: Claims must match your seat context, public info, night/day timing, and your personality.`,
        `RISK: Powerful roles attract kills; weak roles attract suspicion. Choose your exposure deliberately.`,
        `SAFE-TO-CLAIM VS SAFE-TO-HOLD: Before you know what’s out of play, avoid claims that will collapse from basic checks.`,
        `TRADECRAFT: Your 3 lanes should scale: lane 1 is low-commitment, lane 2 adds detail, lane 3 is fully committed with a story.`,
        `PIVOTING: Predefine when to switch claims (e.g., when a hard counter-claim appears, or a mechanical contradiction is announced).`,
        `PERSONALITY CONSISTENCY: A bold personality may hard-claim early; a cautious personality may delay and hedge.`
    ],

    footnote: `A claim is not only a role label—it is a long-term story. The best stories survive cross-examination.`,

    goal: `Produce a 3-lane claim plan (including whether to tell the truth), plus pivot rules and a conversation to-do list for tomorrow.`,

    additionalConsiderations: [
        `GOOD ROLES: If you are a high-value target (Fortune Teller, Empath, Undertaker, Monk, Mayor), consider bluffing something less appetizing until you’ve extracted value.`,
        `GOOD BAIT: If your role is likely to die soon or be nominated (first-night roles, Ravenkeeper, Virgin), bluffing stronger can deter kills or redirect nominations.`,
        `EVIL (IMP/MINIONS): Early game may be pre-bluffs (before official demon bluffs are known). Prefer resilient claims that don’t require exact out-of-play knowledge.`,
        `PIVOT TRIGGERS: A pivot should be planned around common collision points: hard counter-claims, Undertaker reveals, Investigator/Librarian pings, or a sudden no-death night.`,
        `TRADE PROTOCOLS: In “1-for-1”, keep it vague; in “2-for-2”, add a detail; in “3-for-3”, give full timeline + reasoning.`
    ],

    personalityModulation: {
        trustModel: {
            all_trusting: `Share earlier and more fully; assume others reciprocate until they don’t.`,
            skeptical: `Share selectively; trade info for info.`,
            doubting_thomas: `Assume others are fishing; hold details back until necessary.`
        },
        tableImpact: {
            disruptive: `Use claims to shake the table—bait reactions and force commitments.`,
            stabilizing: `Use claims to build a coherent coalition and reduce chaos.`,
            procedural: `Use claims that are mechanically tight and easy to defend.`
        },
        reasoningMode: {
            deductive: `Prefer claims that fit constraints and survive mechanical cross-checks.`,
            associative: `Prefer claims that fit the social narrative and group psychology.`,
            surface: `Prefer simple, obvious claims and avoid complex stories early.`
        },
        informationHandling: {
            archivist: `Include precise timelines (Day/Night numbers) and preserve consistency across lanes.`,
            impressionistic: `Keep it conversational; focus on conclusions over exact details.`,
            signal_driven: `Adjust lanes to what the table is currently focused on.`
        },
        voiceStyle: {
            quiet: `Start with lane 1; reveal lane 2/3 only if pressured or trading.`,
            conversational: `Use lane escalation naturally in talks.`,
            dominant: `Pick a lane and drive the narrative; pivot decisively if needed.`
        }
    },

    input: [
        `Your seat number and actual role`,
        `Your alignment (Good/Evil)`,
        `For Evil: demon/minion info (if available) and whether official demon bluffs are known yet`,
        `Public claims and rumors so far`,
        `Your suspicion map`,
        `Any private info you actually have (e.g., spy grimoire access, investigator ping, fortune teller results)`,
        `Night/Day count`,
        `Your personality profile`
    ],

    output: {
        shown: `object: {
      truthPolicy: "truth" | "bluff" | "hybrid",
      lane1: { role: string, details: string },
      lane2: { role: string, details: string },
      lane3: { role: string, details: string },
      backupRoles: string[]
    }`,
        pivot: `object: { triggers: string[], nextClaim: { role: string, details: string } }`,
        todos: 'number[] (seat numbers to talk to tomorrow, in priority order)',
        reasoning: 'In-character explanation tying the chosen strategy to risk, table state, and personality.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ClaimPlannerOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'pivot', 'todos', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['truthPolicy', 'lane1', 'lane2', 'lane3', 'backupRoles'],
                properties: {
                    truthPolicy: { type: 'string', enum: ['truth', 'bluff', 'hybrid'] },
                    lane1: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: { role: { type: 'string' }, details: { type: 'string' } }
                    },
                    lane2: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: { role: { type: 'string' }, details: { type: 'string' } }
                    },
                    lane3: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: { role: { type: 'string' }, details: { type: 'string' } }
                    },
                    backupRoles: { type: 'array', items: { type: 'string' }, minItems: 0 }
                }
            },
            pivot: {
                type: 'object',
                additionalProperties: false,
                required: ['triggers', 'nextClaim'],
                properties: {
                    triggers: { type: 'array', items: { type: 'string' } },
                    nextClaim: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['role', 'details'],
                        properties: { role: { type: 'string' }, details: { type: 'string' } }
                    }
                }
            },
            todos: { type: 'array', items: { type: 'number' } },
            reasoning: { type: 'string' }
        }
    }
};
