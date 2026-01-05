// src/store/middleware/storyteller-bridge-listener.ts
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { enqueueBack, enqueueFront } from '../ai-orchestrator/ai-orchestrator-slice';
import { storytellerQueueSlice, type IStorytellerQueueItem } from '../st-queue/st-queue-slice';

const mapStorytellerQueueItem = (item: IStorytellerQueueItem) => ({
    id: item.id,
    type: item.type,
    payload: item.payload,
    requestedBy: item.requestedBy,
    httpTarget: 'storyteller' as const
});

export const registerStorytellerBridgeListener = (listenerMiddleware: ListenerMiddlewareInstance) => {
    listenerMiddleware.startListening({
        actionCreator: storytellerQueueSlice.actions.enqueueTask,
        effect: (action, listenerApi) => {
            listenerApi.dispatch(enqueueBack(mapStorytellerQueueItem(action.payload)));
        }
    });

    listenerMiddleware.startListening({
        actionCreator: storytellerQueueSlice.actions.pushtask,
        effect: (action, listenerApi) => {
            listenerApi.dispatch(enqueueFront(mapStorytellerQueueItem(action.payload)));
        }
    });
};
