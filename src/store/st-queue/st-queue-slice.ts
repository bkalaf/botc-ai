// src/store/st-queue/st-queue-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StorytellerQueueMode = 'fifo' | 'lifo';

export interface IStorytellerQueueItem {
    id: string;
    type: string;
    payload?: Record<string, unknown>;
    requestedBy?: string;
}

export interface IStorytellerQueueSlice {
    items: IStorytellerQueueItem[];
    currentItem: IStorytellerQueueItem | null;
}

export const initialState: IStorytellerQueueSlice = {
    items: [],
    currentItem: null
};

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
        }
    },
    selectors: {
        selectQueueItems: (state) => state.items,
        selectHasQueueItems: (state) => state.items.length > 0,
        selectNextQueueItem: (state) => state.items[0] ?? null,
        selectCurrentQueueItem: (state) => state.currentItem
    }
});
