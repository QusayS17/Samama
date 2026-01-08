// src/Redux/externalWindowSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LangType = "en" | "ar";

// ✅ only what you need
export type ExternalTarget = "default" | "start";

interface ExternalWindowState {
  lang: LangType;
  isOpen: boolean;
  target: ExternalTarget;
  windowLang: LangType | null;
}

const initialState: ExternalWindowState = {
  lang: "en",
  isOpen: true,          // external is already open (as you said)
  target: "default",     // ✅ show Dfvid at first
  windowLang: null,
};

const externalWindowSlice = createSlice({
  name: "externalWindow",
  initialState,
  reducers: {
    toggleLang(state) {
      state.lang = state.lang === "en" ? "ar" : "en";
    },
    setLanguage(state, action: PayloadAction<LangType>) {
      state.lang = action.payload;
    },

    openExternalWindow(
      state,
      action: PayloadAction<{ target: ExternalTarget; lang?: LangType }>
    ) {
      state.isOpen = true;
      state.target = action.payload.target;
      if (action.payload.lang) state.windowLang = action.payload.lang;
    },

    setWindowLang(state, action: PayloadAction<LangType>) {
      state.windowLang = action.payload;
    },

    setWindowTarget(state, action: PayloadAction<ExternalTarget>) {
      state.target = action.payload;
    },

    closeExternalWindow(state) {
      state.isOpen = false;
      state.target = "default";
      state.windowLang = null;
    },
  },
});

export const {
  toggleLang,
  setLanguage,
  openExternalWindow,
  setWindowLang,
  setWindowTarget,
  closeExternalWindow,
} = externalWindowSlice.actions;

export default externalWindowSlice.reducer;
