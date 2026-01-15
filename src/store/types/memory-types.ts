// src/store/types/memory-types.ts
import { CharacterTypes, Roles } from '../../data/types';
import { Personality } from './player-types';

// src/store/types/memory-types.ts
export type InfoTypes =
    | 'night_info'
    | 'assign_token'
    | 'role_claim'
    | 'character_type_claim'
    | 'demon_bluffs'
    | 'evil_team'
    | 'player_info';
export type InfoSource = 'board' | 'storyteller' | 'player' | 'evil_team';

export interface EvilTeamClaim extends Claim<'evil_team'> {
    data: {
        minions: number[];
        demons: number[];
    };
}
export interface DemonBluffsClaim extends Claim<'demon_bluffs'> {
    data: {
        demonBluffs: [Roles, Roles, Roles];
    };
}
export interface NightInfoClaim<TRole extends Roles, TData> extends Claim<'night_info'> {
    role: TRole;
    data: TData;
}
export interface WasherwomanClaim extends NightInfoClaim<
    'washerwoman',
    { shown: { seats: [number, number]; role: Roles } }
> {}
export interface InvestigatorClaim extends NightInfoClaim<
    'investigator',
    { shown: { seats: [number, number]; role: Roles } }
> {}
export interface LibrarianClaim extends NightInfoClaim<
    'librarian',
    { shown: { seats: [number, number]; role: Roles } } | { shown: 0 }
> {}
export interface EmpathClaim extends NightInfoClaim<'empath', { shown: 0 | 1 | 2; neighbors: [number, number] }> {}
export interface FortuneTellerClaim extends NightInfoClaim<
    'fortuneteller',
    { shown: boolean; choices: [number, number] }
> {}
export interface ChefClaim extends NightInfoClaim<'chef', { shown: 0 | 1 | 2 | 3 | 4 | 5 | 6 }> {}
export interface AssignTokenClaim extends Claim<'assign_token'> {
    role: Roles;
    team: CharacterTypes;
}
export interface RoleClaim extends Claim<'role_claim'> {
    role: Roles;
    team: CharacterTypes;
}
export interface AIPlayerInfoClaim extends Claim<'player_info'> {
    playerInfo: {
        name: string;
        controledBy: 'ai';
        personality: Personality;
    };
}
export interface HumanPlayerInfoClaim extends Claim<'player_info'> {
    playerInfo: {
        name: string;
        controledBy: 'human';
    };
}
export interface Claim<T extends InfoTypes = InfoTypes> {
    infoType: T;
    ID: number;
    seat?: number;
    source: InfoSource;
    day: number;
}

export type NightInfoClaims =
    | WasherwomanClaim
    | InvestigatorClaim
    | LibrarianClaim
    | EmpathClaim
    | FortuneTellerClaim
    | ChefClaim;

export type AllClaims =
    | HumanPlayerInfoClaim
    | AIPlayerInfoClaim
    | RoleClaim
    | AssignTokenClaim
    | NightInfoClaims
    | DemonBluffsClaim
    | EvilTeamClaim;

export interface IMemorySlice {
    claims: Record<number, AllClaims[]>;
}
