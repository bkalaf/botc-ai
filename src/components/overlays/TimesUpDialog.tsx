// src/components/overlays/TimesUpDialog.tsx
import clockImg from '@/assets/images/town/clock-big.png';
import { cn } from '../../lib/utils';
import {
    DialogHeader,
    DialogFooter,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideTimesUpDialog, selectTimesUpDialog, toggleTimesUpDialog } from '../../store/ui/ui-slice';
import { useCallback, useEffect, useRef } from 'react';
import { runTasks } from '../../store/st-queue/st-queue-slice';

type TimesUpDialogProps = {
    resolve?: (value?: any) => void;
    reject?: (reason?: any) => void;
};

export function TimesUpDialog({ resolve }: TimesUpDialogProps) {
    const open = useAppSelector(selectTimesUpDialog);
    const dispatch = useAppDispatch();
    const resolvedRef = useRef(false);
    const prevOpenRef = useRef(open);

    const resolveOnce = useCallback(() => {
        if (!resolvedRef.current) {
            resolve?.();
            resolvedRef.current = true;
        }
    }, [resolve]);

    useEffect(() => {
        if (open) {
            resolvedRef.current = false;
        } else if (prevOpenRef.current) {
            resolveOnce();
        }
        prevOpenRef.current = open;
    }, [open, resolveOnce]);
    const onOpenChange = useCallback(
        (isOpen: boolean) => {
            dispatch(toggleTimesUpDialog(isOpen));
            dispatch(runTasks());
        },
        [dispatch]
    );
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger />
            <DialogContent
                showCloseButton={false}
                className={cn('border-none bg-slate-950/90 p-0 text-white shadow-2xl sm:max-w-[680px]', '')}
            >
                <div className='relative overflow-hidden rounded-lg'>
                    <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950' />
                    <div
                        className={cn('relative z-10 flex flex-col gap-6 px-8 py-10')}
                    >
                        <DialogHeader className='text-center'>
                            <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                Times up!
                            </DialogTitle>
                            <DialogDescription className='text-base text-slate-200'>Alarm is up.</DialogDescription>
                        </DialogHeader>
                        <img
                            src={clockImg}
                            alt='Night falls'
                            className='absolute inset-0 h-full w-full object-cover opacity-60'
                            draggable={false}
                        />
                        <DialogFooter>
                            <DialogClose>
                                <Button
                                    onClick={() => {
                                        dispatch(hideTimesUpDialog());
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
