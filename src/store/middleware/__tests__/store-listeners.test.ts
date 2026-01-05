// src/store/middleware/__tests__/store-listeners.test.ts
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { aiOrchestratorSlice } from '../../ai-orchestrator/ai-orchestrator-slice';
import { historySlice } from '../../history/history-slice';
import { registerHistoryListener } from '../history-listener';
import { registerStorytellerBridgeListener } from '../storyteller-bridge-listener';
import { storytellerQueueSlice } from '../../st-queue/st-queue-slice';

const buildStore = () => {
    const listenerMiddleware = createListenerMiddleware();

    registerHistoryListener(listenerMiddleware);
    registerStorytellerBridgeListener(listenerMiddleware);

    return configureStore({
        reducer: {
            aiOrchestrator: aiOrchestratorSlice.reducer,
            history: historySlice.reducer,
            storytellerQueue: storytellerQueueSlice.reducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware)
    });
};

describe('store listeners', () => {
    it('logs fulfilled actions with a success entry', () => {
        const store = buildStore();

        store.dispatch({ type: 'game/load/fulfilled' });

        const entries = store.getState().history.entries;
        expect(entries).toHaveLength(1);
        expect(entries[0]).toEqual(
            expect.objectContaining({
                actionType: 'game/load/fulfilled',
                logEntryType: 'success'
            })
        );
    });

    it('logs rejected actions with an error entry', () => {
        const store = buildStore();

        store.dispatch({ type: 'game/load/rejected', error: { message: 'nope' } });

        const entries = store.getState().history.entries;
        expect(entries).toHaveLength(1);
        expect(entries[0]).toEqual(
            expect.objectContaining({
                actionType: 'game/load/rejected',
                logEntryType: 'error'
            })
        );
    });

    it('ignores @@ actions and history slice actions', () => {
        const store = buildStore();

        store.dispatch({ type: '@@redux/INIT' });
        store.dispatch(
            historySlice.actions.addLogEntry({
                message: 'Manual log',
                logEntryType: 'info',
                scope: 'system'
            })
        );

        const entries = store.getState().history.entries;
        expect(entries).toHaveLength(1);
        expect(entries[0]).toEqual(
            expect.objectContaining({
                message: 'Manual log',
                logEntryType: 'info'
            })
        );
    });

    it('bridges storyteller queue tasks into AI orchestrator items', () => {
        const store = buildStore();

        store.dispatch(
            storytellerQueueSlice.actions.enqueueTask({
                id: 'task-1',
                type: 'announce',
                payload: { message: 'hello' },
                requestedBy: 'gm'
            })
        );
        store.dispatch(
            storytellerQueueSlice.actions.pushtask({
                id: 'task-2',
                type: 'urgent',
                payload: { message: 'now' },
                requestedBy: 'gm'
            })
        );

        const items = store.getState().aiOrchestrator.items;
        expect(items).toHaveLength(2);
        expect(items[0]).toEqual(
            expect.objectContaining({
                id: 'task-2',
                type: 'urgent',
                payload: { message: 'now' },
                requestedBy: 'gm',
                httpTarget: 'storyteller'
            })
        );
        expect(items[1]).toEqual(
            expect.objectContaining({
                id: 'task-1',
                type: 'announce',
                payload: { message: 'hello' },
                requestedBy: 'gm',
                httpTarget: 'storyteller'
            })
        );
    });
});
