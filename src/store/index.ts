// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from './game/game-slice';
import { grimoireSlice } from './grimoire/grimoire-slice';

const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        grimoire: grimoireSlice.reducer
    }
});
