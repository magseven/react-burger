import { describe, it, expect } from 'vitest';

import { WebsocketStatus } from '../types.ts';
import {
  historySlice,
  initialState,
  wsHistoryConnecting,
  wsHistoryOpen,
  wsHistoryClose,
  wsHistoryError,
  wsHistoryMessage,
} from './slice';

import type { TFeedList } from '../types.ts';

describe('historySlice', () => {
  it('should return the initial state', () => {
    expect(historySlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle wsHistoryConnecting', () => {
    const nextState = historySlice.reducer(initialState, wsHistoryConnecting());
    expect(nextState.status).toBe(WebsocketStatus.CONNECTING);
  });

  it('should handle wsHistoryOpen', () => {
    const nextState = historySlice.reducer(initialState, wsHistoryOpen());
    expect(nextState.status).toBe(WebsocketStatus.ONLINE);
  });

  it('should handle wsHistoryClose', () => {
    const nextState = historySlice.reducer(
      { ...initialState, status: WebsocketStatus.ONLINE },
      wsHistoryClose()
    );
    expect(nextState.status).toBe(WebsocketStatus.OFFLINE);
  });

  it('should handle wsHistoryError', () => {
    const errorMessage = 'Some error';
    const nextState = historySlice.reducer(initialState, wsHistoryError(errorMessage));
    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle wsHistoryMessage', () => {
    const payload: TFeedList = {
      orders: [
        {
          _id: 'abc123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ingredients: ['ingredient1', 'ingredient2'],
          name: 'Test Order',
          number: 1001,
          status: 'done',
          statusFlag: true,
        },
      ],
      total: 1,
      totalToday: 0,
    };

    const nextState = historySlice.reducer(initialState, wsHistoryMessage(payload));
    expect(nextState.data).toEqual(payload);
  });
});
