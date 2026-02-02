import { combineSlices, configureStore as configureStoreRTK } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { ctorSlice } from './ctor-ingredients/reducer';
import { connect, disconnect } from './feed-orders/actions';
import {
  feedSlice,
  wsClose,
  wsConnecting,
  wsError,
  wsMessage,
  wsOpen,
} from './feed-orders/slice';
import {
  connect as hconnect,
  disconnect as hdisconnect,
} from './history-orders/actions';
import {
  historySlice,
  wsHistoryClose,
  wsHistoryConnecting,
  wsHistoryError,
  wsHistoryMessage,
  wsHistoryOpen,
} from './history-orders/slice';
import { ingredientDetailsSlice } from './ingredient-details/reducer';
import { ingredientsSlice } from './ingredients/reducer';
import { socketMiddleware } from './middleware/socket-middleware';
import { orderModalSlice } from './order/orderModalSlice';
import { orderSlice } from './order/reducer';
import { userSlice } from './user/reducer';

import type { AppDispatch } from './types';

export const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientDetailsSlice,
  ctorSlice,
  orderModalSlice,
  userSlice,
  orderSlice,
  feedSlice,
  historySlice
);

const feedMiddleware = socketMiddleware({
  connect,
  disconnect,
  onConnecting: wsConnecting,
  onClose: wsClose,
  onOpen: wsOpen,
  onError: wsError,
  onMessage: wsMessage,
});

const historyMiddleware = socketMiddleware(
  {
    connect: hconnect,
    disconnect: hdisconnect,
    onConnecting: wsHistoryConnecting,
    onClose: wsHistoryClose,
    onOpen: wsHistoryOpen,
    onError: wsHistoryError,
    onMessage: wsHistoryMessage,
  },
  true
);

export const store = configureStoreRTK({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, historyMiddleware),
});

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: typeof useSelector = useSelector;

export type RootState = ReturnType<typeof rootReducer>;
