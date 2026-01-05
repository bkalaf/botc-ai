// src/store/game/game-slice.ts
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Roles } from '../../data/types';
import { toProperCase } from '../../utils/getWordsForNumber.ts/toProperCase';
import { GameStates } from '../types/game-types';
import { RootState } from '..';
import { generateHex24 } from '../../utils/generateHex24';
import { IPlayer, ISeat } from '../types/player-types';

// src/store/game/slice.ts
export interface IGameSlice {
    gameID: string;
    winner?: 'evil' | 'good';
    day: number;
    phase: 'day' | 'night';
    gameState: GameStates;
    script: Roles[];
}

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
const MIN_SEATED_PLAYERS = 5;
const isValidGameStart = (script: Roles[], seats: ISeat[]) => script.length > 0 && seats.length >= MIN_SEATED_PLAYERS;

export const selectCanStartGame = createSelector([selectGameScript, selectSeatedPlayers], (script, seats) =>
    isValidGameStart(script, seats)
);

export const buildAndStartGame = createAsyncThunk<{ gameID: string }, void, { state: RootState; rejectValue: string }>(
    'game/buildAndStartGame',
    async (_, { getState, dispatch, rejectWithValue }) => {
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
    }
);

export const { selectScript } = gameSlice.selectors;
