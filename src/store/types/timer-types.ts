// src/store/types/timer-types.ts
export type TimerStates = 'running' | 'paused' | 'expired';

export interface ITimerSlice {
    alarm: boolean;
    timerState: TimerStates;
    expires: number;
    duration: number;
    display: string;
    refreshes: number;
}
