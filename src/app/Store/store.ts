// 'use server'
import { configureStore } from "@reduxjs/toolkit";
import {  toggleTrueFalse } from "../Redux/FalseTrueForHtml";
import { drawerforInputs } from "../Redux/DrawerInputs";
export const store = configureStore({
  reducer: {
    trufalse: toggleTrueFalse.reducer,
    inputs : drawerforInputs.reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
