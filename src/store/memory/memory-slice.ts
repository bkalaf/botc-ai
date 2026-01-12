// src/store/memory/memory-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMemorySlice } from '../types/memory-types';
import { Roles } from '../../data/types';

const initialState: IMemorySlice = {
    claims: {}
};

const memorySlice = createSlice({
    name: 'memory',
    initialState,
    reducers: {
        addClaim: (state, action: PayloadAction<{ ID: number; role: Roles; data: any }>) => {
            const { ID, role, data } = action.payload;
            const current = state.claims[ID] ?? [];
            state.claims[ID] = [...current, { infoType: 'night_info', role, data }];
        }
    }
});

export default memorySlice.reducer;

export const { addClaim } = memorySlice.actions;
