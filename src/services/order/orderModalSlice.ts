import { createSlice } from '@reduxjs/toolkit';

import type { OrderModalState } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: OrderModalState = {
  isOpen: false,
  orderNumber: null,
};

export const orderModalSlice = createSlice({
  name: 'orderModal',
  initialState,
  reducers: {
    openOrderModal: (state, action: PayloadAction<number>) => {
      state.isOpen = true;
      state.orderNumber = action.payload;
    },
    closeOrderModal: (state) => {
      state.isOpen = false;
      state.orderNumber = null;
    },
  },
  selectors: {
    selectOrderIsOpen: (state) => state.isOpen,
    selectOrderNumber: (state) => state.orderNumber,
  },
});

export const { openOrderModal, closeOrderModal } = orderModalSlice.actions;
export const { selectOrderIsOpen, selectOrderNumber } = orderModalSlice.selectors;
