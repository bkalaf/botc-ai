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
import { Home, Users, Settings } from 'lucide-react';

function SidebarBrandToggle() {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            type='button'
            onClick={toggleSidebar}
            className='flex items-center gap-2 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-ring'
            aria-label='Toggle sidebar'
        >
            <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq-O8uTV06F2xMayi91pOGQIgzFVLiMIDoIw&s'
                alt=''
                className='h-8 w-8 rounded-md object-cover'
                aria-hidden='true'
            />
            {/* Optional: show text only when expanded (if you want) */}
            {/* <span className="text-sm font-semibold">BOTC AI</span> */}
        </button>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='flex h-14 items-center justify-center px-3'>
                <SidebarBrandToggle />
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip='Home'
                        >
                            <Link to='/'>
                                <Home className='h-4 w-4' />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip='Players'
                        >
                            <Link to='/'>
                                <Users className='h-4 w-4' />
                                <span>Players</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip='Settings'
                        >
                            <Link to='/'>
                                <Settings className='h-4 w-4' />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
