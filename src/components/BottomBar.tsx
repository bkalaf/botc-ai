// src/components/BottomBar.tsx
export function BottomBar({ className }: { className: string }) {
    const $cn = [className, 'border-t bg-background'].join(' ');
    return (
        <nav className={$cn}>
            <div className='mx-auto flex min-h-14 max-w-screen-sm items-center justify-between gap-4 px-4 py-3 text-sm font-semibold'>
                <div className='flex flex-1 items-center justify-start'>Chat</div>
                <div className='flex flex-1 items-center justify-end'>Population</div>
            </div>
            <div className='border-t border-border/60 bg-background/95'>
                <div className='mx-auto flex max-w-screen-sm flex-wrap items-center justify-center gap-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground'>
                    <span className='flex items-center gap-1.5'>
                        <span className='h-2 w-2 rounded-full bg-red-500' />
                        Demon / Evil
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <span className='h-2 w-2 rounded-full bg-blue-500' />
                        Townsfolk / Blue
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <span className='h-2 w-2 rounded-full bg-orange-500' />
                        Minions
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <span className='h-2 w-2 rounded-full bg-cyan-400' />
                        Outsiders
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <span className='h-2 w-2 rounded-full bg-yellow-400' />
                        Travelers + Misregisters (Recluse, Spy)
                    </span>
                </div>
            </div>
        </nav>
    );
}
