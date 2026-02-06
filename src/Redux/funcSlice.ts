import { createSlice } from "@reduxjs/toolkit";

type UiStep = "initial" | "started";

interface FuncState {
  step: UiStep;
  leftUnlocked: boolean;
}

const initialState: FuncState = {
  step: "initial",
  leftUnlocked: false, // ✅ left locked by default
};

const funcSlice = createSlice({
  name: "func",
  initialState,
  reducers: {
    startApp(state) {
      state.step = "started";
      state.leftUnlocked = false; // ✅ every start locks left again
    },
    resetApp(state) {
      state.step = "initial";
      state.leftUnlocked = false; // ✅ home resets lock
    },
    unlockLeft(state) {
      state.leftUnlocked = true; // ✅ right click unlocks left
    },
  },
});

export const { startApp, resetApp, unlockLeft } = funcSlice.actions;
export default funcSlice.reducer;
