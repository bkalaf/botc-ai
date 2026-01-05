// src/components/NightOrderBadge.tsx
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';
import { toProperCase } from '../utils/getWordsForNumber.ts/toProperCase';

export function NightOrderBadge({
    order,
    bgColor,
    reminder,
    side,
    headerBgColor,
    nightHeaderText
}: {
    side: string;
    bgColor: string;
    reminder: string;
    order: number;
    headerBgColor: string;
    nightHeaderText: string;
}) {
    const className = [
        'absolute top-1/2 min-w-6 h-6 z-20 transform   text-white font-extrabold text-lg group-data-[is-dead=true]:invisible data-[order="0"]:invisible tabular-nums',
        bgColor,
        side
    ].join(' ');
    const className2 = [
        'flex text-vertical text-3xl uppercase font-extrabold text-white text-wrap p-2 rounded-lg border-2 border-black whitespace-pre text-center items-center justify-center',
        headerBgColor
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
                <div className='flex flex-row justify-start max-w-1/5 min-h-fit'>
                    <span className={className2}>{toProperCase(nightHeaderText).replace(/ /g, '\n')}</span>
                    <Label className='flex bg-slate-700 px-1.5 py-0.5 rounded-lg text-white text-lg h-auto w-auto'>
                        {reminder}
                    </Label>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
