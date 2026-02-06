import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiStep = "initial" | "started";
type Side = "left" | "right";

interface FuncState {
  step: UiStep;
  allowed: Side; // ✅ which button is clickable right now
}

const initialState: FuncState = {
  step: "initial",
  allowed: "right", // ✅ at first: right clickable, left locked
};

const funcSlice = createSlice({
  name: "func",
  initialState,
  reducers: {
    startApp(state) {
      state.step = "started";
      state.allowed = "right"; // ✅ reset rule when start
    },
    resetApp(state) {
      state.step = "initial";
      state.allowed = "right"; // ✅ reset rule when home
    },

    // Call this after user clicks a side
    clicked(state, action: PayloadAction<Side>) {
      // after clicking one side, allow the other
      state.allowed = action.payload === "right" ? "left" : "right";
    },
  },
});

export const { startApp, resetApp, clicked } = funcSlice.actions;
export default funcSlice.reducer;
