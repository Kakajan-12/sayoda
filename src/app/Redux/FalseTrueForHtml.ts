// 'use server'
import { createSlice } from "@reduxjs/toolkit";
interface CounterState {
  value: boolean;
}

const initialState: CounterState = {
  value: false,
};

export const toggleTrueFalse = createSlice({
  name: "checker",
  initialState,
  reducers: {
    makeTrue: (state) => {
      state.value = true;
    },
    makeFalse: (state) => {
      state.value = false;
    },
    makeToggle: (state) => {
      state.value = !state.value;
    },
  },
});
export const { makeTrue, makeFalse, makeToggle } = toggleTrueFalse.actions;

export default toggleTrueFalse.reducer;
