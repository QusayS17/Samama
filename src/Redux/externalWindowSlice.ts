// src/Redux/externalWindowSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 🎯 Add more targets anytime
export type ExternalTarget = "default" | "start" | "left" | "right";

interface ExternalWindowState {
  isOpen: boolean;
  target: ExternalTarget;
}

const initialState: ExternalWindowState = {
  isOpen: true,        // external already open
  target: "default",  // show default video first
};

const externalWindowSlice = createSlice({
  name: "externalWindow",
  initialState,
  reducers: {
    openExternalWindow(
      state,
      action: PayloadAction<{ target: ExternalTarget }>
    ) {
      state.isOpen = true;
      state.target = action.payload.target;
    },

    setWindowTarget(state, action: PayloadAction<ExternalTarget>) {
      state.target = action.payload;
    },

    closeExternalWindow(state) {
      state.isOpen = false;
      state.target = "default";
    },
  },
});

export const {
  openExternalWindow,
  setWindowTarget,
  closeExternalWindow,
} = externalWindowSlice.actions;

export default externalWindowSlice.reducer;
