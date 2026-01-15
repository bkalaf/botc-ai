// src/store/memory/memory-slice.ts
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Claim, IMemorySlice, InfoSource, InfoTypes } from '../types/memory-types';
import { CharacterTypes, Roles } from '../../data/types';
import { selectSeatByRole } from '../grimoire/grimoire-slice';
import { AppDispatch, RootState } from '..';
import { $$ROLES } from '@/data/types';

const initialState: IMemorySlice = {
    claims: {}
};

export const getClaimsFor = createAsyncThunk<Claim[], Roles, { state: RootState; dispatch: AppDispatch }>(
    'memory/getClaimsFor',
    async (role: Roles, thunkAPI) => {
        const seat = selectSeatByRole(thunkAPI.getState(), role)?.ID;
        if (seat == null) throw new Error('could not find seat');
        return selectMemoryFor(thunkAPI.getState(), seat);
    }
);

export const selectClaimsByRole = createSelector(
    [(state: RootState) => state, (_: RootState, role: Roles) => role],
    (state, role) => {
        const seat = selectSeatByRole(state, role);
        return seat ? selectMemoryFor(state, seat.ID) : undefined;
    }
);

export const memorySlice = createSlice({
    name: 'memory',
    initialState,
    reducers: {
        addPlayerClaim: (state, action: PayloadAction<{ ID: number; name: string; controledBy: 'human' | 'ai' }>) => {
            const { ID, name, controledBy } = action.payload;
            const current = state.claims[ID ?? 0] ?? [];
            state.claims[ID ?? 0] = [
                ...current,
                {
                    infoType: 'player_info',
                    playerInfo: { name, controledBy },
                    ID,
                    source: 'board',
                    day: 1,
                    seat: ID
                }
            ];
        },
        addClaim: (
            state,
            action: PayloadAction<{
                ID: number;
                infoType: InfoTypes;
                source: InfoSource;
                role?: Roles;
                seat?: number;
                data?: any;
                day: number;
                team?: CharacterTypes;
            }>
        ) => {
            const { role, seat, source, data, infoType, day, ID, team } = action.payload;
            const current = state.claims[ID ?? 0] ?? [];
            state.claims[ID ?? 0] = [...current, { ID, infoType, day, team, source, seat, role, data }];
        },
        addRoleClaim(
            state,
            action: PayloadAction<{
                ID: number;
                role: Roles;
                seat: number;
                data?: any;
                day: number;
                source?: InfoSource;
            }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({ infoType: 'role_claim', source: 'player', ...action.payload })
            );
        },
        addTeamClaim(
            state,
            action: PayloadAction<{
                ID: number;
                source?: InfoSource;
                team: CharacterTypes;
                seat: number;
                data?: any;
                day: number;
            }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({ infoType: 'character_type_claim', source: 'player', ...action.payload })
            );
        },
        addNightInfoClaim(
            state,
            action: PayloadAction<{
                ID: number;
                source?: InfoSource;
                seat: number;
                role: Roles;
                data?: any;
                day: number;
            }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({ infoType: 'night_info', source: 'player', ...action.payload })
            );
        },
        addMyNightInfoClaim(
            state,
            action: PayloadAction<{ ID: number; seat: number; role: Roles; data?: any; day: number }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({ infoType: 'night_info', source: 'storyteller', ...action.payload })
            );
        },
        addAssignTokenClaim(state, action: PayloadAction<{ ID: number; role: Roles; day: number }>) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({
                    ...action.payload,
                    ID: action.payload.ID,
                    infoType: 'assign_token',
                    seat: action.payload.ID,
                    source: 'storyteller',
                    team: $$ROLES[action.payload.role].team as CharacterTypes
                })
            );
            memorySlice.caseReducers.addTeamClaim(
                state,
                addTeamClaim({
                    ...action.payload,
                    ID: action.payload.ID,
                    seat: action.payload.ID,
                    source: 'storyteller',
                    team: $$ROLES[action.payload.role].team as CharacterTypes
                })
            );
            memorySlice.caseReducers.addRoleClaim(
                state,
                addRoleClaim({
                    ...action.payload,
                    seat: action.payload.ID,
                    source: 'storyteller'
                })
            );
        },
        addDemonBluffsClaim(
            state,
            action: PayloadAction<{ ID: number; source?: InfoSource; day: number; data: { demonBluffs: string[] } }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({
                    day: action.payload.day ?? 1,
                    seat: action.payload.ID,
                    ID: action.payload.ID,
                    source: action.payload.source ?? 'storyteller',
                    data: action.payload.data,
                    infoType: 'demon_bluffs'
                })
            );
        },
        addEvilTeamClaim(
            state,
            action: PayloadAction<{
                ID: number;
                source?: InfoSource;
                day?: number;
                data: { minions: number[]; demons: number[] };
            }>
        ) {
            memorySlice.caseReducers.addClaim(
                state,
                addClaim({
                    ID: action.payload.ID,
                    seat: action.payload.ID,
                    day: action.payload.day ?? 1,
                    source: action.payload.source ?? 'storyteller',
                    data: action.payload.data,
                    infoType: 'evil_team'
                })
            );
            const evilTeam = [...action.payload.data.demons, ...action.payload.data.minions];
            for (const ID of evilTeam) {
                for (const demon of action.payload.data.demons) {
                    memorySlice.caseReducers.addTeamClaim(
                        state,
                        addTeamClaim({
                            ID,
                            seat: demon,
                            team: 'demon',
                            source: 'storyteller',
                            day: action.payload.day ?? 1
                        })
                    );
                }
                for (const minion of action.payload.data.minions) {
                    memorySlice.caseReducers.addTeamClaim(
                        state,
                        addTeamClaim({
                            ID,
                            seat: minion,
                            team: 'minion',
                            source: 'storyteller',
                            day: action.payload.day ?? 1
                        })
                    );
                }
            }
        }
    },
    selectors: {
        selectMemoryFor: (state, seat: number) => state.claims[seat]
    }
});

export default memorySlice.reducer;

export const {
    addClaim,
    addRoleClaim,
    addTeamClaim,
    addNightInfoClaim,
    addMyNightInfoClaim,
    addAssignTokenClaim,
    addEvilTeamClaim,
    addDemonBluffsClaim
} = memorySlice.actions;

export const { selectMemoryFor } = memorySlice.selectors;
