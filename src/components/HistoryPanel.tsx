// src/components/HistoryPanel.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectHistoryEntries } from '@/store/history/history-slice';

const logEntryTypeStyles: Record<string, string> = {
    success: 'text-emerald-300',
    error: 'text-red-300',
    info: 'text-sky-200',
    debug: 'text-slate-300'
};

export function HistoryPanel() {
    const entries = useAppSelector(selectHistoryEntries);
    const [collapsed, setCollapsed] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const renderedEntries = useMemo(
        () =>
            entries.map((entry) => (
                <div key={entry.id} className='space-y-1 border-b border-neutral-800 pb-2 last:border-b-0'>
                    <div className='flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-neutral-400'>
                        <span className={cn('font-semibold', logEntryTypeStyles[entry.logEntryType])}>
                            {entry.logEntryType}
                        </span>
                        <span className='text-neutral-500'>{entry.scope}</span>
                        {entry.actionType ? (
                            <span className='text-neutral-500'>{entry.actionType}</span>
                        ) : null}
                    </div>
                    <div className='text-sm text-neutral-100'>{entry.message}</div>
                    {entry.reasoning ? (
                        <div className='text-xs text-neutral-300'>Reasoning: {entry.reasoning}</div>
                    ) : null}
                </div>
            )),
        [entries]
    );

    useEffect(() => {
        if (collapsed) {
            return;
        }

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries.length, collapsed]);

    return (
        <div
            className={cn(
                'fixed right-4 z-50 flex flex-col rounded-lg border border-neutral-800 bg-black shadow-lg',
                collapsed
                    ? 'bottom-0 h-8 w-[25vw] min-w-[220px] resize-none'
                    : 'bottom-16 h-[33vh] w-[25vw] min-w-[220px] min-h-[160px] resize'
            )}
        >
            <div className='flex items-center justify-between border-b border-neutral-800 px-3 py-2 text-xs uppercase tracking-wide text-neutral-200'>
                <span>History</span>
                <button
                    type='button'
                    className='text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white'
                    onClick={() => setCollapsed((prev) => !prev)}
                >
                    {collapsed ? 'Expand' : 'Collapse'}
                </button>
            </div>
            <div
                ref={scrollRef}
                className={cn(
                    'flex-1 space-y-3 overflow-y-auto px-3 py-2 text-xs',
                    collapsed && 'hidden'
                )}
            >
                {renderedEntries.length > 0 ? (
                    renderedEntries
                ) : (
                    <div className='text-sm text-neutral-400'>No history entries yet.</div>
                )}
            </div>
        </div>
    );
}
