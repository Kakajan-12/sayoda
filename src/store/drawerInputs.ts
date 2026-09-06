import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Dropdown {
  active: string | null;
}
const initialState: Dropdown = {
  active: null,
};
export const drawerforInputs = createSlice({
  name: "Drawer",
  initialState,
  reducers: {
    closeDrawer: (state) => {
      state.active = null;
    },
    forToggleDrawer: (state, action: PayloadAction<string>) => {
      state.active = state.active === action.payload ? null : action.payload;
    },
  },
});
export const { closeDrawer, forToggleDrawer } = drawerforInputs.actions;
export default drawerforInputs.reducer;
