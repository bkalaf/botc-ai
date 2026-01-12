// src/components/overlays/NightFallsDialog.tsx
import nightFallsImg from '@/assets/images/night-falls.jpg';
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
import { hideNightBreakDialog, selectNightBreakDialog, toggleNightBreakDialog } from '../../store/ui/ui-slice';
import { useCallback } from 'react';
import { setUnpause } from '../../store/st-queue/st-queue-slice';

export function NightFallsDialog() {
    const open = useAppSelector(selectNightBreakDialog);
    const dispatch = useAppDispatch();
    const onOpenChange = useCallback(
        (isOpen: boolean) => {
            dispatch(toggleNightBreakDialog(isOpen));
            dispatch(setUnpause());
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
                        className={cn(
                            'relative z-10 flex flex-col gap-6 px-8 py-10',
                            'request?.options?.contentClassName'
                        )}
                    >
                        <DialogHeader className='text-center'>
                            <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                Night falls
                            </DialogTitle>
                            <DialogDescription className='text-base text-slate-200'>
                                Close your eyes. The night phase has begun.
                            </DialogDescription>
                        </DialogHeader>
                        <img
                            src={nightFallsImg}
                            alt='Night falls'
                            className='absolute inset-0 h-full w-full object-cover opacity-60'
                            draggable={false}
                        />
                        <DialogFooter>
                            <DialogClose
                                onClick={() => {
                                    onOpenChange(false);
                                }}
                            >
                                Cancel
                            </DialogClose>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
