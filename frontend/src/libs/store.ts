import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import notificationReducer from "../slices/notificationSlice";
import { axiosMiddleware } from "../api/middleware";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      notification: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(axiosMiddleware),
  });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
