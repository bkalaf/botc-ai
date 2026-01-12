// src/lib/dialogs.ts
import type { AppDispatch } from '@/store';
import type { DialogDataMap, DialogResult, DialogType } from '@/store/types/ui-types';
import { showDialog } from '@/store/ui/ui-slice';

type OpenDialogArgs<T extends DialogType> = {
    dispatch: AppDispatch;
    dialogType: T;
    data: DialogDataMap[T];
};

export function openDialog<T extends DialogType>({ dispatch, dialogType, data }: OpenDialogArgs<T>) {
    return new Promise<DialogResult>((resolve, reject) => {
        dispatch(
            showDialog({
                options: { dialogType },
                data,
                resolve,
                reject: (reason) => {
                    console.log(reason);
                    reject(reason);
                }
            })
        );
    });
}
