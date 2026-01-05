// src/components/BottomBar.tsx
import { CogIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useViewControls } from './ViewControlsContext';

export function BottomBar({ className }: { className: string }) {
    const $cn = [className, 'border-t bg-background'].join(' ');
    const { isViewControlsOpen, toggleViewControls } = useViewControls();
    return (
        <nav
            className={$cn}
            data-bottom-bar
        >
            <div className='mx-auto flex min-h-14 max-w-screen-sm items-center justify-between gap-4 px-4 py-3 text-sm font-semibold'>
                <div className='flex flex-1 items-center justify-start'>Chat</div>
                <div className='flex flex-1 items-center justify-center'>
                    <Button
                        size='sm'
                        variant={isViewControlsOpen ? 'default' : 'outline'}
                        type='button'
                        onClick={toggleViewControls}
                        className={cn(
                            'gap-2 text-[11px] font-semibold uppercase tracking-wide',
                            isViewControlsOpen ?
                                'bg-blue-700 text-white hover:bg-blue-600'
                            :   'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-blue-400 focus-visible:outline-offset-2'
                        )}
                    >
                        <CogIcon className='h-4 w-4' />
                        View Controls
                    </Button>
                </div>
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
