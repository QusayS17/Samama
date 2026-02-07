import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiStep = "initial" | "started";
type Side = "left" | "right";

interface FuncState {
  step: UiStep;
  visible: Side | null; // which button is currently shown
}

const initialState: FuncState = {
  step: "initial",
  visible: null,
};

const funcSlice = createSlice({
  name: "func",
  initialState,
  reducers: {
    startApp(state) {
      state.step = "started";
      state.visible = "right"; // ✅ show right first
    },
    resetApp(state) {
      state.step = "initial";
      state.visible = null; // ✅ hide both
    },

    // when a side is clicked -> show the other side
    clicked(state, action: PayloadAction<Side>) {
      state.visible = action.payload === "right" ? "left" : "right";
    },
  },
});

export const { startApp, resetApp, clicked } = funcSlice.actions;
export default funcSlice.reducer;
