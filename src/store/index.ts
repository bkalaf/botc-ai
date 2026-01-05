// src/store/index.ts
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import { aiOrchestratorSlice } from './ai-orchestrator/ai-orchestrator-slice';
import { chatsSlice } from './chats/chats-slice';
import { gameSlice } from './game/game-slice';
import { grimoireSlice } from './grimoire/grimoire-slice';
import { addLogEntry, historySlice } from './history/history-slice';
import { createDynamicMiddlewareRegistry } from './middleware/dynamic-middleware';
import { registerHistoryListener } from './middleware/history-listener';
import { registerStorytellerBridgeListener } from './middleware/storyteller-bridge-listener';
import { storytellerQueueSlice } from './st-queue/st-queue-slice';
import { votingSlice } from './voting/voting-slice';

export const createStoreListeners = () => {
    const listenerMiddleware = createListenerMiddleware();

    registerHistoryListener(listenerMiddleware);
    registerStorytellerBridgeListener(listenerMiddleware);

    return listenerMiddleware;
};

const listenerMiddleware = createStoreListeners();
export const dynamicMiddlewareRegistry = createDynamicMiddlewareRegistry();

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
        aiOrchestrator: aiOrchestratorSlice.reducer,
        chats: chatsSlice.reducer,
        game: gameSlice.reducer,
        grimoire: grimoireSlice.reducer,
        history: historySlice.reducer,
        storytellerQueue: storytellerQueueSlice.reducer,
        voting: votingSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(dynamicMiddlewareRegistry.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
