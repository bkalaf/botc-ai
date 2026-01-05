// src/store/voting/voting-slice.ts
import { createSelector, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { ISeat } from '../types/player-types';
import type { RootState } from '..';

export type VotingPhase = 'idle' | 'nominating' | 'argument' | 'voting' | 'resolved';
export type VoteResult = 'failed' | 'tied' | 'succeeded';

export interface IVotingPreferences {
    allowDeadToVote: boolean;
    allowDeadToNominate: boolean;
    voteThresholdMultiplier: number;
}

export interface VoteRecord {
    id: string;
    nomineeId: number;
    nominatorId: number;
    votes: Record<number, boolean>;
    result: VoteResult;
    threshold: number;
    timestamp: number;
}

export interface VotingState {
    phase: VotingPhase;
    currentNomination: { nominatorId: number; nomineeId: number } | null;
    currentVotes: Record<number, boolean>;
    currentResult: VoteResult | null;
    voteHistory: VoteRecord[];
    executedPlayerId: number | null;
    calledForExile: boolean;
    votingPreferences: IVotingPreferences;
}

const initialState: VotingState = {
    phase: 'idle',
    currentNomination: null,
    currentVotes: {},
    currentResult: null,
    voteHistory: [],
    executedPlayerId: null,
    calledForExile: false,
    votingPreferences: {
        allowDeadToVote: true,
        allowDeadToNominate: false,
        voteThresholdMultiplier: 0.5
    }
};

const canVote = (seat: ISeat, preferences: IVotingPreferences) =>
    seat.isAlive || (preferences.allowDeadToVote && seat.hasVote);

const canNominate = (seat: ISeat, preferences: IVotingPreferences) =>
    seat.isAlive || (preferences.allowDeadToNominate && seat.hasVote);

export const votingSlice = createSlice({
    name: 'voting',
    initialState,
    reducers: {
        nominatePlayer: (state, action: PayloadAction<{ nominatorId: number; nomineeId: number }>) => {
            state.currentNomination = action.payload;
            state.phase = 'argument';
            state.currentVotes = {};
            state.currentResult = null;
            state.calledForExile = false;
        },
        callForExile: (state) => {
            state.calledForExile = true;
            state.phase = 'nominating';
        },
        solicitArgumentPlusDefense: (state) => {
            state.phase = 'argument';
        },
        callForVote: (state) => {
            state.phase = 'voting';
        },
        voteFailed: (state) => {
            state.currentResult = 'failed';
            state.phase = 'resolved';
        },
        voteTied: (state) => {
            state.currentResult = 'tied';
            state.phase = 'resolved';
        },
        voteSuceeded: (state) => {
            state.currentResult = 'succeeded';
            state.phase = 'resolved';
        },
        executePlayer: (state, action: PayloadAction<{ playerId: number }>) => {
            state.executedPlayerId = action.payload.playerId;
            state.phase = 'idle';
        },
        castVote: (state, action: PayloadAction<{ voterId: number; vote: boolean }>) => {
            state.currentVotes[action.payload.voterId] = action.payload.vote;
        },
        recordVote: (state, action: PayloadAction<{ voterId: number; vote: boolean }>) => {
            state.currentVotes[action.payload.voterId] = action.payload.vote;
        },
        recordVoteResult: (state, action: PayloadAction<{ result: VoteResult; threshold: number }>) => {
            if (!state.currentNomination) {
                return;
            }

            state.currentResult = action.payload.result;
            state.phase = 'resolved';
            state.voteHistory.push({
                id: nanoid(),
                nomineeId: state.currentNomination.nomineeId,
                nominatorId: state.currentNomination.nominatorId,
                votes: { ...state.currentVotes },
                result: action.payload.result,
                threshold: action.payload.threshold,
                timestamp: Date.now()
            });
        }
    },
    selectors: {
        selectVotingPhase: (state) => state.phase,
        selectCurrentNomination: (state) => state.currentNomination,
        selectCurrentVotes: (state) => state.currentVotes,
        selectVoteHistory: (state) => state.voteHistory,
        selectVotingPreferences: (state) => state.votingPreferences,
        selectCalledForExile: (state) => state.calledForExile,
        selectExecutedPlayerId: (state) => state.executedPlayerId,
        selectCurrentResult: (state) => state.currentResult
    }
});

const selectVotingState = (state: RootState) => state.voting;
const selectGrimoireSeats = (state: RootState) => state.grimoire.seats;

export const GetWhoCanVoteToday = createSelector(
    [selectGrimoireSeats, selectVotingState],
    (seats, voting) => seats.filter((seat) => canVote(seat, voting.votingPreferences))
);

export const GetWhoCanNominateToday = createSelector(
    [selectGrimoireSeats, selectVotingState],
    (seats, voting) => seats.filter((seat) => canNominate(seat, voting.votingPreferences))
);

export const VoteThreshold = createSelector(
    [GetWhoCanVoteToday, selectVotingState],
    (eligibleVoters, voting) => {
        const rawThreshold = Math.ceil(eligibleVoters.length * voting.votingPreferences.voteThresholdMultiplier);
        return Math.max(1, rawThreshold);
    }
);

export const {
    nominatePlayer,
    callForExile,
    solicitArgumentPlusDefense,
    callForVote,
    voteFailed,
    voteTied,
    voteSuceeded,
    executePlayer,
    castVote,
    recordVoteResult,
    recordVote
} = votingSlice.actions;

export const {
    selectVotingPhase,
    selectCurrentNomination,
    selectCurrentVotes,
    selectVoteHistory,
    selectVotingPreferences,
    selectCalledForExile,
    selectExecutedPlayerId,
    selectCurrentResult
} = votingSlice.selectors;
