// src/components/OtherNightOrderBadge.tsx
import { NightOrderBadge } from './NightOrderBadge';

export const OtherNightOrderBadge = ({ order, reminder }: { order: number; reminder: string }) => (
    <NightOrderBadge
        order={order}
        reminder={reminder}
        bgColor='bg-red-500'
        side='right-0 translate-x-1/2 -translate-y-1/2'
        headerBgColor='bg-red-500'
        nightHeaderText='Other Nights'
    />
);
