// src/store/types/ui-types.tsx
import React from 'react';

export interface UISlice {
    dayBreakDialog: boolean;
    nightBreakDialog: boolean;
    timesUpDialog: boolean;
    request: PendingDialog | null;
}

export type DialogOptions = {
    title: string;
    message: string;
    className?: string;
    contentClassName?: string;
    Controls: () => React.ReactNode;
};
export type DialogResult = {
    confirmed: boolean;
    value: any;
};

export type PendingDialog = {
    options: DialogOptions;
    resolve: (result: DialogResult) => void;
    reject: (reason?: any) => void;
};
