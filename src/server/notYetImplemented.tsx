// src/server/notYetImplemented.tsx
import z from 'zod';
import { InputSchema } from '../prompts/prompt-types';
import { RootState, AppDispatch } from '../store';
import { clearTask } from './clearTask';

export function notYetImplemented(state: RootState, dispatch: AppDispatch) {
    return async ({ data }: { data: z.infer<typeof InputSchema> }) => {
        clearTask(dispatch);
        throw new Error(`not yet implemented`);
    };
}
