import { Roles } from '../../data/types';

export type GameStates = 'idle' | 'reveal' | 'in-progress' | 'setup';
export type GamePhase = 'day' | 'night';
export type GameWinner = 'evil' | 'good';

export interface IGameSlice {
    gameID: string;
    winner?: GameWinner;
    day: number;
    phase: GamePhase;
    gameState: GameStates;
    script: Roles[];
}
