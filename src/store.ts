// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import externalWindowReducer from "./Redux/externalWindowSlice";

export const store = configureStore({
  reducer: {
    externalWindow: externalWindowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
