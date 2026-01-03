// src/components/BottomBar.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Users, Timer, Settings } from 'lucide-react';

type Item = {
    label: string;
    icon: React.ReactNode;
    href: string;
};

const items: Item[] = [
    { label: 'Home', icon: <Home className='h-5 w-5' />, href: '/home' },
    { label: 'Players', icon: <Users className='h-5 w-5' />, href: '/players' },
    { label: 'Timer', icon: <Timer className='h-5 w-5' />, href: '/timer' },
    { label: 'Settings', icon: <Settings className='h-5 w-5' />, href: '/settings' }
];

export function BottomBar({ activeHref }: { activeHref: string }) {
    return (
        <nav
            className={cn('fixed inset-x-0 bottom-0 z-50 border-t bg-background', 'pb-[env(safe-area-inset-bottom)]')}
            aria-label='Bottom navigation'
        >
            <div className='mx-auto flex h-14 max-w-screen-sm items-center justify-around px-2'>
                {items.map((item) => {
                    const active = item.href === activeHref;
                    return (
                        <Button
                            key={item.href}
                            variant={active ? 'secondary' : 'ghost'}
                            size='sm'
                            className='h-10 flex-1 gap-2'
                            asChild
                        >
                            <a
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                            >
                                {item.icon}
                                <span className='text-xs'>{item.label}</span>
                            </a>
                        </Button>
                    );
                })}
            </div>
        </nav>
    );
}
