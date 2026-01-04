// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from './game/slice';

const store = configureStore({
    reducer: {
        game: gameSlice.reducer
    }
});