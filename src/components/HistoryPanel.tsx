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
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null);
    const [bottomOffset, setBottomOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

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
        if (collapsed) {
            return;
        }

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries.length, collapsed]);

    useEffect(() => {
        if (panelPosition || !panelRef.current || typeof window === 'undefined') {
            return;
        }

        const updateBottomOffset = () => {
            const bottomBar = document.querySelector('[data-bottom-bar]');
            const barHeight = bottomBar ? bottomBar.getBoundingClientRect().height : 0;
            setBottomOffset(barHeight + 8);
        };

        updateBottomOffset();
        window.addEventListener('resize', updateBottomOffset);

        return () => {
            window.removeEventListener('resize', updateBottomOffset);
        };
    }, [panelPosition]);

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        const handleMove = (event: PointerEvent) => {
            const deltaX = event.clientX - dragStartRef.current.startX;
            const deltaY = event.clientY - dragStartRef.current.startY;
            const rect = panelRef.current?.getBoundingClientRect();
            const maxX = window.innerWidth - (rect?.width ?? 0) - 8;
            const maxY = window.innerHeight - (rect?.height ?? 0) - 8;
            const nextX = Math.min(Math.max(8, dragStartRef.current.x + deltaX), Math.max(8, maxX));
            const nextY = Math.min(Math.max(8, dragStartRef.current.y + deltaY), Math.max(8, maxY));
            setPanelPosition({ x: nextX, y: nextY });
        };

        const handleUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={panelRef}
            className={cn(
                'fixed z-50 flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-black shadow-lg',
                panelPosition ? null : 'right-4',
                collapsed ?
                    'h-8 w-[25vw] min-w-[220px] min-h-[32px] resize'
                :   'h-[33vh] w-[25vw] min-w-[220px] min-h-[160px] resize'
            )}
            style={
                panelPosition ? { left: panelPosition.x, top: panelPosition.y } : { bottom: Math.max(0, bottomOffset) }
            }
        >
            <div
                className='flex select-none items-center gap-2 border-b border-neutral-800 px-3 py-2 text-xs uppercase tracking-wide text-neutral-200'
                onPointerDown={(event) => {
                    if (!panelRef.current || !event.ctrlKey) {
                        return;
                    }
                    const rect = panelRef.current.getBoundingClientRect();
                    dragStartRef.current = {
                        x: panelPosition?.x ?? rect.left,
                        y: panelPosition?.y ?? rect.top,
                        startX: event.clientX,
                        startY: event.clientY
                    };
                    if (!panelPosition) {
                        setPanelPosition({ x: rect.left, y: rect.top });
                    }
                    setIsDragging(true);
                }}
                style={{ touchAction: 'none' }}
            >
                <span>History</span>
                <span className='text-[10px] font-normal normal-case text-neutral-500'>Hold Ctrl to drag</span>
                <button
                    type='button'
                    className='ml-auto text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white'
                    onClick={() => setCollapsed((prev) => !prev)}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    {collapsed ? 'Expand' : 'Collapse'}
                </button>
            </div>
            <div
                ref={scrollRef}
                className={cn('flex-1 space-y-3 overflow-y-auto px-3 py-2 text-xs', collapsed && 'hidden')}
            >
                {renderedEntries.length > 0 ?
                    renderedEntries
                :   <div className='text-sm text-neutral-400'>No history entries yet.</div>}
            </div>
        </div>
    );
}
