// userSlice.test.ts
import { describe, it, expect } from 'vitest';

import { login, logout, register, userPatch } from './action';
import { userSlice, setIsAuthChecked, setUser } from './reducer';

describe('User Slice', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockUpdatedUser = {
    name: 'Updated User',
    email: 'updated@example.com',
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = userSlice.reducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
      });
    });
  });

  describe('reducers', () => {
    describe('setIsAuthChecked', () => {
      it('should set isAuthChecked to true', () => {
        const state = { user: null, isAuthChecked: false };
        const action = setIsAuthChecked(true);
        const nextState = userSlice.reducer(state, action);

        expect(nextState.isAuthChecked).toBe(true);
        expect(nextState.user).toBeNull();
      });

      it('should set isAuthChecked to false', () => {
        const state = { user: mockUser, isAuthChecked: true };
        const action = setIsAuthChecked(false);
        const nextState = userSlice.reducer(state, action);

        expect(nextState.isAuthChecked).toBe(false);
        expect(nextState.user).toEqual(mockUser);
      });
    });

    describe('setUser', () => {
      it('should set user when user is null', () => {
        const state = { user: null, isAuthChecked: false };
        const action = setUser(mockUser);
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(false);
      });

      it('should update existing user', () => {
        const state = { user: mockUser, isAuthChecked: true };
        const action = setUser(mockUpdatedUser);
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUpdatedUser);
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should clear user when set to null', () => {
        const state = { user: mockUser, isAuthChecked: true };
        const action = setUser(null);
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });
    });
  });

  describe('extraReducers', () => {
    describe('login.fulfilled', () => {
      it('should set user and mark auth as checked', () => {
        const state = { user: null, isAuthChecked: false };
        const action = {
          type: login.fulfilled.type,
          payload: mockUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should replace existing user on login', () => {
        const oldUser = { name: 'Old User', email: 'old@example.com' };
        const state = { user: oldUser, isAuthChecked: true };
        const action = {
          type: login.fulfilled.type,
          payload: mockUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(true);
      });
    });

    describe('logout.fulfilled', () => {
      it('should clear user', () => {
        const state = { user: mockUser, isAuthChecked: true };
        const action = { type: logout.fulfilled.type };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should handle logout when user is already null', () => {
        const state = { user: null, isAuthChecked: true };
        const action = { type: logout.fulfilled.type };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });
    });

    describe('register.fulfilled', () => {
      it('should set user and mark auth as checked', () => {
        const state = { user: null, isAuthChecked: false };
        const action = {
          type: register.fulfilled.type,
          payload: mockUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should replace existing user on register', () => {
        const oldUser = { name: 'Old User', email: 'old@example.com' };
        const state = { user: oldUser, isAuthChecked: true };
        const action = {
          type: register.fulfilled.type,
          payload: mockUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(true);
      });
    });

    describe('userPatch.fulfilled', () => {
      it('should update user and mark auth as checked', () => {
        const state = { user: mockUser, isAuthChecked: true };
        const action = {
          type: userPatch.fulfilled.type,
          payload: mockUpdatedUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUpdatedUser);
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should set user when userPatch on null user', () => {
        const state = { user: null, isAuthChecked: false };
        const action = {
          type: userPatch.fulfilled.type,
          payload: mockUser,
        };
        const nextState = userSlice.reducer(state, action);

        expect(nextState.user).toEqual(mockUser);
        expect(nextState.isAuthChecked).toBe(true);
      });
    });
  });

  describe('state transitions', () => {
    it('should handle full auth flow', () => {
      let state = userSlice.reducer(undefined, { type: '@@INIT' });
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);

      // Register
      state = userSlice.reducer(state, {
        type: register.fulfilled.type,
        payload: mockUser,
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // Update user
      state = userSlice.reducer(state, {
        type: userPatch.fulfilled.type,
        payload: mockUpdatedUser,
      });
      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.isAuthChecked).toBe(true);

      // Manual set
      state = userSlice.reducer(state, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // Logout
      state = userSlice.reducer(state, { type: logout.fulfilled.type });
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);

      // Login again
      state = userSlice.reducer(state, {
        type: login.fulfilled.type,
        payload: mockUpdatedUser,
      });
      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle manual auth state management', () => {
      let state = userSlice.reducer(undefined, { type: '@@INIT' });

      // Manual set user without auth check
      state = userSlice.reducer(state, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(false);

      // Manual auth check
      state = userSlice.reducer(state, setIsAuthChecked(true));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // Clear user
      state = userSlice.reducer(state, setUser(null));
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);

      // Reset auth check
      state = userSlice.reducer(state, setIsAuthChecked(false));
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);
    });
  });
});
