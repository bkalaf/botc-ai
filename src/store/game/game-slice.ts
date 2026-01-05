// src/store/game/game-slice.ts
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { CharacterTypes, Roles } from '../../data/types';
import { generateHex24 } from '../../utils/generateHex24';
import { toProperCase } from '../../utils/getWordsForNumber.ts/toProperCase';

// src/store/game/slice.ts
export interface IGameSlice {
    gameID: string;
    winner?: 'evil' | 'good';
    day: number;
    phase: 'day' | 'night';
    gameState: GameStates;
    script: Roles[];
}

export type TimerStates = 'running' | 'paused' | 'expired';
export type GameStates = 'idle' | 'reveal' | 'in-progress' | 'setup';

export interface ITimerSlice {
    alarm: boolean;
    timerState: TimerStates;
    expires: number;
    duration: number;
    display: string;
    refreshes: number;
}

export type PlayerController = 'ai' | 'human';

export interface IPlayer {
    name: string;
    email?: string;
    pronouns?: string;
    controledBy: PlayerController;
    personality?: Personality;
}

export interface ISeat {
    ID: number;
    player: IPlayer;
    role: Roles;
    thinks?: Roles;
    isAlive: boolean;
    hasVote: boolean;
}

export interface IReminderTokens {
    key: string;
    source: number;
    target: number;
    isChanneled: boolean;
    label?: string;
    typeKey?: string;
}

export interface IGrimoireSlice {
    seats: ISeatedPlayer[];
    demonBluffs: [Roles, Roles, Roles] | undefined;
    outOfPlay: Roles[];
    reminderTokens: Record<string, IReminderTokens>;
}

export interface ISeatedPlayer {
    name: string;
    ID: number;
    personality: Personality;
    pronouns?: string;
    role: Roles;
    thinks?: Roles;
    hasVote: boolean;
    isAlive: boolean;
    alignment: 'good' | 'evil';
    team: CharacterTypes;
    reminders: string;
    isDrunk: boolean;
    isPoisoned: boolean;
    worldBuildingWorksheet?: WorldBuildingWorksheet;
}

export type PlayerId = ISeatedPlayer['ID'];

const MIN_SEATED_PLAYERS = 5;

const isValidGameStart = (script: Roles[], seats: ISeatedPlayer[]) =>
    script.length > 0 && seats.length >= MIN_SEATED_PLAYERS;

export interface DailyDemocracyManager {
    nomineePool: PlayerId[];
    nominatorPool: PlayerId[];
}

export interface WorldBuildingWorksheet {
    demon: DemonWorldModel;
    minions: MinionWorldModel;
    outsiders: OutsiderWorldModel;
    setupModifiers: SetupModifierWorldModel;
    intoxication: IntoxicationWorldModel;
    notes?: string;
}

export interface DemonWorldModel {
    role?: Roles;
    specialAbilities?: string[];
    killsPerNight?: number;
    constraints?: string[];
    notes?: string;
}

export interface MinionWorldModel {
    expectedCount?: number;
    confirmed?: Roles[];
    possibleSets?: Roles[][];
    notes?: string;
}

export interface OutsiderWorldModel {
    baseCount?: number;
    currentCount?: number;
    suspectedModifiers?: string[];
    notes?: string;
}

export interface SetupModifierWorldModel {
    suspectedModifiers?: string[];
    confirmedModifiers?: string[];
    notes?: string;
}

export interface IntoxicationWorldModel {
    knownDrunk?: PlayerId[];
    knownPoisoned?: PlayerId[];
    suspectedDrunk?: PlayerId[];
    suspectedPoisoned?: PlayerId[];
    notes?: string;
}

export type TrustModels = 'all_trusting' | 'skeptical' | 'doubting_thomas';
export type TableImpactStyles = 'disruptive' | 'stabilizing' | 'procedural';
export type ReasoningModes = 'deductive' | 'associative' | 'surface';
export type InformationHandlingStyle = 'archivist' | 'impressionistic' | 'signal_driven';
export type VoiceStyles = 'quiet' | 'conversational' | 'dominant';

export type Personality = {
    trustModel: TrustModels;
    tableImpact: TableImpactStyles;
    reasoningMode: ReasoningModes;
    informationHandling: InformationHandlingStyle;
    voiceStyle: VoiceStyles;
};
/** Maps each trait -> option -> behavioral instruction text. */
export type PersonalityModulation = Partial<{
    [K in keyof Personality]: Partial<Record<Personality[K], string>>;
}>;

export const initialState: IGameSlice = {
    winner: undefined,
    day: 0,
    phase: 'day',
    gameID: '',
    gameState: 'idle',
    script: []
};
export interface IGameSetupSlice {
    guid: string;
    storyteller: string;
    playerCount: number;
    players: IPlayer[];
    outOfPlay: Roles[];
}
export interface IGrimoireSlice {
    seats: ISeatedPlayer[];
    demonBluffs: [Roles, Roles, Roles] | undefined;
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        nextDayPhase: (state) => {
            if (state.phase === 'day') {
                state.phase = 'night';
                state.day = state.day + 1;
            } else {
                state.phase = 'day';
            }
        },
        setGameID: (state, action: PayloadAction<string>) => {
            state.gameID = action.payload;
        },
        setScript: (state, action: PayloadAction<Roles[]>) => {
            state.script = action.payload;
        },
        startNewGame: (state, action: PayloadAction<{ gameID: string }>) => {
            state.gameID = action.payload.gameID;
            state.winner = undefined;
            state.day = 0;
            state.phase = 'day';
            state.gameState = 'in-progress';
        },
        cycleGameState: (state) => {
            switch (state.gameState) {
                case 'idle':
                    state.gameState = 'setup';
                    break;
                case 'reveal':
                    state.gameState = 'idle';
                    break;
                case 'in-progress':
                    state.gameState = 'reveal';
                    break;
                case 'setup':
                    state.gameState = 'in-progress';
                    break;
            }
        },
        goodWon: (state) => {
            state.winner = 'good';
        },
        evilWon: (state) => {
            state.winner = 'evil';
        }
    },
    selectors: {
        selectDoesGameContinue: (state) => state.winner == null,
        selectDidGoodWin: (state) => state.winner === 'good',
        selectDidEvilWin: (state) => state.winner === 'evil',
        selectGameState: (state) => state.gameState,
        selectCanCycleGameState: (state) => state.script.length > 0,
        selectScript: (state) => state.script,
        selectDay: (state) => state.day,
        selectPhase: (state) => state.phase,
        selectDisplayTime: (state) => toProperCase(`${state.phase} ${state.day.toString()}`)
    }
});

const selectGameScript = (state: RootState) => state.game.script;
const selectSeatedPlayers = (state: RootState) => state.grimoire.seats;

export const selectCanStartGame = createSelector(
    [selectGameScript, selectSeatedPlayers],
    (script, seats) => isValidGameStart(script, seats)
);

export const buildAndStartGame = createAsyncThunk<
    { gameID: string },
    void,
    { state: RootState; rejectValue: string }
>('game/buildAndStartGame', async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const script = state.game.script;
    const seats = state.grimoire.seats;

    if (script.length === 0) {
        return rejectWithValue('A script is required to start a new game.');
    }

    if (seats.length < MIN_SEATED_PLAYERS) {
        return rejectWithValue(`At least ${MIN_SEATED_PLAYERS} players must be seated to start.`);
    }

    const gameID = generateHex24();
    dispatch(gameSlice.actions.startNewGame({ gameID }));
    return { gameID };
});

export const { selectScript } = gameSlice.selectors;
