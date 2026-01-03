//src/components/AppShell.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset className='min-h-svh'>
                <TopBar />
                <main className='p-4'>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
