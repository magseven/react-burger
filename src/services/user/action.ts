import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../utils/api';
import { setIsAuthChecked, setUser } from './reducer';

export const login = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const res = await api.login(data);
    return res.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  return await api.logout();
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (api.isTokenExists()) {
      try {
        const response = await api.getUser();
        dispatch(setUser(response.user));
      } catch (error) {
        console.error('Failed to get user:', error);
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: { name: string; email: string; password: string }) => {
    const res = await api.register(data);
    return res.user;
  }
);

export const passwordForgot = createAsyncThunk(
  'user/passwordForgot',
  async (data: { email: string }) => {
    const res = await api.passwordReset(data);
    return res.user;
  }
);

export const passwordReset = createAsyncThunk(
  'user/passwordReset2',
  async (data: { password: string; code: string }) => {
    const res = await api.passwordReset2(data);
    return res.user;
  }
);

export const userPatch = createAsyncThunk(
  'user/patch',
  async (data: { name: string; email: string; password: string }) => {
    const res = await api.userPatch(data);
    return res.user;
  }
);
