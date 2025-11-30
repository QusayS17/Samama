// src/Redux/Language/LanguageSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Lang = "en" | "ar";

type LanguageState = {
  lang: Lang;
};

const initialState: LanguageState = {
  lang: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<Lang>) {
      state.lang = action.payload;
    },
    toggleLang(state) {
      state.lang = state.lang === "en" ? "ar" : "en";
    },
  },
});

export const { setLang, toggleLang } = languageSlice.actions;
export default languageSlice.reducer;
