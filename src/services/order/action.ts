import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrderRequest, TOrderResponse, TOrderSummaryResponse } from './types';

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

export const getOrder = createAsyncThunk<
  TOrderSummaryResponse,
  string,
  { rejectValue: string }
>('orders/getOrder', async (number: string, { rejectWithValue }) => {
  try {
    const response = await api.getOrder(number);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки заказа'
    );
  }
});
