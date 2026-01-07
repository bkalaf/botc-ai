// src/components/NightOrderBadge.tsx
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toProperCase } from '../utils/getWordsForNumber.ts/toProperCase';
import { useAppSelector } from '../store/hooks';
import { TooltipText } from './TooltipText';

export function NightOrderBadge({
    order,
    bgColor,
    reminder,
    side,
    headerBgColor,
    nightHeaderText,
    selector
}: {
    side: string;
    bgColor: string;
    reminder: string;
    order: number;
    headerBgColor: string;
    nightHeaderText: string;
    selector: (state: any) => boolean;
}) {
    const className = [
        'absolute top-1/2 min-w-6 h-6 z-15 transform   text-white font-extrabold text-lg group-data-[is-dead=true]:invisible data-[order="0"]:invisible tabular-nums',
        bgColor,
        side
    ].join(' ');
    const className2 = [
        'flex text-vertical text-xl uppercase font-extrabold text-white text-wrap p-2 rounded-lg border-2 border-black whitespace-pre text-center items-center justify-center items-stretch',
        headerBgColor
    ].join(' ');
    const value = useAppSelector(selector);

    return (
        value &&
        order > 0 && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        className={className}
                        data-order={order}
                    >
                        <span className='text-white text-base'>{order}</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className='bg-transparent'>
                    <TooltipText text={reminder}>
                        <span className={className2}>{toProperCase(nightHeaderText).replace(/ /g, '\n')}</span>
                    </TooltipText>
                </TooltipContent>
            </Tooltip>
        )
    );
}
