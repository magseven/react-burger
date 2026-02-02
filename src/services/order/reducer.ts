import { createSlice, createSelector } from '@reduxjs/toolkit';

import { getOrder, postOrder } from './action';

import type { RootState } from '../types';
import type { TOrderResponse, TOrderSummary, TOrderSummaryResponse } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

type OrderStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type OrderState = {
  data: TOrderResponse | null;
  status: OrderStatus;
  error: string | null;
  summaryOrder: TOrderSummary | undefined;
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    data: null as TOrderResponse | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    summaryOrder: undefined as TOrderSummary | undefined,
  },
  reducers: {
    resetOrder: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action: PayloadAction<TOrderResponse>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Ошибка при создании заказа';
        state.data = null;
      })
      .addCase(
        getOrder.fulfilled,
        (state, action: PayloadAction<TOrderSummaryResponse>) => {
          state.summaryOrder = action.payload.orders[0];
        }
      )
      .addCase(getOrder.rejected, (state) => {
        state.summaryOrder = undefined;
      });
  },
});

export const selectOrderState = (state: RootState): OrderState => state.order;

export const selectOrderStatus = createSelector(
  [selectOrderState],
  (orderState): OrderStatus => orderState.status
);

export const selectIsOrderLoading = createSelector(
  [selectOrderStatus],
  (status): boolean => status === 'loading'
);

export const selectIsOrderSuccess = createSelector(
  [selectOrderStatus],
  (status): boolean => status === 'succeeded'
);

export const selectIsOrderFailed = createSelector(
  [selectOrderStatus],
  (status): boolean => status === 'failed'
);

export const selectGetOrderSummary = createSelector(
  [selectOrderState],
  (orderState): TOrderSummary | undefined => orderState.summaryOrder
);

export const { resetOrder, clearOrderError } = orderSlice.actions;
