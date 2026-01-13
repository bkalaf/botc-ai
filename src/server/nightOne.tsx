// src/server/nightOne.tsx
import { openDialog } from '../lib/dialogs';
import { AppDispatch, RootState } from '../store';
import { runTasks, runFirstNight } from '../store/st-queue/st-queue-slice';

export function setupComplete(_: RootState, dispatch: AppDispatch) {
    return async () => {
        return new Promise<void>(($resolve, $reject) => {
            openDialog({
                dispatch,
                dialogType: 'setupComplete',
                data: {},
                resolve: async () => {
                    dispatch(runTasks());
                    dispatch(runFirstNight());
                    $resolve(undefined);
                }
            });
        });
    };
}

