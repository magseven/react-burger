import { createAction } from '@reduxjs/toolkit';

export const connect = createAction<string, 'history-orders/connect'>(
  'history-orders/connect'
);
export const disconnect = createAction('history-orders/disconnect');
