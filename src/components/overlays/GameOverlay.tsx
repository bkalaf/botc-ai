// src/components/overlays/GameOverlay.tsx
import * as React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeDialog, selectRequest } from '../../store/ui/ui-slice';

// type GameOverlayProps = {
//     open: boolean;
//     imageSrc?: string;
//     imageAlt?: string;
//     className?: string;
//     contentClassName?: string;
//     onOpenChange?: (open: boolean) => void;
//     title?: string;
//     description?: string;
//     children?: Children;
// };

export function GameOverlay() {
    const dispatch = useAppDispatch();
    const request = useAppSelector(selectRequest);
    const open = Boolean(request);
    const handleConfirm = React.useCallback(
        (value: any) => {
            request?.resolve({ confirmed: true, value });
            dispatch(closeDialog());
        },
        [dispatch, request]
    );
    const handleCancel = () => {
        request?.resolve({ confirmed: false, value: undefined });
        dispatch(closeDialog());
    };
    const onSubmit = React.useCallback(
        (ev: React.FormEvent) => {
            ev.preventDefault();
            const formdata = new FormData(ev.currentTarget as HTMLFormElement);
            const data = Object.fromEntries(formdata.entries());
            console.log(data);
            handleConfirm(data);
        },
        [handleConfirm]
    );
    const onOpenChange = React.useCallback(
        (isOpen: boolean) => {
            if (isOpen) {
                dispatch(closeDialog());
            }
        },
        [dispatch]
    );
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <form onSubmit={onSubmit}>
                <DialogTrigger />
                <DialogContent
                    showCloseButton={false}
                    className={cn(
                        'border-none bg-slate-950/90 p-0 text-white shadow-2xl sm:max-w-[680px]',
                        request?.options?.className
                    )}
                >
                    <div className='relative overflow-hidden rounded-lg'>
                        {/* {imageSrc ?
                            <img
                                src={imageSrc}
                                alt={imageAlt ?? title}
                                className='absolute inset-0 h-full w-full object-cover opacity-60'
                                draggable={false}
                            />
                        :   null} */}
                        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950' />
                        <div
                            className={cn(
                                'relative z-10 flex flex-col gap-6 px-8 py-10',
                                request?.options?.contentClassName
                            )}
                        >
                            <DialogHeader className='text-center'>
                                <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                    {request?.options?.title}
                                </DialogTitle>
                                <DialogDescription className='text-base text-slate-200'>
                                    {request?.options?.message}
                                </DialogDescription>
                            </DialogHeader>
                            {request?.options?.Controls ?
                                <request.options.Controls />
                            :   null}
                            <DialogFooter>
                                <DialogClose>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                </DialogClose>
                                <Button type='submit'>Submit</Button>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    );
}
