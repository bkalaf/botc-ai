// src/store/st-queue/st-queue-slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';

export interface IStorytellerQueueItem {
    id: string;
    type: string;
    kind?: string;
    interaction?: StorytellerInteraction;
    payload?: Record<string, unknown>;
    requestedBy?: string;
}

export interface StorytellerQueueState {
    queue: IStorytellerQueueItem[];
    isRunning: boolean;
    awaitingHuman: boolean;
    error: string | null;
}

export const initialState: StorytellerQueueState = {
    queue: [],
    isRunning: false,
    awaitingHuman: false,
    error: null
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
        setAwaitingHuman: (state, action: PayloadAction<boolean>) => {
            state.awaitingHuman = action.payload;
        },
        enqueueTask: (state, action: PayloadAction<IStorytellerQueueItem>) => {
            state.queue.push(action.payload);
        },
        pushtask: (state, action: PayloadAction<IStorytellerQueueItem>) => {
            state.queue.unshift(action.payload);
        },
        popTask: (state) => {
            state.queue.shift();
        },
        popTask: (state) => {
            state.currentItem = state.items.shift() ?? null;
        },
        clearQueue: (state) => {
            state.queue = [];
        },
        setRunning: (state, action: PayloadAction<boolean>) => {
            state.isRunning = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    },
    selectors: {
        selectSTQueueState: (state) => state,
        selectSTQueue: (state) => state.queue,
        selecSTQueueSize: (state) => state.queue.length,
        selectSTQueueIsRunning: (state) => state.isRunning,
        selectSTNextTask: (state) => state.queue[0] ?? null,
        selectSTAwaitingHuman: (state) => state.awaitingHuman
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
