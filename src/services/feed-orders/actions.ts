import { createAction } from '@reduxjs/toolkit';

export const connect = createAction<string, 'feed-orders/connect'>(
  'feed-orders/connect'
);
export const disconnect = createAction('feed-orders/disconnect');
