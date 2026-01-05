// src/components/NightOrderBadge.tsx
import { Badge } from './ui/badge'  ;
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';

export function NightOrderBadge({
    order,
    bgColor,
    reminder,
        'flex shrink-0 text-vertical text-3xl uppercase font-extrabold text-white p-2 rounded-lg border-2 border-black whitespace-pre text-center items-center justify-center',
            <TooltipContent className='p-2'>
                <div className='flex flex-row items-stretch gap-2'>
                    <Label className='flex max-w-[260px] items-center bg-slate-700 px-2 py-1 text-left text-sm leading-snug text-white whitespace-normal rounded-lg'>
    reminder: string;
    order: number;
}) {
    const className = [
        'absolute top-1/2 min-w-6 h-6 z-20 transform   text-white font-extrabold text-lg group-data-[is-dead=true]:invisible data-[order="0"]:invisible tabular-nums',
        bgColor,
        side
    ].join(' ');
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    className={className}
                    data-order={order}
                >
                    <span className='text-white text-base'>{order}</span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                <Label className='bg-slate-700 px-1.5 py-0.5 rounded-lg text-white text-lg text-wrap'>{reminder}</Label>
            </TooltipContent>
        </Tooltip>
    );
}
