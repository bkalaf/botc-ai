// src/components/BottomBar.tsx
export function BottomBar({ className }: { className: string }) {
    const $cn = [className, 'border-t bg-background'].join(' ');
    return (
        <nav className={$cn}>
            <div className='mx-auto flex h-14 max-w-screen-sm items-center justify-between gap-4 px-4 text-sm font-semibold'>
                <div className='flex flex-1 items-center justify-start'>Chat</div>
                <div className='flex flex-1 items-center justify-end'>Population</div>
            </div>
        </nav>
    );
}
