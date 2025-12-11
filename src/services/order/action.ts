import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrderRequest, TOrderResponse } from './types';

export const postOrder = createAsyncThunk<
  TOrderResponse,
  TOrderRequest,
  { rejectValue: string }
>('orders/postOrder', async (orderData: TOrderRequest, { rejectWithValue }) => {
  try {
    const response = await api.postOrder(orderData);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка при создании заказа'
    );
  }
});
