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

            <SidebarInset className='min-h-svh'>
                <TopBar />
                <main className='p-4 pb-14'>
                    {children}
                    <BottomBar activeHref='/' />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
