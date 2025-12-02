// src/Redux/externalWindowSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LangType = "en" | "ar";
export type ExternalTarget = "v1" | "v2" | "services" | "impact" | null;

interface ExternalWindowState {
  // 🔤 global language (main UI + what we send to external)
  lang: LangType;

  // 🪟 external Electron window state
  isOpen: boolean;
  target: ExternalTarget;   // which version is shown in external window
  windowLang: LangType | null; // last lang used in external window (any version)
}

const initialState: ExternalWindowState = {
  lang: "en",
  isOpen: true,
  target: null,
  windowLang: null,
};

const externalWindowSlice = createSlice({
  name: "externalWindow",
  initialState,
  reducers: {
    // -------- language (main) --------
    toggleLang(state) {
      state.lang = state.lang === "en" ? "ar" : "en";
    },
    setLanguage(state, action: PayloadAction<LangType>) {
      state.lang = action.payload;
    },

    // -------- external window meta --------
    openExternalWindow(
      state,
      action: PayloadAction<{
        target: ExternalTarget;
        lang?: LangType;
      }>
    ) {
      state.isOpen = true;
      state.target = action.payload.target;
      if (action.payload.lang) {
        state.windowLang = action.payload.lang;
      }
    },

    setWindowLang(state, action: PayloadAction<LangType>) {
      state.windowLang = action.payload;
    },

    setWindowTarget(state, action: PayloadAction<ExternalTarget>) {
      state.target = action.payload;
    },

    closeExternalWindow(state) {
      state.isOpen = false;
      state.target = null;
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
