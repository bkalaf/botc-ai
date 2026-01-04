// src/components/BottomBar.tsx
export function BottomBar({ className }: { className: string }) {
    const $cn = [className, 'border-t bg-background'].join(' ');
    return (
        <nav className={$cn}>
            <div className='mx-auto flex h-14 max-w-screen-sm items-center justify-around px-2'>{/* buttons */}</div>
        </nav>
    );
}
