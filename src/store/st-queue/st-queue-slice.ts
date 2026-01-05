// src/store/st-queue/st-queue-slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';

export type StorytellerInteraction = 'human' | 'auto' | 'system';

export type StorytellerTaskHandler = (
    task: IStorytellerQueueItem,
    api: { dispatch: AppDispatch; getState: () => RootState }
) => Promise<void> | void;

export interface StorytellerQueueThunkExtra {
    stHandlers?: Record<string, StorytellerTaskHandler>;
}

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

export const initialState: StorytellerQueueState = {
    items: [],
    currentItem: null,
    isRunning: false,
    awaitingHumanTaskId: null,
    error: null,
    lastRunAtMs: null
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
    { state: RootState; dispatch: AppDispatch; extra: StorytellerQueueThunkExtra }
>('storytellerQueue/runNextTask', async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const state = selectSTQueueState(getState());
    const pendingTask = state.currentItem ?? state.items[0] ?? null;
    if (!pendingTask) return { ran: false };

    if (!state.currentItem) {
        dispatch(dequeueNext());
    }

    const task = selectSTQueueState(getState()).currentItem ?? pendingTask;

    // PAUSE if human interaction required and no response yet
    if (task.interaction === 'human') {
        const hasResponse = !!task.payload?.humanResponse;
        if (!hasResponse) {
            dispatch(setAwaitingHumanTaskId(task.id));
            return { ran: false, paused: 'human', taskId: task.id };
        }
    }

    dispatch(setAwaitingHumanTaskId(null));

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
    } finally {
        dispatch(clearCurrent());
    }
});

/**
 * Runs tasks until the queue is empty.
 * Safety: will stop after maxSteps to avoid infinite loops if tasks keep enqueuing.
 */
export const runTasks = createAsyncThunk<
    { ranCount: number; stoppedBecause: 'empty' | 'maxSteps' | 'error' | 'human' },
    { maxSteps?: number } | void,
    { state: RootState; dispatch: AppDispatch; extra: StorytellerQueueThunkExtra }
>('storytellerQueue/runTasks', async (arg, thunkAPI) => {
    const maxSteps = arg && typeof arg === 'object' && 'maxSteps' in arg && arg.maxSteps ? arg.maxSteps : 500;

    const { dispatch, getState } = thunkAPI;

    dispatch(setRunning(true));
    dispatch(setError(null));

    let ranCount = 0;

    try {
        for (let i = 0; i < maxSteps; i++) {
            const nextTask = selectSTNextTask(getState());
            if (!nextTask) {
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
        clearQueue: (state) => {
            state.items = [];
        },
        clearCurrent: (state) => {
            state.currentItem = null;
        },
        setRunning: (state, action: PayloadAction<boolean>) => {
            state.isRunning = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setAwaitingHumanTaskId: (state, action: PayloadAction<string | null>) => {
            state.awaitingHumanTaskId = action.payload;
        },
        setLastRunAtMs: (state, action: PayloadAction<number | null>) => {
            state.lastRunAtMs = action.payload;
        }
    },
    selectors: {
        selectQueueItems: (state) => state.items,
        selectHasQueueItems: (state) => state.items.length > 0,
        selectNextQueueItem: (state) => state.items[0] ?? null,
        selectCurrentQueueItem: (state) => state.currentItem,
        selectRunning: (state) => state.isRunning,
        selectError: (state) => state.error,
        selectAwaitingHumanTaskId: (state) => state.awaitingHumanTaskId,
        selectLastRunAtMs: (state) => state.lastRunAtMs
    }
});

export const {
    enqueueBack,
    enqueueFront,
    dequeueNext,
    clearQueue,
    clearCurrent,
    setRunning,
    setError,
    setAwaitingHumanTaskId,
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
export const selectSTNextTask = (state: RootState) => {
    const queueState = selectSTQueueState(state);
    return queueState.currentItem ?? queueState.items[0] ?? null;
};
