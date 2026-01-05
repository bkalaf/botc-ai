// src/components/FirstNightOrderBadge.tsx

import { NightOrderBadge } from './NightOrderBadge';

export const FirstNightOrderBadge = ({ order, reminder }: { order: number; reminder: string }) => (
    <NightOrderBadge
        order={order}
        reminder={reminder}
        bgColor='bg-blue-500'
        side='left-0 -translate-x-1/2 -translate-y-1/2'
        headerBgColor='bg-blue-500'
        nightHeaderText='First Night'
    />
);
