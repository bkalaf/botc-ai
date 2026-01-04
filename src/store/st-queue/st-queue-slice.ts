// src/store/st-queue/st-queue-slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';

export type StorytellerQueueMode = 'fifo' | 'lifo';
export type StorytellerInteraction = 'human';

export type StorytellerTaskHandler = (
    task: IStorytellerQueueItem,
    api: { dispatch: AppDispatch; getState: () => RootState }
) => Promise<void> | void;

export type ThunkExtra = {
    stHandlers?: Record<string, StorytellerTaskHandler>;
};

export interface IStorytellerQueueItem {
    id: string;
    type: string;
    kind?: string;
    interaction?: StorytellerInteraction;
    payload?: Record<string, unknown>;
    requestedBy?: string;
}

export interface IStorytellerQueueSlice {
    items: IStorytellerQueueItem[];
    currentItem: IStorytellerQueueItem | null;
    running: boolean;
    error?: string;
    awaitingHumanTaskId?: string;
    lastRunAtMs?: number;
}

export const initialState: IStorytellerQueueSlice = {
    items: [],
    currentItem: null,
    running: false,
    error: undefined,
    awaitingHumanTaskId: undefined,
    lastRunAtMs: undefined
};

// ---------- Thunks ----------

/**
 * Run a single task from the front (if any).
 * - Pops it from state
 * - Executes handler (if provided)
 * - Updates lastRunAtMs / error
 */
export const runNextTask = createAsyncThunk<
    { ran: boolean; paused?: 'human'; taskId?: string },
    void,
    { state: RootState; dispatch: AppDispatch; extra: ThunkExtra }
>('storytellerQueue/runNextTask', async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const task = selectSTNextTask(getState());
    if (!task) return { ran: false };

    // PAUSE if human interaction required and no response yet
    if (task.interaction === 'human') {
        const hasResponse = !!task.payload?.humanResponse;
        if (!hasResponse) {
            dispatch(setAwaitingHuman({ taskId: task.id }));
            return { ran: false, paused: 'human', taskId: task.id };
        }
    }

    // Pop first so we don’t re-run if handler throws
    dispatch(popTask());

    const handlers = thunkAPI.extra?.stHandlers;
    const taskKind = task.kind ?? task.type;
    const handler = handlers?.[taskKind];

    try {
        if (handler) {
            await handler(task, { dispatch, getState });
        } else {
            // Default fallback: no-op (or log)
            // You can replace this with dispatch(loggerSlice.actions.addEntry(...)) in your app.
            console.debug(`[STQueue] Unhandled task kind: ${taskKind}`, task);
        }

        dispatch(setLastRunAtMs(Date.now()));
        return { ran: true, taskId: task.id };
    } catch (err: any) {
        dispatch(setError(err?.message ?? String(err)));
        dispatch(setLastRunAtMs(Date.now()));
        return { ran: true, taskId: task.id };
    }
});

/**
 * Runs tasks until the queue is empty.
 * Safety: will stop after maxSteps to avoid infinite loops if tasks keep enqueuing.
 */
export const runTasks = createAsyncThunk<
    { ranCount: number; stoppedBecause: 'empty' | 'maxSteps' | 'error' | 'human' },
    { maxSteps?: number } | void,
    { state: RootState; dispatch: AppDispatch; extra: ThunkExtra }
>('storytellerQueue/runTasks', async (arg, thunkAPI) => {
    const maxSteps = arg && typeof arg === 'object' && 'maxSteps' in arg && arg.maxSteps ? arg.maxSteps : 500;

    const { dispatch, getState } = thunkAPI;

    dispatch(setRunning(true));
    dispatch(setError(undefined));

    let ranCount = 0;

    try {
        for (let i = 0; i < maxSteps; i++) {
            const size = selectSTQueueSize(getState());
            if (size === 0) {
                dispatch(setRunning(false));
                return { ranCount, stoppedBecause: 'empty' };
            }

            const res = await dispatch(runNextTask()).unwrap();
            if (res.paused === 'human') {
                dispatch(setRunning(false));
                return { ranCount, stoppedBecause: 'human' };
            }
            if (res.ran) ranCount++;

            const err = selectSTQueueState(getState()).error;
            if (err) {
                dispatch(setRunning(false));
                return { ranCount, stoppedBecause: 'error' };
            }
        }

        dispatch(setRunning(false));
        return { ranCount, stoppedBecause: 'maxSteps' };
    } finally {
        dispatch(setLastRunAtMs(Date.now()));
    }
});

export const storytellerQueueSlice = createSlice({
    name: 'storytellerQueue',
    initialState,
    reducers: {
        enqueueBack: (state, action: PayloadAction<IStorytellerQueueItem>) => {
            state.items.push(action.payload);
        },
        enqueueFront: (state, action: PayloadAction<IStorytellerQueueItem>) => {
            state.items.unshift(action.payload);
        },
        dequeueNext: (state) => {
            state.currentItem = state.items.shift() ?? null;
        },
        popTask: (state) => {
            state.currentItem = state.items.shift() ?? null;
        },
        clearQueue: (state) => {
            state.items = [];
        },
        clearCurrent: (state) => {
            state.currentItem = null;
        },
        setRunning: (state, action: PayloadAction<boolean>) => {
            state.running = action.payload;
        },
        setError: (state, action: PayloadAction<string | undefined>) => {
            state.error = action.payload;
        },
        setAwaitingHuman: (state, action: PayloadAction<{ taskId: string }>) => {
            state.awaitingHumanTaskId = action.payload.taskId;
        },
        clearAwaitingHuman: (state) => {
            state.awaitingHumanTaskId = undefined;
        },
        setLastRunAtMs: (state, action: PayloadAction<number>) => {
            state.lastRunAtMs = action.payload;
        }
    },
    selectors: {
        selectQueueItems: (state) => state.items,
        selectHasQueueItems: (state) => state.items.length > 0,
        selectNextQueueItem: (state) => state.items[0] ?? null,
        selectCurrentQueueItem: (state) => state.currentItem,
        selectRunning: (state) => state.running,
        selectError: (state) => state.error,
        selectAwaitingHumanTaskId: (state) => state.awaitingHumanTaskId,
        selectLastRunAtMs: (state) => state.lastRunAtMs
    }
});

export const {
    enqueueBack,
    enqueueFront,
    dequeueNext,
    popTask,
    clearQueue,
    clearCurrent,
    setRunning,
    setError,
    setAwaitingHuman,
    clearAwaitingHuman,
    setLastRunAtMs
} = storytellerQueueSlice.actions;

export const {
    selectQueueItems,
    selectHasQueueItems,
    selectNextQueueItem,
    selectCurrentQueueItem,
    selectRunning,
    selectError,
    selectAwaitingHumanTaskId,
    selectLastRunAtMs
} = storytellerQueueSlice.selectors;

export const selectSTQueueState = (state: RootState) => state.storytellerQueue;
export const selectSTQueueSize = (state: RootState) => selectSTQueueState(state).items.length;
export const selectSTNextTask = (state: RootState) => selectSTQueueState(state).items[0] ?? null;
