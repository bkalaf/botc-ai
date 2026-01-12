// src/store/types/memory-types.ts
import { Roles } from '../../data/types';

// src/store/types/memory-types.ts
export type InfoTypes = 'night_info';

export interface Claim {
    infoType: InfoTypes;
    role?: Roles;
    data: {
        count: number;
    };
}

export interface IMemorySlice {
    claims: Record<number, Claim[]>;
}
