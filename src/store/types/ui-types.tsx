// src/store/types/ui-types.tsx
export interface UISlice {
    dayBreakDialog: boolean;
    nightBreakDialog: boolean;
    timesUpDialog: boolean;
    request: PendingDialog | null;
}

export type DialogType =
    | 'setupComplete'
    | 'firstNightRoleInfo'
    | 'librarianInfo'
    | 'washerwomanInfo'
    | 'investigatorInfo'
    | 'fortunetellerInfo'
    | 'fortunetellerChoice'
    | 'empathInfo'
    | 'chefInfo'
    | 'minionInfo'
    | 'demonInfo';

export type DialogDataMap = {
    setupComplete: Record<string, never>;
    firstNightRoleInfo: { roleName: string; seatNames: [string, string] };
    librarianInfo: { roleName: string; seatNames: [string, string] };
    washerwomanInfo: { roleName: string; seatNames: [string, string] };
    investigatorInfo: { roleName: string; seatNames: [string, string] };
    fortunetellerInfo: { shown: boolean };
    fortunetellerChoice: { seatOptions: { id: number; name: string }[] };
    empathInfo: { count: number };
    chefInfo: { count: number };
    minionInfo: { demons: { id: number; name: string }[]; minions: { id: number; name: string }[] };
    demonInfo: { bluffs: string[] };
};

export type DialogOptions = {
    dialogType: DialogType;
};
export type DialogResult = {
    confirmed: boolean;
    value: any;
};

export type PendingDialog<T extends DialogType = DialogType> = {
    options: DialogOptions;
    data: DialogDataMap[T];
    resolve: (result: DialogResult) => void;
    reject: (reason?: any) => void;
};
