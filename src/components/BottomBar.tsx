// src/components/BottomBar.tsx
import { BottomBarActions } from '@/components/bottom-bar/BottomBarActions';
import { BottomBarLegend } from '@/components/bottom-bar/BottomBarLegend';

export function BottomBar({ className }: { className: string }) {
    const $cn = [className, 'border-t bg-background overflow-visible'].join(' ');

    return (
        <nav
            className={$cn}
            data-bottom-bar
        >
            <BottomBarActions />
            <BottomBarLegend />
        </nav>
    );
}
