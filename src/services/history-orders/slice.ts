import { createSlice } from '@reduxjs/toolkit';

import { WebsocketStatus } from '../types.ts';

import type { TFeedList } from '../types.ts';
import type { PayloadAction } from '@reduxjs/toolkit';

type HistoryStore = {
  status: WebsocketStatus;
  data: TFeedList;
  error: string | null;
};

export const initialState: HistoryStore = {
  status: WebsocketStatus.OFFLINE,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
};

export const historySlice = createSlice({
  name: 'historySlice',
  initialState,
  selectors: {
    selectHistory: (state) => state.data,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },
  reducers: {
    wsHistoryConnecting: (state) => {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsHistoryOpen: (state) => {
      state.status = WebsocketStatus.ONLINE;
    },
    wsHistoryClose: (state) => {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsHistoryError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsHistoryMessage: (state, action: PayloadAction<TFeedList>) => {
      state.data = action.payload;
    },
  },
});

export const {
  wsHistoryConnecting,
  wsHistoryOpen,
  wsHistoryError,
  wsHistoryClose,
  wsHistoryMessage,
} = historySlice.actions;
export const { selectHistory, selectStatus, selectError } = historySlice.selectors;
