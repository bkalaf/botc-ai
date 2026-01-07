// src/store/st-queue-types.ts
export type STStepType =
    | 'wake_choice' // wake player, they choose target(s)
    | 'wake_info' // wake player, give info only
    | 'check_trigger' // deterministic check (no wake)
    | 'prepare_info' // compute candidate info but DO NOT commit to grimoire
    | 'commit_info' // commit prepared info to grimoire + reminders
    | 'resolve_effect'; // resolve ongoing effects, reminders, flips, etc.

export type STInteraction =
    | 'ai' // auto-prompt AI + parse response
    | 'human' // pause and wait for UI response
    | 'none'; // no interaction needed

export type STTask = {
    id: string;
    kind: 'night_step' | 'log' | 'custom';
    phase: 'night' | 'day' | 'setup' | 'dawn';

    roleId?: string; // e.g. "poisoner", "washerwoman"
    stepType: STStepType;

    /** which seat(s) this step applies to (some roles have multiple instances) */
    seatIds?: number[];

    interaction: STInteraction;

    /** used for ordering + sanity checks */
    nightNumber: number;

    /** scratch / prepared results stored somewhere (not in task if big) */
    payload?: Record<string, any>;
};

export type StorytellerInteraction = 'human' | 'auto' | 'system';

export interface IStorytellerQueueItem {
    id: string;
    type: string;
    kind?: string;
    interaction?: StorytellerInteraction;
    payload?: Record<string, unknown>;
    requestedBy?: string;
}

export interface StorytellerQueueState {
    items: IStorytellerQueueItem[];
    currentItem: IStorytellerQueueItem | null;
    isRunning: boolean;
    awaitingHumanTaskId: string | null;
    error: string | null;
    lastRunAtMs: number | null;
}
