// src/store/st-queue/st-queue-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IStorytellerQueueItem {
    id: string;
    type: string;
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
