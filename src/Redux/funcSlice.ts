// src/Redux/funcSlice
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiStep = "initial" | "started";

interface FuncState {
  step: UiStep;
}

const initialState: FuncState = {
  step: "initial", // 👈 default: only Start visible
};

const funcSlice = createSlice({
  name: "func",
  initialState,
  reducers: {
    startApp(state) {
      state.step = "started";
    },
    resetApp(state) {
      state.step = "initial";
    },
  },
});

export const { startApp, resetApp } = funcSlice.actions;
export default funcSlice.reducer;
