import { configureStore } from '@reduxjs/toolkit';
import trufalseReducer from './drawerSlice'; // ✅ подключаем наш слайс

export const store = configureStore({
    reducer: {
        trufalse: trufalseReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
