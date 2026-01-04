// src/components/TopBar.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import editions from '@/data/editions.json';

const popularScriptIds = ['tb', 'snv'];
const popularScripts = editions.filter((script) => popularScriptIds.includes(script.id));
const officialScripts = editions.filter((script) => script.isOfficial);

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
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/setup'
            >
                Setup
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/scripts'
            >
                Scripts
            </a>
        </nav>
    );
}

export function TopBar() {
    return (
        <header className='sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-3'>
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

            <div className='flex items-center gap-2 text-sm font-semibold'>
                <span>Game</span>
                <span className='text-muted-foreground'>/</span>
                <span>Setup</span>
            </div>

            <div className='ml-auto flex items-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            className='h-9 px-3'
                        >
                            Scripts
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align='end'
                        className='w-56'
                    >
                        <DropdownMenuLabel>Popular scripts</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            {popularScripts.map((script) => (
                                <DropdownMenuItem key={script.id}>
                                    {script.name}
                                    <DropdownMenuShortcut>Load to setup</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Official scripts</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            {officialScripts.map((script) => (
                                <DropdownMenuItem key={script.id}>
                                    {script.name}
                                    <DropdownMenuShortcut>Load to setup</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant='ghost'
                    className='h-9 px-3'
                >
                    Settings (Preferences)
                </Button>
            </div>
        </header>
    );
}
