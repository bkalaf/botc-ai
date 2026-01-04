// src/store/history/history-slice.ts
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type LogEntryType = 'success' | 'error' | 'info' | 'debug';
export type LogEntryScope = 'player' | 'storyteller' | 'system';

export interface LogEntry {
    id: string;
    message: string;
    actionType?: string;
    logEntryType: LogEntryType;
    scope: LogEntryScope;
    timestamp: number;
    reasoning?: string;
}

export interface HistoryState {
    entries: LogEntry[];
}

const initialState: HistoryState = {
    entries: []
};

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        addLogEntry: {
            reducer: (state, action: PayloadAction<LogEntry>) => {
                state.entries.push(action.payload);
            },
            prepare: (payload: Omit<LogEntry, 'id' | 'timestamp'>) => ({
                payload: {
                    ...payload,
                    id: nanoid(),
                    timestamp: Date.now()
                }
            })
        },
        clearHistory: (state) => {
            state.entries = [];
        }
    },
    selectors: {
        selectHistoryEntries: (state) => state.entries
    }
});

export const { addLogEntry, clearHistory } = historySlice.actions;
export const { selectHistoryEntries } = historySlice.selectors;
