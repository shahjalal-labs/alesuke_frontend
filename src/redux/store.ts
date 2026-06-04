import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminAuth from "./ReduxFunction";
import profileSetupReducer from "./profileSetupSlice";
import familyReducer from './familySlice';
import baseApi from "./api/baseApi";

// 🔐 Persist configuration for authentication
const authPersistConfig = {
  key: "auth",
  storage,
};

const profileSetupPersistConfig = {
  key: "profileSetup",
  storage,
};

// 🛍 Persist configuration for cart

const persistedAuthReducer = persistReducer(authPersistConfig, adminAuth);
const persistedProfileSetupReducer = persistReducer(profileSetupPersistConfig, profileSetupReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profileSetup: persistedProfileSetupReducer,
    family: familyReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// ⚡ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
