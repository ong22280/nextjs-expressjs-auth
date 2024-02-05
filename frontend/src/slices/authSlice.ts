"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";

const initialState: AuthApiState = {
  token: null,
  basicUserInfo:
    typeof window !== "undefined" && localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo") as string)
      : null,
  userProfileData: undefined,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "login",
  async (data: User, { rejectWithValue }) => {
    try {
      const { data: response } = await axiosInstance.post("/login", data);
      // extract the token from the response
      const token = response.access_token;
      // save the token in the local storage
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(token));
      getUser();
      return token;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;
        return rejectWithValue(errorResponse);
      }
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "register",
  async (data: NewUser, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/register", data);
      const resData = response.data;

      localStorage.setItem("userInfo", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/logout", {});
      const resData = response.data;

      localStorage.removeItem("userInfo");

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const getUser = createAsyncThunk("users/profile", async () => {
  try {
    const { data: user } = await axiosInstance.get(`/users/me`);
    return user;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Login failed";
        } else {
          state.error = action.error.message || "Login failed";
        }
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Registration failed";
        } else {
          state.error = action.error.message || "Registration failed";
        }
      })

      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "idle";
        state.basicUserInfo = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Logout failed";
        } else {
          state.error = action.error.message || "Logout failed";
        }
      })

      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.userProfileData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message ||
            "Get user profile data failed";
        } else {
          state.error = action.error.message || "Get user profile data failed";
        }
      });
  },
});

export default authSlice.reducer;
