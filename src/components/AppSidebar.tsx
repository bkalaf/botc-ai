// src/components/AppSidebar.tsx
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { SidebarBrandToggle } from '@/components/sidebar/SidebarBrandToggle';
import { SidebarMenuLinks } from '@/components/sidebar/SidebarMenuLinks';

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
