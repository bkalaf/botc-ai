// src/components/TopBar.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

function SidebarNav() {
    return (
        <nav className='space-y-2'>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/home'
            >
                Home
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/players'
            >
                Players
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/settings'
            >
                Settings
            </a>
        </nav>
    );
}

export function TopBar() {
    return (
        <header className='sticky top-0 z-40 flex h-14 items-center border-b bg-background px-3'>
            <div className='hidden md:flex'>
                <SidebarTrigger />
            </div>
            <div className='md:hidden'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Open menu'
                        >
                            <Menu className='h-5 w-5' />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side='left'
                        className='w-72'
                    >
                        <div className='mb-4 text-sm font-semibold'>BOTC AI</div>
                        <SidebarNav />
                    </SheetContent>
                </Sheet>
            </div>

            <div className='ml-2 text-sm font-semibold'>Game</div>
        </header>
    );
}
