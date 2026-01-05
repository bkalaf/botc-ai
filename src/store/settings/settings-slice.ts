// src/store/settings/settings-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
    showNightOrder: boolean;
    showFirstNightOrder: boolean;
    showOtherNightOrder: boolean;
}

const initialState: SettingsState = {
    showNightOrder: true,
    showFirstNightOrder: true,
    showOtherNightOrder: true
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setShowNightOrder: (state, action: PayloadAction<boolean>) => {
            state.showNightOrder = action.payload;
        },
        setShowFirstNightOrder: (state, action: PayloadAction<boolean>) => {
            state.showFirstNightOrder = action.payload;
        },
        setShowOtherNightOrder: (state, action: PayloadAction<boolean>) => {
            state.showOtherNightOrder = action.payload;
        }
    },
    selectors: {
        selectShowNightOrder: (state) => state.showNightOrder,
        selectShowFirstNightOrder: (state) => state.showFirstNightOrder,
        selectShowOtherNightOrder: (state) => state.showOtherNightOrder
    }
});

export const { setShowNightOrder, setShowFirstNightOrder, setShowOtherNightOrder } =
    settingsSlice.actions;

export const { selectShowNightOrder, selectShowFirstNightOrder, selectShowOtherNightOrder } =
    settingsSlice.selectors;
