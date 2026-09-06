import { createSlice } from '@reduxjs/toolkit';

const trufalseSlice = createSlice({
  name: 'trufalse',
  initialState: { value: false },
  reducers: {
    makeTrue: (state) => { state.value = true; },
    makeFalse: (state) => { state.value = false; },
    makeToggle: (state) => { state.value = !state.value; },
  },
});

export const { makeTrue, makeFalse, makeToggle } = trufalseSlice.actions;
export default trufalseSlice.reducer;
