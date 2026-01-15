// src/store/grimoire/grimoire-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGrimoireSlice, IReminderTokens } from '../types/grimoire-types';
import { CharacterTypes, $$ROLES, Roles } from '../../data/types';
import { toProperCase } from '../../utils/getWordsForNumber.ts/toProperCase';
import { buildNightOrderIndex } from '../../utils/nightOrder';

type SeatCondition = {
    isDrunk: boolean;
    isPoisoned: boolean;
};

export interface IGrimoireState extends IGrimoireSlice {
    recalibrationQueue: number[];
}

const initialState: IGrimoireState = {
    seats: {},
    demonBluffs: undefined,
    outOfPlay: [],
    reminderTokens: {},
    loricPlayers: [],
    fabledPlayers: [],
    recalibrationQueue: []
};

const getSeatOrThrow = (state: IGrimoireState, seatID: number) => {
    const seat = state.seats[seatID];
    if (!seat) {
        throw new Error(`Seat ${seatID} not found`);
    }
    return seat;
};

const getSeatArray = (state: IGrimoireState) => {
    const seats = Object.values(state.seats);
    seats.sort((a, b) =>
        a.ID < b.ID ? -1
        : a.ID === b.ID ? 0
        : 1
    );
    return seats;
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
            previousStatus.isDrunk !== nextStatus.isDrunk || previousStatus.isPoisoned !== nextStatus.isPoisoned;

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

            const startingTargets = [existing?.target, action.payload.target].filter(
                (target): target is number => target != null
            );

            state.recalibrationQueue = buildRecalibrationQueue(previousTokens, state.reminderTokens, startingTargets);
        },
        removeReminderToken: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            const existing = state.reminderTokens[key];
            if (!existing) {
                return;
            }

            const previousTokens = { ...state.reminderTokens };
            delete state.reminderTokens[key];

            state.recalibrationQueue = buildRecalibrationQueue(previousTokens, state.reminderTokens, [existing.target]);
        },
        setSeats: (state, action: PayloadAction<IGrimoireSlice['seats']>) => {
            state.seats = action.payload;
        },
        setMaskedRole: (state, action: PayloadAction<{ seatID: number; mask: Roles }>) => {
            const seat = getSeatOrThrow(state, action.payload.seatID);
            seat.thinks = seat.role;
            seat.role = action.payload.mask;
            state.outOfPlay = state.outOfPlay.filter((x) => x !== action.payload.mask);
        },
        setAlignment: (state, action: PayloadAction<{ seatID: number; alignment: 'good' | 'evil' }>) => {
            const seat = getSeatOrThrow(state, action.payload.seatID);
            seat.alignment = action.payload.alignment;
        },
        setOutOfPlay: (state, action: PayloadAction<IGrimoireSlice['outOfPlay']>) => {
            state.outOfPlay = action.payload;
        },
        setDemonBluffs: (state, action: PayloadAction<IGrimoireSlice['demonBluffs']>) => {
            state.demonBluffs = action.payload;
        },
        setLoricPlayers: (state, action: PayloadAction<IGrimoireSlice['loricPlayers']>) => {
            state.loricPlayers = action.payload;
        },
        setFabledPlayers: (state, action: PayloadAction<IGrimoireSlice['fabledPlayers']>) => {
            state.fabledPlayers = action.payload;
        }
    },
    selectors: {
        selectDemonBluffs: (state) => state.demonBluffs,
        selectOutOfPlay: (state) => state.outOfPlay,
        selectRoleBySeat: (state, seatID: number) => getSeatOrThrow(state, seatID).role,
        selectSeatByRole: (state, role: Roles) =>
            getSeatArray(state).find((seat) => seat.thinks === role || seat.role === role),
        selectReminderTokens: (state) => state.reminderTokens,
        selectRecalibrationQueue: (state) => state.recalibrationQueue,
        selectReminderTokensByTarget: (state, target: number) => getTokensByTarget(state.reminderTokens, target),
        selectReminderTokensBySource: (state, source: number) => getTokensBySource(state.reminderTokens, source),
        selectSeatCondition: (state, seatId: number) => createSeatConditionResolver(state.reminderTokens)(seatId),
        selectIsSeatDrunk: (state, seatId: number) => createSeatConditionResolver(state.reminderTokens)(seatId).isDrunk,
        selectIsSeatPoisoned: (state, seatId: number) =>
            createSeatConditionResolver(state.reminderTokens)(seatId).isPoisoned,
        selectIsReminderTokenFlipped: (state, tokenKey: string) => {
            const token = state.reminderTokens[tokenKey];
            if (!token || !token.isChanneled) {
                return false;
            }

            const sourceCondition = createSeatConditionResolver(state.reminderTokens)(token.source);
            return sourceCondition.isDrunk || sourceCondition.isPoisoned;
        },
        selectLoricPlayers: (state) => state.loricPlayers,
        selectFabledPlayers: (state) => state.fabledPlayers,
        selectInPlayRoles: (state) =>
            grimoireSlice
                .getSelectors()
                .selectSeatedPlayers(state)
                .map((player) => player.thinks ?? player.role)
                .filter((role): role is Roles => Boolean(role)),
        selectFirstNightOrder: (state) =>
            Object.entries(buildNightOrderIndex(grimoireSlice.getSelectors().selectInPlayRoles(state), 'firstNight'))
                .sort((a, b) =>
                    a[1] < b[1] ? -1
                    : a[1] > b[1] ? 1
                    : 0
                )
                .map((x) => x[0]),
        selectOtherNightOrder: (state) =>
            Object.entries(buildNightOrderIndex(grimoireSlice.getSelectors().selectInPlayRoles(state), 'otherNight'))
                .sort((a, b) =>
                    a[1] < b[1] ? -1
                    : a[1] > b[1] ? 1
                    : 0
                )
                .map((x) => x[0]),
        selectSeatedPlayer: (state, seatID: number) => {
            const seat = getSeatOrThrow(state, seatID);
            const team: CharacterTypes = $$ROLES[seat.role].team as any;
            const reminders = grimoireSlice.getSelectors().selectReminderTokensByTarget(state, seat.ID);
            const conditions = grimoireSlice.getSelectors().selectSeatCondition(state, seat.ID);
            const reminderTokens = reminders.map((x) => ({
                role: grimoireSlice.getSelectors().selectRoleBySeat(state, x.source),
                text: toProperCase(x.key.split('_').slice(1).join(' '))
            }));
            return {
                ID: seat.ID,
                hasVote: seat.hasVote,
                isAlive: seat.isAlive,
                role: seat.role,
                thinks: seat.thinks,
                personality: seat.player.personality!,
                pronouns: seat.player.pronouns,
                name: seat.player.name,
                alignment: seat.alignment,
                controledBy: seat.player.controledBy,
                team,
                reminderTokens,
                reminders: reminders.map((token) => toProperCase(token.key.split('_').slice(1).join(' '))).join(', '),
                ...conditions
            };
        },
        selectSeatedPlayers: (state) => {
            return getSeatArray(state).map((seat) => grimoireSlice.getSelectors().selectSeatedPlayer(state, seat.ID));
        }
    }
});

export const {
    addReminderToken,
    removeReminderToken,
    setSeats,
    setMaskedRole,
    setOutOfPlay,
    setDemonBluffs,
    setLoricPlayers,
    setFabledPlayers,
    setAlignment
} = grimoireSlice.actions;

export const {
    selectSeatByRole,
    selectDemonBluffs,
    selectOutOfPlay,
    selectReminderTokens,
    selectRecalibrationQueue,
    selectReminderTokensByTarget,
    selectReminderTokensBySource,
    selectSeatCondition,
    selectIsSeatDrunk,
    selectIsSeatPoisoned,
    selectIsReminderTokenFlipped,
    selectLoricPlayers,
    selectFabledPlayers,
    selectSeatedPlayers,
    selectSeatedPlayer,
    selectFirstNightOrder,
    selectOtherNightOrder,
    selectInPlayRoles
} = grimoireSlice.selectors;
