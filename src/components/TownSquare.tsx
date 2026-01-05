// src/components/TownSquare.tsx
import * as React from 'react';
import { Roles } from '../data/types';
import { selectScript } from '../store/game/game-slice';
import { ISeatedPlayer } from '../store/types/player-types';
import { useAppSelector } from '@/store/hooks';
import { buildNightOrderIndex } from '../utils/nightOrder';
import { CircleGrimoire } from './CircleGrimoire';

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
