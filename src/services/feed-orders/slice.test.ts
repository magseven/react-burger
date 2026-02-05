import { describe, it, expect, beforeEach } from 'vitest';

import { WebsocketStatus } from '../types';
import {
  feedSlice,
  initialState,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
} from './slice';

import type { TFeedList, TFeedRow } from '../types';

describe('Feed Slice', () => {
  const mockFeedRow1: TFeedRow = {
    _id: 'order-1',
    ingredients: ['ingredient-1', 'ingredient-2'],
    status: 'pending',
    statusFlag: false,
    name: 'Order 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1,
  };

  const mockFeedRow2: TFeedRow = {
    _id: 'order-2',
    ingredients: ['ingredient-3', 'ingredient-4'],
    status: 'done',
    statusFlag: true,
    name: 'Order 2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 2,
  };

  const mockFeedData: TFeedList = {
    orders: [mockFeedRow1, mockFeedRow2],
    total: 100,
    totalToday: 5,
  };

  const mockError = 'WebSocket connection failed';

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(initialState).toEqual({
        status: WebsocketStatus.OFFLINE,
        data: { orders: [], total: 0, totalToday: 0 },
        error: null,
      });
    });

    it('should match WebsocketStatus enum values', () => {
      expect(WebsocketStatus.OFFLINE).toBe('OFFLINE');
      expect(WebsocketStatus.CONNECTING).toBe('CONNECTING...');
      expect(WebsocketStatus.ONLINE).toBe('ONLINE');
    });
  });

  describe('reducers', () => {
    let state: typeof initialState;

    beforeEach(() => {
      state = { ...initialState };
    });

    describe('wsConnecting', () => {
      it('should set status to CONNECTING...', () => {
        const action = wsConnecting();
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.status).toBe(WebsocketStatus.CONNECTING);
        expect(nextState.error).toBeNull();
        expect(nextState.data).toEqual(initialState.data);
      });

      it('should reset error when connecting', () => {
        const errorState = {
          ...state,
          error: 'Previous error',
          status: WebsocketStatus.OFFLINE,
        };

        const action = wsConnecting();
        const nextState = feedSlice.reducer(errorState, action);

        expect(nextState.status).toBe(WebsocketStatus.CONNECTING);
        expect(nextState.error).toBeNull();
      });
    });

    describe('wsOpen', () => {
      it('should set status to ONLINE', () => {
        const action = wsOpen();
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.status).toBe(WebsocketStatus.ONLINE);
        expect(nextState.error).toBeNull();
        expect(nextState.data).toEqual(initialState.data);
      });

      it('should keep existing data when opening connection', () => {
        const stateWithData = {
          ...state,
          data: mockFeedData,
          status: WebsocketStatus.CONNECTING,
        };

        const action = wsOpen();
        const nextState = feedSlice.reducer(stateWithData, action);

        expect(nextState.status).toBe(WebsocketStatus.ONLINE);
        expect(nextState.data).toEqual(mockFeedData);
      });
    });

    describe('wsClose', () => {
      it('should set status to OFFLINE', () => {
        const onlineState = {
          ...state,
          status: WebsocketStatus.ONLINE,
        };

        const action = wsClose();
        const nextState = feedSlice.reducer(onlineState, action);

        expect(nextState.status).toBe(WebsocketStatus.OFFLINE);
        expect(nextState.error).toBeNull();
      });

      it('should preserve data when closing connection', () => {
        const stateWithData = {
          ...state,
          data: mockFeedData,
          status: WebsocketStatus.ONLINE,
        };

        const action = wsClose();
        const nextState = feedSlice.reducer(stateWithData, action);

        expect(nextState.status).toBe(WebsocketStatus.OFFLINE);
        expect(nextState.data).toEqual(mockFeedData);
      });
    });

    describe('wsError', () => {
      it('should set error message', () => {
        const action = wsError(mockError);
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.error).toBe(mockError);
        expect(nextState.status).toBe(WebsocketStatus.OFFLINE);
        expect(nextState.data).toEqual(initialState.data);
      });

      it('should overwrite existing error', () => {
        const stateWithError = {
          ...state,
          error: 'Old error',
        };

        const action = wsError(mockError);
        const nextState = feedSlice.reducer(stateWithError, action);

        expect(nextState.error).toBe(mockError);
      });

      it('should not change status or data on error', () => {
        const connectingState = {
          ...state,
          status: WebsocketStatus.CONNECTING,
          data: mockFeedData,
        };

        const action = wsError(mockError);
        const nextState = feedSlice.reducer(connectingState, action);

        expect(nextState.error).toBe(mockError);
        expect(nextState.status).toBe(WebsocketStatus.CONNECTING);
        expect(nextState.data).toEqual(mockFeedData);
      });
    });

    describe('wsMessage', () => {
      it('should update feed data', () => {
        const action = wsMessage(mockFeedData);
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.data).toEqual(mockFeedData);
        expect(nextState.status).toBe(WebsocketStatus.OFFLINE);
        expect(nextState.error).toBeNull();
      });

      it('should replace existing data', () => {
        const stateWithOldData = {
          ...state,
          data: {
            orders: [
              {
                _id: 'old-order',
                ingredients: [],
                status: 'pending',
                statusFlag: false,
                name: 'Old',
                createdAt: '',
                updatedAt: '',
                number: 0,
              },
            ],
            total: 10,
            totalToday: 1,
          },
          status: WebsocketStatus.ONLINE,
        };

        const action = wsMessage(mockFeedData);
        const nextState = feedSlice.reducer(stateWithOldData, action);

        expect(nextState.data).toEqual(mockFeedData);
        expect(nextState.data.orders).toHaveLength(2);
        expect(nextState.data.total).toBe(100);
        expect(nextState.data.totalToday).toBe(5);
        expect(nextState.status).toBe(WebsocketStatus.ONLINE);
      });

      it('should handle empty feed data', () => {
        const emptyFeedData: TFeedList = {
          orders: [],
          total: 0,
          totalToday: 0,
        };

        const action = wsMessage(emptyFeedData);
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.data.orders).toEqual([]);
        expect(nextState.data.total).toBe(0);
        expect(nextState.data.totalToday).toBe(0);
      });

      it('should handle feed data with statusFlag', () => {
        const feedWithStatusFlags: TFeedList = {
          orders: [
            {
              ...mockFeedRow1,
              statusFlag: true,
            },
            {
              ...mockFeedRow2,
              statusFlag: false,
            },
          ],
          total: 2,
          totalToday: 1,
        };

        const action = wsMessage(feedWithStatusFlags);
        const nextState = feedSlice.reducer(state, action);

        expect(nextState.data.orders[0].statusFlag).toBe(true);
        expect(nextState.data.orders[1].statusFlag).toBe(false);
      });
    });
  });

  describe('state transitions', () => {
    it('should transition through all connection states', () => {
      let state = initialState;

      state = feedSlice.reducer(state, wsConnecting());
      expect(state.status).toBe(WebsocketStatus.CONNECTING);
      expect(state.error).toBeNull();

      state = feedSlice.reducer(state, wsOpen());
      expect(state.status).toBe(WebsocketStatus.ONLINE);

      state = feedSlice.reducer(state, wsMessage(mockFeedData));
      expect(state.data).toEqual(mockFeedData);
      expect(state.status).toBe(WebsocketStatus.ONLINE);

      state = feedSlice.reducer(state, wsError('Some error'));
      expect(state.error).toBe('Some error');
      expect(state.status).toBe(WebsocketStatus.ONLINE);

      state = feedSlice.reducer(state, wsClose());
      expect(state.status).toBe(WebsocketStatus.OFFLINE);
      expect(state.data).toEqual(mockFeedData); // Данные сохраняются
    });
  });
});
