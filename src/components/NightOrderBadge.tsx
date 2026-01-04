// src/components/NightOrderBadge.tsx
import { Badge } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
        'absolute  top-1/2 min-w-6 h-6 z-40 transform   text-white font-extrabold text-lg group-data-[is-alive=false]:invisible data-[order="0"]:invisible tabular-nums',
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
                    {order}
                </Badge>
            </TooltipTrigger>
            <TooltipContent>{reminder}</TooltipContent>
        </Tooltip>
    );
}
