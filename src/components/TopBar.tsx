// src/components/TopBar.tsx
import { SidebarTrigger } from './ui/sidebar';
import { TopBarMobileMenu } from '@/components/top-bar/TopBarMobileMenu';
import { TopBarBreadcrumbs } from '@/components/top-bar/TopBarBreadcrumbs';
import { TopBarScriptsMenu } from '@/components/top-bar/TopBarScriptsMenu';
import { SetupGameDialog } from './SetupGameDialog';
import { TopBarPreferencesDialog } from '@/components/top-bar/TopBarPreferencesDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@radix-ui/react-switch';
import { Settings } from 'lucide-react';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    selectShowNightOrder,
    selectShowFirstNightOrder,
    selectShowOtherNightOrder,
    selectShowHistoryExpanded,
    setHistoryExpanded,
    setShowNightOrder,
    setShowFirstNightOrder,
    setShowOtherNightOrder
} from '../store/settings/settings-slice';
import { Button } from './ui/button';

export function TopBar() {
    return (
        <header className='sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-3'>
            <div className='hidden md:flex'>
                <SidebarTrigger />
            </div>
            <TopBarMobileMenu />
            <TopBarBreadcrumbs />
            <div className='ml-auto flex items-center gap-2'>
                <SetupGameDialog />
                <TopBarScriptsMenu />
                <TopBarPreferencesDialog />
            </div>
        </header>
    );
}

export function SettingsSubheader({ subheader }: { subheader: string }) {
    return (
        <div className='border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            {subheader}
        </div>
    );
}

export function SettingsDialog() {
    const dispatch = useAppDispatch();
    const showNightOrder = useAppSelector(selectShowNightOrder);
    const showFirstNightOrder = useAppSelector(selectShowFirstNightOrder);
    const showOtherNightOrder = useAppSelector(selectShowOtherNightOrder);
    const showHistoryExpanded = useAppSelector(selectShowHistoryExpanded);
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
                    <SettingsSubheader subheader='History' />
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show history</div>
                        </div>
                        <Switch
                            checked={showHistoryExpanded}
                            onCheckedChange={(value) => dispatch(setHistoryExpanded(value))}
                        />
                    </div>
                    <SettingsSubheader subheader='Night order badges' />
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show night order badges</div>
                            <div className='text-xs text-muted-foreground'>Toggle all night order indicators.</div>
                        </div>
                        <Switch
                            checked={showNightOrder}
                            onCheckedChange={(value) => {
                                dispatch(setShowNightOrder(value));
                                dispatch(setShowFirstNightOrder(value));
                                dispatch(setShowOtherNightOrder(value));
                            }}
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
