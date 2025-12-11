import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../utils/api';

export const getIngredients = createAsyncThunk(
  'ingredients',
  async (_, { rejectWithValue }) => {
    try {
      return api.getIngredients();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при загрузке ингредиентов');
    }
  }
);
