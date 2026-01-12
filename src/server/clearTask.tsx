// src/server/clearTask.tsx
import { AppDispatch } from '../store';
import { runTasks, setAwaitingHumanTaskId } from '../store/st-queue/st-queue-slice';
import { closeDialog } from '../store/ui/ui-slice';

export function clearTask(dispatch: AppDispatch) {
    dispatch(closeDialog());
    dispatch(setAwaitingHumanTaskId(null));
    dispatch(runTasks());
}
