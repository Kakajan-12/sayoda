import { configureStore } from '@reduxjs/toolkit';
import trufalseReducer from '@/app/Redux/FalseTrueForHtml'; // ✅ подключаем наш слайс

export const store = configureStore({
    reducer: {
        trufalse: trufalseReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
