// src/store/settings/settings-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
    showNightOrder: boolean;
    showFirstNightOrder: boolean;
    showOtherNightOrder: boolean;
    historyExpanded: boolean;
}

const initialState: SettingsState = {
    showNightOrder: true,
    showFirstNightOrder: true,
    showOtherNightOrder: true,
    historyExpanded: false
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
        },
        setHistoryExpanded: (state, action: PayloadAction<boolean>) => {
            state.historyExpanded = action.payload;
        }
    },
    selectors: {
        selectShowNightOrder: (state) => state.showNightOrder,
        selectShowFirstNightOrder: (state) => state.showFirstNightOrder,
        selectShowOtherNightOrder: (state) => state.showOtherNightOrder,
        selectShowHistoryExpanded: (state) => state.historyExpanded
    }
});

export const { setShowNightOrder, setShowFirstNightOrder, setShowOtherNightOrder, setHistoryExpanded } =
    settingsSlice.actions;

export const { selectShowNightOrder, selectShowFirstNightOrder, selectShowOtherNightOrder, selectShowHistoryExpanded } =
    settingsSlice.selectors;
