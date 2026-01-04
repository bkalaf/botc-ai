// src/store/ai-orchestrator/ai-orchestrator-slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addLogEntry } from '../history/history-slice';
import { IStorytellerQueueItem } from '../st-queue/st-queue-slice';

export type AiOrchestratorStatus = 'idle' | 'pending' | 'fulfilled' | 'errored';
export type AiHttpFunctionTarget = 'storyteller' | 'player' | 'system';

export interface IAiOrchestratorItem {
    id: string;
    type: string;
    payload?: Record<string, unknown>;
    prompt?: string;
    httpTarget?: AiHttpFunctionTarget;
    endpointOverride?: string;
    requestedBy?: string;
    model?: string;
    costPer1kTokens?: number;
}

export interface IAiOrchestratorResult {
    item: IAiOrchestratorItem;
    prompt: string;
    estimatedTokens: number;
    estimatedCost: number;
    response: unknown;
}

export interface IAiOrchestratorState {
    items: IAiOrchestratorItem[];
    currentItem: IAiOrchestratorItem | null;
    status: AiOrchestratorStatus;
    error: string | null;
    lastPrompt: string | null;
    lastEstimatedCost: number | null;
    lastResponse: unknown;
}

const DEFAULT_COST_PER_1K_TOKENS = 0.002;
const TOKEN_ESTIMATE_DIVISOR = 4;

const httpTargetRoutes: Record<AiHttpFunctionTarget, string> = {
    storyteller: '/api/ai/storyteller',
    player: '/api/ai/player',
    system: '/api/ai/system'
};

const resolveEndpoint = (item: IAiOrchestratorItem) =>
    item.endpointOverride ?? httpTargetRoutes[item.httpTarget ?? 'storyteller'];

const buildPrompt = (item: IAiOrchestratorItem) => {
    if (item.prompt) {
        return item.prompt;
    }

    const payloadPrompt = item.payload?.prompt;
    if (typeof payloadPrompt === 'string') {
        return payloadPrompt;
    }

    return JSON.stringify(
        {
            type: item.type,
            payload: item.payload ?? {},
            requestedBy: item.requestedBy ?? null
        },
        null,
        2
    );
};

const estimateTokens = (prompt: string) =>
    Math.max(1, Math.ceil(prompt.length / TOKEN_ESTIMATE_DIVISOR));

const estimateCost = (tokens: number, costPer1kTokens?: number) =>
    (tokens / 1000) * (costPer1kTokens ?? DEFAULT_COST_PER_1K_TOKENS);

export const initialState: IAiOrchestratorState = {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
    lastPrompt: null,
    lastEstimatedCost: null,
    lastResponse: null
};

export const orchestrateNext = createAsyncThunk<
    IAiOrchestratorResult,
    void,
    { state: { aiOrchestrator: IAiOrchestratorState } }
>('aiOrchestrator/orchestrateNext', async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().aiOrchestrator;
    const nextItem = state.currentItem ?? state.items[0];

    if (!nextItem) {
        return rejectWithValue('No queued AI request.');
    }

    if (!state.currentItem) {
        dispatch(aiOrchestratorSlice.actions.dequeueNext());
    }

    const prompt = buildPrompt(nextItem);
    const estimatedTokens = estimateTokens(prompt);
    const estimatedCost = estimateCost(estimatedTokens, nextItem.costPer1kTokens);

    dispatch(
        addLogEntry({
            message: `AI prompt queued for ${nextItem.type}. Estimated cost: $${estimatedCost.toFixed(4)}.`,
            logEntryType: 'info',
            scope: 'storyteller',
            reasoning: prompt
        })
    );

    const endpoint = resolveEndpoint(nextItem);
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt,
            type: nextItem.type,
            payload: nextItem.payload,
            requestedBy: nextItem.requestedBy,
            model: nextItem.model
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || `Request failed with status ${response.status}.`);
    }

    const data = await response.json();

    return {
        item: nextItem,
        prompt,
        estimatedTokens,
        estimatedCost,
        response: data
    };
});

export const aiOrchestratorSlice = createSlice({
    name: 'aiOrchestrator',
    initialState,
    reducers: {
        enqueueBack: (state, action: PayloadAction<IAiOrchestratorItem>) => {
            state.items.push(action.payload);
        },
        enqueueFront: (state, action: PayloadAction<IAiOrchestratorItem>) => {
            state.items.unshift(action.payload);
        },
        enqueueFromStorytellerQueue: (state, action: PayloadAction<IStorytellerQueueItem>) => {
            state.items.push({
                id: action.payload.id,
                type: action.payload.type,
                payload: action.payload.payload,
                requestedBy: action.payload.requestedBy,
                httpTarget: 'storyteller'
            });
        },
        dequeueNext: (state) => {
            state.currentItem = state.items.shift() ?? null;
        },
        clearQueue: (state) => {
            state.items = [];
        },
        clearCurrent: (state) => {
            state.currentItem = null;
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(orchestrateNext.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(orchestrateNext.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.error = null;
                state.lastPrompt = action.payload.prompt;
                state.lastEstimatedCost = action.payload.estimatedCost;
                state.lastResponse = action.payload.response;
                state.currentItem = null;
            })
            .addCase(orchestrateNext.rejected, (state, action) => {
                state.status = 'errored';
                state.error = (action.payload as string) ?? action.error.message ?? 'Unknown error';
            });
    },
    selectors: {
        selectQueueItems: (state) => state.items,
        selectHasQueueItems: (state) => state.items.length > 0,
        selectNextQueueItem: (state) => state.items[0] ?? null,
        selectCurrentQueueItem: (state) => state.currentItem,
        selectStatus: (state) => state.status,
        selectLastPrompt: (state) => state.lastPrompt,
        selectLastEstimatedCost: (state) => state.lastEstimatedCost,
        selectLastResponse: (state) => state.lastResponse,
        selectError: (state) => state.error
    }
});

export const {
    enqueueBack,
    enqueueFront,
    enqueueFromStorytellerQueue,
    dequeueNext,
    clearQueue,
    clearCurrent,
    resetStatus
} = aiOrchestratorSlice.actions;

export const {
    selectQueueItems,
    selectHasQueueItems,
    selectNextQueueItem,
    selectCurrentQueueItem,
    selectStatus,
    selectLastPrompt,
    selectLastEstimatedCost,
    selectLastResponse,
    selectError
} = aiOrchestratorSlice.selectors;
