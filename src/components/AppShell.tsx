// src/components/AppShell.tsx
//src/components/AppShell.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset className='h-svh'>
                {/* This wrapper is the “chrome + content” column */}
                <div className='flex h-full flex-col overflow-hidden'>
                    <TopBar />

                    {/* THIS is the remaining space. min-h-0 is non-negotiable. */}
                    <main className='min-h-0 flex-1 overflow-hidden pb-14'>{children}</main>
                    <BottomBar className='fixed inset-x-0 bottom-0' />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
