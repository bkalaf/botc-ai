// src/components/TopBar.tsx
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Menu, Settings } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import editions from '@/data/editions.json';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectShowFirstNightOrder,
    selectShowNightOrder,
    selectShowOtherNightOrder,
    setShowFirstNightOrder,
    setShowNightOrder,
    setShowOtherNightOrder
} from '@/store/settings/settings-slice';

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
    const dispatch = useAppDispatch();
    const showNightOrder = useAppSelector(selectShowNightOrder);
    const showFirstNightOrder = useAppSelector(selectShowFirstNightOrder);
    const showOtherNightOrder = useAppSelector(selectShowOtherNightOrder);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

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

                
            </div>
        </header>
    );
}

export function SettingsSubheader({ subheader }: { subheader: string }) {
    return <div className='border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                        {subheader}
                    </div>
}

export function SettingsDialog() {
    const dispatch = useAppDispatch();
    const showNightOrder = useAppSelector(selectShowNightOrder);
    const showFirstNightOrder = useAppSelector(selectShowFirstNightOrder);
    const showOtherNightOrder = useAppSelector(selectShowOtherNightOrder);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    return (
        <Dialog
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
        >
            <Button
                variant='ghost'
                className='h-9 px-3 gap-2'
                type='button'
                onClick={() => setIsSettingsOpen(true)}
            >
                <Settings className='h-4 w-4' />
                Settings (Preferences)
            </Button>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Preferences</DialogTitle>
                    <DialogDescription>Adjust game UI visibility settings.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    <SettingsSubheader subheader='Night order badges' />
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show night order badges</div>
                            <div className='text-xs text-muted-foreground'>Toggle all night order indicators.</div>
                        </div>
                        <Switch
                            checked={showNightOrder}
                            onCheckedChange={(value) => dispatch(setShowNightOrder(value))}
                        />
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show first-night order</div>
                            <div className='text-xs text-muted-foreground'>Show the blue first-night badges.</div>
                        </div>
                        <Switch
                            checked={showFirstNightOrder}
                            onCheckedChange={(value) => dispatch(setShowFirstNightOrder(value))}
                        />
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show other-night order</div>
                            <div className='text-xs text-muted-foreground'>Show the red other-night badges.</div>
                        </div>
                        <Switch
                            checked={showOtherNightOrder}
                            onCheckedChange={(value) => dispatch(setShowOtherNightOrder(value))}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}