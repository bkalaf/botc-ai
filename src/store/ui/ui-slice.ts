// src/store/ui/ui-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PendingDialog, UISlice } from '../types/ui-types';

const initialState: UISlice = {
    timesUpDialog: false,
    dayBreakDialog: false,
    nightBreakDialog: false,
    request: null
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showDialog(state, action: PayloadAction<PendingDialog>) {
            state.request = action.payload;
        },
        closeDialog(state) {
            state.request = null;
        },
        showTimesUpDialog: (state) => {
            state.timesUpDialog = true;
        },
        hideTimesUpDialog: (state) => {
            state.timesUpDialog = false;
        },
        toggleTimesUpDialog: (state, action: PayloadAction<boolean>) => {
            state.timesUpDialog = action.payload;
        },
        showDayBreakDialog: (state) => {
            state.dayBreakDialog = true;
        },
        hideDayBreakDialog: (state) => {
            state.dayBreakDialog = false;
        },
        toggleDayBreakDialog: (state, action: PayloadAction<boolean>) => {
            state.dayBreakDialog = action.payload;
        },
        showNightBreakDialog: (state) => {
            state.nightBreakDialog = true;
        },
        hideNightBreakDialog: (state) => {
            state.nightBreakDialog = false;
        },
        toggleNightBreakDialog: (state, action: PayloadAction<boolean>) => {
            state.nightBreakDialog = action.payload;
        }
    },
    selectors: {
        selectTimesUpDialog: (state) => state.timesUpDialog,
        selectDayBreakDialog: (state) => state.dayBreakDialog,
        selectNightBreakDialog: (state) => state.nightBreakDialog,
        selectRequest: (state) => state.request
    }
});

export default uiSlice;
export const {
    showDialog,
    closeDialog,
    showTimesUpDialog,
    hideTimesUpDialog,
    toggleTimesUpDialog,
    showDayBreakDialog,
    hideDayBreakDialog,
    toggleDayBreakDialog,
    showNightBreakDialog,
    hideNightBreakDialog,
    toggleNightBreakDialog
} = uiSlice.actions;

export const { selectDayBreakDialog, selectNightBreakDialog, selectTimesUpDialog, selectRequest } = uiSlice.selectors;
