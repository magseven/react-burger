// orderModalSlice.test.ts
import { describe, it, expect } from 'vitest';

import { orderModalSlice, openOrderModal, closeOrderModal } from './orderModalSlice';

describe('Order Modal Slice', () => {
  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = orderModalSlice.reducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        isOpen: false,
        orderNumber: null,
      });
    });
  });

  describe('reducers', () => {
    it('should handle openOrderModal', () => {
      const action = openOrderModal(12345);
      const state = orderModalSlice.reducer(undefined, action);

      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(12345);
    });

    it('should handle openOrderModal with zero order number', () => {
      const action = openOrderModal(0);
      const state = orderModalSlice.reducer(undefined, action);

      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(0);
    });

    it('should handle openOrderModal with negative order number', () => {
      const action = openOrderModal(-1);
      const state = orderModalSlice.reducer(undefined, action);

      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(-1);
    });

    it('should replace existing order number when opening modal again', () => {
      let state = orderModalSlice.reducer(undefined, openOrderModal(12345));
      expect(state.orderNumber).toBe(12345);

      state = orderModalSlice.reducer(state, openOrderModal(67890));
      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(67890);
    });

    it('should handle closeOrderModal when modal is open', () => {
      const openState = {
        isOpen: true,
        orderNumber: 12345,
      };

      const action = closeOrderModal();
      const state = orderModalSlice.reducer(openState, action);

      expect(state.isOpen).toBe(false);
      expect(state.orderNumber).toBeNull();
    });

    it('should handle closeOrderModal when modal is already closed', () => {
      const closedState = {
        isOpen: false,
        orderNumber: null,
      };

      const action = closeOrderModal();
      const state = orderModalSlice.reducer(closedState, action);

      expect(state.isOpen).toBe(false);
      expect(state.orderNumber).toBeNull();
    });

    it('should handle full open/close cycle', () => {
      let state = orderModalSlice.reducer(undefined, { type: '@@INIT' });
      expect(state.isOpen).toBe(false);
      expect(state.orderNumber).toBeNull();

      // Open
      state = orderModalSlice.reducer(state, openOrderModal(12345));
      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(12345);

      // Close
      state = orderModalSlice.reducer(state, closeOrderModal());
      expect(state.isOpen).toBe(false);
      expect(state.orderNumber).toBeNull();

      // Open again with different number
      state = orderModalSlice.reducer(state, openOrderModal(67890));
      expect(state.isOpen).toBe(true);
      expect(state.orderNumber).toBe(67890);
    });
  });
});
