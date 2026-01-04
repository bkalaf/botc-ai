// src/store/index.ts
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import { gameSlice } from './game/game-slice';
import { addLogEntry, historySlice } from './history/history-slice';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    predicate: (action) => {
        if (action.type.startsWith('@@')) {
            return false;
        }

        return !action.type.startsWith(historySlice.name);
    },
    effect: (action, listenerApi) => {
        const logEntryType =
            isRejected(action) ? 'error'
            : action.type.endsWith('/fulfilled') ? 'success'
            : 'info';

        listenerApi.dispatch(
            addLogEntry({
                message: `Action ${action.type} completed.`,
                actionType: action.type,
                logEntryType,
                scope: 'system'
            })
        );
    }
});

export const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        history: historySlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
