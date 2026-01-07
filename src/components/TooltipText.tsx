// src/components/TooltipText.tsx
export function TooltipText({ text, children }: { children?: Children; text: string }) {
    return (
        <div className='flex flex-row w-100 justify-start items-center bg-transparent rounded-lg'>
            {children}
            <p className='px-2.5 py-1.5 flex bg-slate-700 rounded-lg text-white text-base w-full whispace-normal'>
                {text}
            </p>
        </div>
    );
}
