// src/store/game/game-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterTypes, Roles } from '../../data/types';

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
}

export interface IGrimoireSlice {
    seats: ISeat[];
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
    selectors: {}
});
