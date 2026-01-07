// src/store/settings/settings-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
    showNightOrder: boolean;
    showFirstNightOrder: boolean;
    showOtherNightOrder: boolean;
    historyExpanded: boolean;
    grimoireShape: 'circle' | 'square';
}

const initialState: SettingsState = {
    showNightOrder: true,
    showFirstNightOrder: true,
    showOtherNightOrder: true,
    historyExpanded: true,
    grimoireShape: 'circle'
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
        },
        setGrimoireShape: (state, action: PayloadAction<SettingsState['grimoireShape']>) => {
            state.grimoireShape = action.payload;
        }
    },
    selectors: {
        selectShowNightOrder: (state) => state.showNightOrder,
        selectShowFirstNightOrder: (state) => state.showFirstNightOrder,
        selectShowOtherNightOrder: (state) => state.showOtherNightOrder,
        selectShowHistoryExpanded: (state) => state.historyExpanded,
        selectGrimoireShape: (state) => state.grimoireShape
    }
});

export const {
    setShowNightOrder,
    setShowFirstNightOrder,
    setShowOtherNightOrder,
    setHistoryExpanded,
    setGrimoireShape
} = settingsSlice.actions;

export const {
    selectShowNightOrder,
    selectShowFirstNightOrder,
    selectShowOtherNightOrder,
    selectShowHistoryExpanded,
    selectGrimoireShape
} = settingsSlice.selectors;

export default settingsSlice.reducer;
