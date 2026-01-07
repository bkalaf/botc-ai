// src/components/HistoryPanel.tsx
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectHistoryEntries } from '@/store/history/history-slice';
import { selectShowHistoryExpanded } from '@/store/settings/settings-slice';

const logEntryTypeStyles: Record<string, string> = {
    success: 'text-emerald-300',
    error: 'text-red-300',
    info: 'text-sky-200',
    debug: 'text-slate-300'
};

export function HistoryPanel() {
    const entries = useAppSelector(selectHistoryEntries);
    const isExpanded = useAppSelector(selectShowHistoryExpanded);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const renderedEntries = useMemo(
        () =>
            entries.map((entry) => (
                <div
                    key={entry.id}
                    className='space-y-1 border-b border-neutral-800 pb-2 last:border-b-0'
                >
                    <div className='flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-neutral-400'>
                        <span className={cn('font-semibold', logEntryTypeStyles[entry.logEntryType])}>
                            {entry.logEntryType}
                        </span>
                        <span className='text-neutral-500'>{entry.scope}</span>
                        {entry.actionType ?
                            <span className='text-neutral-500'>{entry.actionType}</span>
                        :   null}
                    </div>
                    <div className='text-sm text-neutral-100'>{entry.message}</div>
                    {entry.reasoning ?
                        <div className='text-xs text-neutral-300'>Reasoning: {entry.reasoning}</div>
                    :   null}
                </div>
            )),
        [entries]
    );

    useEffect(() => {
        if (!isExpanded) {
            return;
        }

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries.length, isExpanded]);

    if (!isExpanded) {
        return null;
    }

    return (
        <div className='absolute bottom-full right-0 z-50 mb-2 w-[min(26rem,85vw)] overflow-hidden rounded-lg border border-neutral-800 bg-black shadow-lg'>
            <div className='flex items-center justify-between border-b border-neutral-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-300'>
                <span>History</span>
            </div>
            <div
                ref={scrollRef}
                className='max-h-[40vh] space-y-3 overflow-y-auto px-3 py-2 text-xs'
            >
                {renderedEntries.length > 0 ?
                    renderedEntries
                :   <div className='text-sm text-neutral-400'>No history entries yet.</div>}
            </div>
        </div>
    );
}
