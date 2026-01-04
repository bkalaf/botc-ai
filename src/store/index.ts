// src/store/index.ts
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import { aiOrchestratorSlice, enqueueBack, enqueueFront } from './ai-orchestrator/ai-orchestrator-slice';
import { chatsSlice } from './chats/chats-slice';
import { gameSlice } from './game/game-slice';
import { grimoireSlice } from './grimoire/grimoire-slice';
import { addLogEntry, historySlice } from './history/history-slice';
import { IStorytellerQueueItem, storytellerQueueSlice } from './st-queue/st-queue-slice';

const mapStorytellerQueueItem = (item: IStorytellerQueueItem) => ({
    id: item.id,
    type: item.type,
    payload: item.payload,
    requestedBy: item.requestedBy,
    httpTarget: 'storyteller' as const
});

const listenerMiddleware = createListenerMiddleware();
export const dynamicMiddlewareRegistry = createDynamicMiddlewareRegistry();

listenerMiddleware.startListening({
    predicate: (action) => {
        if (action.type.startsWith('@@')) {
            return false;
        }

        return !action.type.startsWith(historySlice.name);
    },
    effect: (action, listenerApi) => {
        const logEntryType = isRejected(action)
            ? 'error'
            : action.type.endsWith('/fulfilled')
              ? 'success'
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

listenerMiddleware.startListening({
    actionCreator: storytellerQueueSlice.actions.enqueueBack,
    effect: (action, listenerApi) => {
        listenerApi.dispatch(enqueueBack(mapStorytellerQueueItem(action.payload)));
    }
});

listenerMiddleware.startListening({
    actionCreator: storytellerQueueSlice.actions.enqueueFront,
    effect: (action, listenerApi) => {
        listenerApi.dispatch(enqueueFront(mapStorytellerQueueItem(action.payload)));
    }
});

export const store = configureStore({
    reducer: {
        aiOrchestrator: aiOrchestratorSlice.reducer,
        chats: chatsSlice.reducer,
        game: gameSlice.reducer,
        grimoire: grimoireSlice.reducer,
        history: historySlice.reducer,
        storytellerQueue: storytellerQueueSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(listenerMiddleware.middleware)
            .concat(dynamicMiddlewareRegistry.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
