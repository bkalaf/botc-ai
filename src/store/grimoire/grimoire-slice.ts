// src/store/grimoire/grimoire-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGrimoireSlice, IReminderTokens } from '../game/game-slice';

type SeatCondition = {
    isDrunk: boolean;
    isPoisoned: boolean;
};

export interface IGrimoireState extends IGrimoireSlice {
    recalibrationQueue: number[];
}

const initialState: IGrimoireState = {
    seats: [],
    demonBluffs: undefined,
    outOfPlay: [],
    reminderTokens: {},
    recalibrationQueue: []
};

const isDrunkEffect = (tokenKey: string) => tokenKey.toLowerCase().includes('drunk');
const isPoisonedEffect = (tokenKey: string) => tokenKey.toLowerCase().includes('poisoned');

const getTokensByTarget = (tokens: Record<string, IReminderTokens>, target: number) =>
    Object.values(tokens).filter((token) => token.target === target);

const getTokensBySource = (tokens: Record<string, IReminderTokens>, source: number) =>
    Object.values(tokens).filter((token) => token.source === source);

const resolveSeatCondition = (
    tokens: Record<string, IReminderTokens>,
    seatId: number,
    cache: Map<number, SeatCondition>,
    visiting: Set<number>
): SeatCondition => {
    const cached = cache.get(seatId);
    if (cached) {
        return cached;
    }

    if (visiting.has(seatId)) {
        return { isDrunk: false, isPoisoned: false };
    }

    visiting.add(seatId);

    let isDrunk = false;
    let isPoisoned = false;

    for (const token of getTokensByTarget(tokens, seatId)) {
        if (token.isChanneled) {
            const sourceCondition = resolveSeatCondition(tokens, token.source, cache, visiting);
            if (sourceCondition.isDrunk || sourceCondition.isPoisoned) {
                continue;
            }
        }

        if (isDrunkEffect(token.key)) {
            isDrunk = true;
        }

        if (isPoisonedEffect(token.key)) {
            isPoisoned = true;
        }

        if (isDrunk && isPoisoned) {
            break;
        }
    }

    visiting.delete(seatId);
    const condition = { isDrunk, isPoisoned };
    cache.set(seatId, condition);
    return condition;
};

const createSeatConditionResolver = (tokens: Record<string, IReminderTokens>) => {
    const cache = new Map<number, SeatCondition>();
    return (seatId: number) => resolveSeatCondition(tokens, seatId, cache, new Set<number>());
};

const buildRecalibrationQueue = (
    previousTokens: Record<string, IReminderTokens>,
    nextTokens: Record<string, IReminderTokens>,
    startingTargets: number[]
) => {
    const queue = [...new Set(startingTargets)];
    const recalibrationQueue: number[] = [];
    const visited = new Set<number>();
    const resolvePrevious = createSeatConditionResolver(previousTokens);
    const resolveNext = createSeatConditionResolver(nextTokens);

    while (queue.length > 0) {
        const seatId = queue.shift();
        if (seatId == null || visited.has(seatId)) {
            continue;
        }

        visited.add(seatId);
        const previousStatus = resolvePrevious(seatId);
        const nextStatus = resolveNext(seatId);
        const statusChanged =
            previousStatus.isDrunk !== nextStatus.isDrunk ||
            previousStatus.isPoisoned !== nextStatus.isPoisoned;

        if (!statusChanged) {
            continue;
        }

        recalibrationQueue.push(seatId);

        for (const token of getTokensBySource(nextTokens, seatId)) {
            if (!token.isChanneled) {
                continue;
            }

            queue.push(token.target);
        }
    }

    return recalibrationQueue;
};

export const grimoireSlice = createSlice({
    name: 'grimoire',
    initialState,
    reducers: {
        addReminderToken: (state, action: PayloadAction<IReminderTokens>) => {
            const { key } = action.payload;
            const existing = state.reminderTokens[key];
            if (
                existing &&
                existing.source === action.payload.source &&
                existing.target === action.payload.target &&
                existing.isChanneled === action.payload.isChanneled
            ) {
                return;
            }

            const previousTokens = { ...state.reminderTokens };
            state.reminderTokens[key] = action.payload;

            const startingTargets = [
                existing?.target,
                action.payload.target
            ].filter((target): target is number => target != null);

            state.recalibrationQueue = buildRecalibrationQueue(
                previousTokens,
                state.reminderTokens,
                startingTargets
            );
        },
        removeReminderToken: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            const existing = state.reminderTokens[key];
            if (!existing) {
                return;
            }

            const previousTokens = { ...state.reminderTokens };
            delete state.reminderTokens[key];

            state.recalibrationQueue = buildRecalibrationQueue(
                previousTokens,
                state.reminderTokens,
                [existing.target]
            );
        },
        setSeats: (state, action: PayloadAction<IGrimoireSlice['seats']>) => {
            state.seats = action.payload;
        },
        setOutOfPlay: (state, action: PayloadAction<IGrimoireSlice['outOfPlay']>) => {
            state.outOfPlay = action.payload;
        },
        setDemonBluffs: (state, action: PayloadAction<IGrimoireSlice['demonBluffs']>) => {
            state.demonBluffs = action.payload;
        }
    },
    selectors: {
        selectReminderTokens: (state) => state.reminderTokens,
        selectRecalibrationQueue: (state) => state.recalibrationQueue,
        selectReminderTokensByTarget: (state, target: number) =>
            getTokensByTarget(state.reminderTokens, target),
        selectReminderTokensBySource: (state, source: number) =>
            getTokensBySource(state.reminderTokens, source),
        selectSeatCondition: (state, seatId: number) =>
            createSeatConditionResolver(state.reminderTokens)(seatId),
        selectIsSeatDrunk: (state, seatId: number) =>
            createSeatConditionResolver(state.reminderTokens)(seatId).isDrunk,
        selectIsSeatPoisoned: (state, seatId: number) =>
            createSeatConditionResolver(state.reminderTokens)(seatId).isPoisoned,
        selectIsReminderTokenFlipped: (state, tokenKey: string) => {
            const token = state.reminderTokens[tokenKey];
            if (!token || !token.isChanneled) {
                return false;
            }

            const sourceCondition = createSeatConditionResolver(state.reminderTokens)(token.source);
            return sourceCondition.isDrunk || sourceCondition.isPoisoned;
        }
    }
});

export const {
    addReminderToken,
    removeReminderToken,
    setSeats,
    setOutOfPlay,
    setDemonBluffs
} = grimoireSlice.actions;

export const {
    selectReminderTokens,
    selectRecalibrationQueue,
    selectReminderTokensByTarget,
    selectReminderTokensBySource,
    selectSeatCondition,
    selectIsSeatDrunk,
    selectIsSeatPoisoned,
    selectIsReminderTokenFlipped
} = grimoireSlice.selectors;
