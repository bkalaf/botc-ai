// src/components/TownSquare.tsx
import * as React from 'react';
import { Roles } from '../data/types';
import { selectScript } from '../store/game/game-slice';
import { ISeatedPlayer } from '../store/types/player-types';
import { useAppSelector } from '@/store/hooks';
import { buildNightOrderIndex } from '../utils/nightOrder';
import { CircleGrimoire } from './CircleGrimoire';

type GrimoireShape = 'circle' | 'square' | 'rectangle';

const defaultViewSettings = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    topOffset: 0,
    ringOffset: 0,
    stretch: 1,
    tension: 0,
    tokenScale: 1,
    grimoireShape: 'circle' as GrimoireShape
};

const grimoireLayouts: Record<Exclude<GrimoireShape, 'circle'>, { maxColumns: number; rowPattern: number[] }> = {
    square: { maxColumns: 6, rowPattern: [6, 4, 6, 4] },
    rectangle: { maxColumns: 7, rowPattern: [7, 3, 7, 3] }
};

export function TownSquare({ players }: { players: ISeatedPlayer[] }) {
    const script = useAppSelector(selectScript);
    const inPlayRoles = React.useMemo(
        () => players.map((player) => player.role).filter((role): role is Roles => Boolean(role)),
        [players]
    );
    const activeRoles = React.useMemo(() => {
        const merged = [...script, ...inPlayRoles];
        return Array.from(new Set(merged));
    }, [script, inPlayRoles]);
    const nightOrderIndex = React.useMemo(
        () => ({
            first: buildNightOrderIndex(activeRoles, 'firstNight'),
            other: buildNightOrderIndex(activeRoles, 'otherNight')
        }),
        [activeRoles]
    );

    return (
        <CircleGrimoire
            players={players}
            nightOrderIndex={nightOrderIndex}
        />
    );
}
