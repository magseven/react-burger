import { describe, it, expect } from 'vitest';

import { getOrder, postOrder } from './action';
import { orderSlice, resetOrder, clearOrderError } from './reducer';

import type { TOrderResponse, TOrderSummary, TOrderSummaryResponse } from './types';

describe('Order Slice', () => {
  const mockOrderResponse: TOrderResponse = {
    success: true,
    name: 'Space флюоресцентный бургер',
    order: {
      createdAt: '2024-01-01T00:00:00.000Z',
      ingredients: ['ingredient-1', 'ingredient-2'],
      name: 'Space флюоресцентный бургер',
      number: 12345,
    },
    _id: 'order-id-123',
    owner: {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    status: 'done',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    price: 2055,
  };

  const mockOrderSummary: TOrderSummary = {
    _id: 'order-id-123',
    ingredients: ['ingredient-1', 'ingredient-2'],
    owner: 'user-id-123',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    __v: 0,
  };

  const mockOrderSummaryResponse: TOrderSummaryResponse = {
    success: true,
    orders: [mockOrderSummary],
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = orderSlice.reducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        data: null,
        status: 'idle',
        error: null,
        summaryOrder: undefined,
      });
    });
  });

  describe('reducers', () => {
    describe('resetOrder', () => {
      it('should reset state to initial values', () => {
        const state = {
          data: mockOrderResponse,
          status: 'succeeded' as const,
          error: 'Some error',
          summaryOrder: mockOrderSummary,
        };

        const nextState = orderSlice.reducer(state, resetOrder());

        expect(nextState).toEqual({
          data: null,
          status: 'idle',
          error: null,
          summaryOrder: undefined,
        });
      });

      it('should reset state when already idle', () => {
        const state = {
          data: null,
          status: 'idle' as const,
          error: null,
          summaryOrder: undefined,
        };

        const nextState = orderSlice.reducer(state, resetOrder());

        expect(nextState).toEqual(state);
      });
    });

    describe('clearOrderError', () => {
      it('should clear error while keeping other state', () => {
        const state = {
          data: mockOrderResponse,
          status: 'failed' as const,
          error: 'Network error',
          summaryOrder: mockOrderSummary,
        };

        const nextState = orderSlice.reducer(state, clearOrderError());

        expect(nextState.error).toBeNull();
        expect(nextState.data).toBe(mockOrderResponse);
        expect(nextState.status).toBe('failed');
        expect(nextState.summaryOrder).toBe(mockOrderSummary);
      });

      it('should do nothing when error is already null', () => {
        const state = {
          data: null,
          status: 'idle' as const,
          error: null,
          summaryOrder: undefined,
        };

        const nextState = orderSlice.reducer(state, clearOrderError());

        expect(nextState).toEqual(state);
      });
    });
  });

  describe('extraReducers', () => {
    describe('postOrder', () => {
      it('should handle postOrder.pending', () => {
        const initialState = {
          data: null,
          status: 'idle' as const,
          error: 'Previous error',
          summaryOrder: undefined,
        };

        const action = { type: postOrder.pending.type };
        const state = orderSlice.reducer(initialState, action);

        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
        expect(state.data).toBeNull();
        expect(state.summaryOrder).toBeUndefined();
      });

      it('should handle postOrder.fulfilled', () => {
        const initialState = {
          data: null,
          status: 'loading' as const,
          error: null,
          summaryOrder: undefined,
        };

        const action = {
          type: postOrder.fulfilled.type,
          payload: mockOrderResponse,
        };
        const state = orderSlice.reducer(initialState, action);

        expect(state.status).toBe('succeeded');
        expect(state.data).toEqual(mockOrderResponse);
        expect(state.error).toBeNull();
        expect(state.summaryOrder).toBeUndefined();
      });

      describe('postOrder.rejected', () => {
        it('should handle rejection with payload', () => {
          const initialState = {
            data: mockOrderResponse,
            status: 'loading' as const,
            error: null,
            summaryOrder: mockOrderSummary,
          };

          const action = {
            type: postOrder.rejected.type,
            payload: 'Insufficient ingredients',
          };
          const state = orderSlice.reducer(initialState, action);

          expect(state.status).toBe('failed');
          expect(state.error).toBe('Insufficient ingredients');
          expect(state.data).toBeNull();
          expect(state.summaryOrder).toBe(mockOrderSummary);
        });

        it('should handle rejection without payload', () => {
          const initialState = {
            data: mockOrderResponse,
            status: 'loading' as const,
            error: null,
            summaryOrder: mockOrderSummary,
          };

          const action = {
            type: postOrder.rejected.type,
            payload: undefined,
          };
          const state = orderSlice.reducer(initialState, action);

          expect(state.status).toBe('failed');
          expect(state.error).toBe('Ошибка при создании заказа');
          expect(state.data).toBeNull();
          expect(state.summaryOrder).toBe(mockOrderSummary);
        });
      });
    });

    describe('getOrder', () => {
      it('should handle getOrder.fulfilled', () => {
        const initialState = {
          data: mockOrderResponse,
          status: 'succeeded' as const,
          error: null,
          summaryOrder: undefined,
        };

        const action = {
          type: getOrder.fulfilled.type,
          payload: mockOrderSummaryResponse,
        };
        const state = orderSlice.reducer(initialState, action);

        expect(state.summaryOrder).toEqual(mockOrderSummary);
        expect(state.data).toBe(mockOrderResponse);
        expect(state.status).toBe('succeeded');
        expect(state.error).toBeNull();
      });

      it('should handle getOrder.fulfilled with empty orders array', () => {
        const initialState = {
          data: null,
          status: 'idle' as const,
          error: null,
          summaryOrder: mockOrderSummary,
        };

        const action = {
          type: getOrder.fulfilled.type,
          payload: { success: true, orders: [] },
        };
        const state = orderSlice.reducer(initialState, action);

        expect(state.summaryOrder).toBeUndefined();
      });

      it('should handle getOrder.rejected', () => {
        const initialState = {
          data: null,
          status: 'idle' as const,
          error: null,
          summaryOrder: mockOrderSummary,
        };

        const action = { type: getOrder.rejected.type };
        const state = orderSlice.reducer(initialState, action);

        expect(state.summaryOrder).toBeUndefined();
        expect(state.data).toBeNull();
        expect(state.status).toBe('idle');
        expect(state.error).toBeNull();
      });
    });
  });

  describe('state transitions', () => {
    it('should handle full order creation flow', () => {
      let state = orderSlice.reducer(undefined, { type: '@@INIT' });
      expect(state.status).toBe('idle');
      expect(state.data).toBeNull();

      // Start creating order
      state = orderSlice.reducer(state, { type: postOrder.pending.type });
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();

      // Order created successfully
      state = orderSlice.reducer(state, {
        type: postOrder.fulfilled.type,
        payload: mockOrderResponse,
      });
      expect(state.status).toBe('succeeded');
      expect(state.data).toEqual(mockOrderResponse);

      // Get order summary
      state = orderSlice.reducer(state, {
        type: getOrder.fulfilled.type,
        payload: mockOrderSummaryResponse,
      });
      expect(state.summaryOrder).toEqual(mockOrderSummary);

      // Reset order state
      state = orderSlice.reducer(state, resetOrder());
      expect(state.status).toBe('idle');
      expect(state.data).toBeNull();
      expect(state.summaryOrder).toBeUndefined();
    });

    it('should handle order creation failure flow', () => {
      let state = orderSlice.reducer(undefined, { type: '@@INIT' });

      // Start creating order
      state = orderSlice.reducer(state, { type: postOrder.pending.type });
      expect(state.status).toBe('loading');

      // Order creation fails
      state = orderSlice.reducer(state, {
        type: postOrder.rejected.type,
        payload: 'Payment failed',
      });
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Payment failed');
      expect(state.data).toBeNull();

      // Clear error
      state = orderSlice.reducer(state, clearOrderError());
      expect(state.status).toBe('failed');
      expect(state.error).toBeNull();

      // Reset and try again
      state = orderSlice.reducer(state, resetOrder());
      expect(state.status).toBe('idle');
    });
  });
});
