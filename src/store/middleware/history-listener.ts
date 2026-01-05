// src/store/middleware/history-listener.ts
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { isRejected } from '@reduxjs/toolkit';
import { addLogEntry, historySlice } from '../history/history-slice';

const shouldIgnoreAction = (actionType: string) =>
    actionType.startsWith('@@') || actionType.startsWith(historySlice.name);

const isFulfilledAction = (actionType: string) => actionType.endsWith('/fulfilled');

export const registerHistoryListener = (listenerMiddleware: ListenerMiddlewareInstance) => {
    listenerMiddleware.startListening({
        predicate: (action) =>
            !shouldIgnoreAction(action.type) && (isFulfilledAction(action.type) || isRejected(action)),
        effect: (action, listenerApi) => {
            const logEntryType = isRejected(action) ? 'error' : 'success';

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
};
