import { createSlice } from '@reduxjs/toolkit';

import { WebsocketStatus } from '../types.ts';

import type { TFeedList } from '../types.ts';
import type { PayloadAction } from '@reduxjs/toolkit';

type FeedStore = {
  status: WebsocketStatus;
  data: TFeedList;
  error: string | null;
};

export const initialState: FeedStore = {
  status: WebsocketStatus.OFFLINE,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
};

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  selectors: {
    selectFeed: (state) => state.data,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },
  reducers: {
    wsConnecting: (state) => {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsOpen: (state) => {
      state.status = WebsocketStatus.ONLINE;
    },
    wsClose: (state) => {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsMessage: (state, action: PayloadAction<TFeedList>) => {
      state.data = action.payload;
    },
  },
});

export const { wsConnecting, wsClose, wsError, wsOpen, wsMessage } = feedSlice.actions;
export const { selectFeed, selectStatus, selectError } = feedSlice.selectors;
