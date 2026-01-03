// src/components/BottomBar.tsx
export function BottomBar({ activeHref }: { activeHref: string }) {
    return (
        <nav className='border-t bg-background'>
            <div className='mx-auto flex h-14 max-w-screen-sm items-center justify-around px-2'>{/* buttons */}</div>
        </nav>
    );
}
