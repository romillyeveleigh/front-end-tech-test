"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { tradesApi } from "./api/tradesApi";
import uiReducer from "./slices/uiSlice";

const rootReducer = combineReducers({
  ui: uiReducer,
  [tradesApi.reducerPath]: tradesApi.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "yantra-root",
    storage,
    whitelist: ["ui"],
    version: 1,
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(tradesApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
