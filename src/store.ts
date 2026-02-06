// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import externalWindowReducer from "./Redux/externalWindowSlice";
import funcReducer from "./Redux/funcSlice"
export const store = configureStore({
  reducer: {
    externalWindow: externalWindowReducer,
     func: funcReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
