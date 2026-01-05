import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type GameOverlayProps = {
    open: boolean;
    title: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    className?: string;
    contentClassName?: string;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
};

export function GameOverlay({
    open,
    title,
    description,
    imageSrc,
    imageAlt,
    className,
    contentClassName,
    onOpenChange,
    children
}: GameOverlayProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                showCloseButton={false}
                className={cn('border-none bg-slate-950/90 p-0 text-white shadow-2xl sm:max-w-[680px]', className)}
            >
                <div className='relative overflow-hidden rounded-lg'>
                    {imageSrc ?
                        <img
                            src={imageSrc}
                            alt={imageAlt ?? title}
                            className='absolute inset-0 h-full w-full object-cover opacity-60'
                            draggable={false}
                        />
                    :   null}
                    <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950' />
                    <div className={cn('relative z-10 flex flex-col gap-6 px-8 py-10', contentClassName)}>
                        <DialogHeader className='text-center'>
                            <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                {title}
                            </DialogTitle>
                            {description ?
                                <DialogDescription className='text-base text-slate-200'>
                                    {description}
                                </DialogDescription>
                            :   null}
                        </DialogHeader>
                        {children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
