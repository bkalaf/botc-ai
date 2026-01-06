// src/components/AppSidebar.tsx
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { BookOpen, Clock, ClipboardList, History, Home, Settings, Users } from 'lucide-react';

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
