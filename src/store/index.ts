// src/store/index.ts
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import { aiOrchestratorSlice } from './ai-orchestrator/ai-orchestrator-slice';
import { chatsSlice } from './chats/chats-slice';
import { gameSlice, nextDayPhase } from './game/game-slice';
import { grimoireSlice } from './grimoire/grimoire-slice';
import { addLogEntry, historySlice } from './history/history-slice';
import { createDynamicMiddlewareRegistry } from './middleware/dynamic-middleware';
import { registerHistoryListener } from './middleware/history-listener';
import { registerStorytellerBridgeListener } from './middleware/storyteller-bridge-listener';
import {
    setShowFirstNightOrder,
    setShowNightOrder,
    setShowOtherNightOrder,
    settingsSlice
} from './settings/settings-slice';
import { storytellerQueueSlice } from './st-queue/st-queue-slice';
import { votingSlice } from './voting/voting-slice';
import { stQueueThunkExtra } from './st-queue/stQueueThunkExtra';
import uiSlice, { showDayBreakDialog, showNightBreakDialog } from './ui/ui-slice';
import { memorySlice } from './memory/memory-slice';

export const createStoreListeners = () => {
    const listenerMiddleware = createListenerMiddleware();

    registerHistoryListener(listenerMiddleware);
    registerStorytellerBridgeListener(listenerMiddleware);

    return listenerMiddleware;
};

const listenerMiddleware = createStoreListeners();
const nightOrderListener = createListenerMiddleware();
const phaseListener = createListenerMiddleware();
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

nightOrderListener.startListening({
    predicate: (action: any) => setShowNightOrder.match(action),
    effect: (action, listenerApi) => {
        listenerApi.dispatch(setShowFirstNightOrder(action.payload));
        listenerApi.dispatch(setShowOtherNightOrder(action.payload));
    }
});

phaseListener.startListening({
    predicate: (action) => nextDayPhase.match(action),
    effect: (action, listenerApi) => {
        const phase = (listenerApi.getState() as RootState).game.phase;
        if (phase === 'day') {
            listenerApi.dispatch(showDayBreakDialog());
        } else {
            listenerApi.dispatch(showNightBreakDialog());
        }
    }
});

export const store = configureStore({
    reducer: {
        aiOrchestrator: aiOrchestratorSlice.reducer,
        chats: chatsSlice.reducer,
        game: gameSlice.reducer,
        grimoire: grimoireSlice.reducer,
        history: historySlice.reducer,
        memory: memorySlice.reducer,
        settings: settingsSlice.reducer,
        storytellerQueue: storytellerQueueSlice.reducer,
        voting: votingSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: stQueueThunkExtra
            }
        })
            .prepend(listenerMiddleware.middleware, nightOrderListener.middleware)
            .concat(dynamicMiddlewareRegistry.middleware, phaseListener.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
