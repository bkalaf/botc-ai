// src/store/game/game-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Roles } from '../../data/types';
import { toProperCase } from '../../utils/getWordsForNumber.ts/toProperCase';
import { GameStates } from '../types/game-types';

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

export const { selectScript } = gameSlice.selectors;
