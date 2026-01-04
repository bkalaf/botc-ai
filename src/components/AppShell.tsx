// src/components/AppShell.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />

            {/* The ONLY place that touches viewport height */}
            <SidebarInset className='h-svh'>
                {/* Chrome + content column */}
                <div className='flex h-full flex-col overflow-hidden p-0'>
                    <TopBar />

                    {/* This is the remaining usable space */}
                    <main className='min-h-0 flex-1 overflow-hidden'>{children}</main>

                    <BottomBar className='bottom-0"' />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
