// src/store/types/memory-types.ts
import { CharacterTypes, Roles } from '../../data/types';

// src/store/types/memory-types.ts
export type InfoTypes =
    | 'night_info'
    | 'assign_token'
    | 'role_claim'
    | 'character_type_claim'
    | 'demon_bluffs'
    | 'evil_team';
export type InfoSource = 'storyteller' | 'player' | 'evil_team';

export interface Claim {
    infoType: InfoTypes;
    ID: number;
    role?: Roles;
    team?: CharacterTypes;
    seat?: number;
    source: InfoSource;
    day: number;
    data: {
        count: number;
    };
}

export interface IMemorySlice {
    claims: Record<number, Claim[]>;
}
