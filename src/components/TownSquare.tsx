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

type ViewSettings = {
    zoom: number;
    offsetX: number;
    offsetY: number;
    topOffset: number;
    ringOffset: number;
    stretch: number;
    tension: number;
    tokenScale: number;
};

type SeatPosition = {
    x: number;
    y: number;
    reminderSlots: Array<{ x: number; y: number }>;
    reminderTokenSize: number;
};

const buildReminderSlots = ({
    tokenCenterX,
    tokenCenterY,
    outwardX,
    outwardY,
    tokenSize,
    reminderTokenSize,
    reminderSlotsPerPlayer
}: {
    tokenCenterX: number;
    tokenCenterY: number;
    outwardX: number;
    outwardY: number;
    tokenSize: number;
    reminderTokenSize: number;
    reminderSlotsPerPlayer: number;
}) => {
    const length = Math.hypot(outwardX, outwardY) || 1;
    const unitX = outwardX / length;
    const unitY = outwardY / length;
    const reminderStart = tokenSize / 2 + reminderTokenSize * 0.6;
    const reminderSpacing = reminderTokenSize * 0.9;
    return Array.from({ length: reminderSlotsPerPlayer }, (_, slotIndex) => {
        const distance = reminderStart + slotIndex * reminderSpacing;
        return {
            x: tokenCenterX + unitX * distance - reminderTokenSize / 2,
            y: tokenCenterY + unitY * distance - reminderTokenSize / 2
        };
    });
};

const getCircleSeatPositions = ({
    count,
    centerX,
    centerY,
    radiusX,
    radiusY,
    tokenSize,
    ringOffset,
    tension,
    reminderSlotsPerPlayer
}: {
    count: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    tokenSize: number;
    ringOffset: number;
    tension: number;
    reminderSlotsPerPlayer: number;
}): SeatPosition[] => {
    const reminderTokenSize = clamp(tokenSize * 0.35, 18, 52);
    const ringRx = radiusX - tokenSize * 0.55 + ringOffset;
    const ringRy = radiusY - tokenSize * 0.55 + ringOffset;

    return Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
        const cornerBoost = 1 + tension * Math.pow(Math.abs(Math.sin(2 * angle)), 2);
        const x = centerX + ringRx * cornerBoost * Math.cos(angle) - tokenSize / 2;
        const y = centerY + ringRy * cornerBoost * Math.sin(angle) - tokenSize / 2;
        const tokenCenterX = x + tokenSize / 2;
        const tokenCenterY = y + tokenSize / 2;
        const reminderSlots = buildReminderSlots({
            tokenCenterX,
            tokenCenterY,
            outwardX: tokenCenterX - centerX,
            outwardY: tokenCenterY - centerY,
            tokenSize,
            reminderTokenSize,
            reminderSlotsPerPlayer
        });
        return {
            x,
            y,
            reminderSlots,
            reminderTokenSize
        };
    });
};

const getSquareSeatPositions = ({
    count,
    centerX,
    centerY,
    radiusX,
    radiusY,
    tokenSize,
    ringOffset,
    reminderSlotsPerPlayer
}: {
    count: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    tokenSize: number;
    ringOffset: number;
    reminderSlotsPerPlayer: number;
}): SeatPosition[] => {
    const reminderTokenSize = clamp(tokenSize * 0.35, 18, 52);
    const ringHalfWidth = Math.max(tokenSize * 0.6, radiusX - tokenSize * 0.55 + ringOffset);
    const ringHalfHeight = Math.max(tokenSize * 0.6, radiusY - tokenSize * 0.55 + ringOffset);
    const leftX = centerX - ringHalfWidth;
    const rightX = centerX + ringHalfWidth;
    const topY = centerY - ringHalfHeight;
    const bottomY = centerY + ringHalfHeight;
    const topCount = 6;
    const bottomCount = 6;
    const sideCount = 4;
    const topStep = topCount > 1 ? (rightX - leftX) / (topCount - 1) : 0;
    const sideStep = (bottomY - topY) / (sideCount + 1);

    const topSeats = Array.from({ length: topCount }, (_, index) => ({
        x: leftX + index * topStep,
        y: topY,
        outward: { x: 0, y: -1 }
    }));

    const rightSeats = Array.from({ length: sideCount }, (_, index) => ({
        x: rightX,
        y: topY + sideStep * (index + 1),
        outward: { x: 1, y: 0 }
    }));

    const bottomSeats = Array.from({ length: bottomCount }, (_, index) => ({
        x: leftX + index * topStep,
        y: bottomY,
        outward: { x: 0, y: 1 }
    }));

    const leftSeats = Array.from({ length: sideCount }, (_, index) => ({
        x: leftX,
        y: topY + sideStep * (index + 1),
        outward: { x: -1, y: 0 }
    }));

    const orderedSeats = [
        ...topSeats,
        ...rightSeats,
        ...bottomSeats.slice().reverse(),
        ...leftSeats.slice().reverse()
    ];

    return orderedSeats.slice(0, count).map((seat) => {
        const x = seat.x - tokenSize / 2;
        const y = seat.y - tokenSize / 2;
        const reminderSlots = buildReminderSlots({
            tokenCenterX: seat.x,
            tokenCenterY: seat.y,
            outwardX: seat.outward.x,
            outwardY: seat.outward.y,
            tokenSize,
            reminderTokenSize,
            reminderSlotsPerPlayer
        });
        return {
            x,
            y,
            reminderSlots,
            reminderTokenSize
        };
    });
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
