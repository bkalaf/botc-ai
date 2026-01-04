// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from './game/game-slice';
import { storytellerQueueSlice } from './st-queue/st-queue-slice';

const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        storytellerQueue: storytellerQueueSlice.reducer
    }
});
