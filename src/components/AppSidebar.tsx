// src/components/AppSidebar.tsx
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { SidebarBrandToggle } from './sidebar/SidebarBrandToggle';
import { SidebarMenuLinks } from './sidebar/SidebarMenuLinks';

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='flex h-14 items-center justify-center px-3'>
                <SidebarBrandToggle />
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenuLinks />
            </SidebarContent>
        </Sidebar>
    );
}
