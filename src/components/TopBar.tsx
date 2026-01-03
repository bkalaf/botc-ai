//src/components/TopBar.tsx
// TopBar.tsx
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun } from 'lucide-react';

export function TopBar() {
    return (
        <header className='sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-3'>
            <SidebarTrigger />

            <Separator
                orientation='vertical'
                className='h-6'
            />

            <div className='flex flex-1 items-center'>
                <div className='text-sm font-semibold'>Game</div>
            </div>

            <div className='flex items-center gap-2'>
                <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Toggle theme'
                >
                    <Sun className='h-4 w-4' />
                </Button>
            </div>
        </header>
    );
}
