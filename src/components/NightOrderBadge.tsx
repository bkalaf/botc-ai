// src/components/NightOrderBadge.tsx
import { Badge } from './ui/badge'  ;
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';

export function NightOrderBadge({
    order,
    bgColor,
    reminder,
    side
}: {
    side: string;
    bgColor: string;
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
