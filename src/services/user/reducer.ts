import { createSlice } from '@reduxjs/toolkit';

import { login, logout, register, userPatch } from './action';

import type { PayloadAction } from '@reduxjs/toolkit';

type User = {
  name: string;
  email: string;
};

type UserState = {
  user: User | null;
  isAuthChecked: boolean;
};
const initialState: UserState = {
  user: null,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(userPatch.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      });
  },
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const { selectIsAuthChecked, selectUser } = userSlice.selectors;
