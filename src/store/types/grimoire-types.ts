// src/store/types/grimoire-types.ts
import { Roles } from '../../data/types';
import { ISeat } from './player-types';

export interface IReminderTokens {
    key: string;
    source: number;
    target: number;
    isChanneled: boolean;
}

export interface IGrimoireSlice {
    seats: Record<number, ISeat>;
    demonBluffs: [Roles, Roles, Roles] | undefined;
    outOfPlay: Roles[];
    reminderTokens: Record<string, IReminderTokens>;
    loricPlayers: Roles[];
    fabledPlayers: Roles[];
}
