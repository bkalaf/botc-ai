//src/components/AppSidebar.tsx
// AppSidebar.tsx
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from '@/components/ui/sidebar';

import { Home, Settings, Users } from 'lucide-react';

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='px-2 py-2'>
                <div className='px-2 text-sm font-semibold'>BOTC AI</div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Home'>
                            <Home className='h-4 w-4' />
                            <span>Home</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Players'>
                            <Users className='h-4 w-4' />
                            <span>Players</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Settings'>
                            <Settings className='h-4 w-4' />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className='p-2 text-xs text-muted-foreground'>v0.x</SidebarFooter>
        </Sidebar>
    );
}
