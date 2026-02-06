import { describe, it, expect } from 'vitest';

import { ingredientDetailsSlice, selectIngredient, clearIngredient } from './reducer';

describe('Ingredient Details Slice', () => {
  const initialState = {
    selectedId: null,
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = ingredientDetailsSlice.reducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle selectIngredient', () => {
      const action = selectIngredient('ingredient-123');
      const state = ingredientDetailsSlice.reducer(undefined, { type: '@@INIT' });
      const nextState = ingredientDetailsSlice.reducer(state, action);

      expect(nextState.selectedId).toBe('ingredient-123');
      expect(state.selectedId).toBeNull(); // исходное состояние не изменилось
    });

    it('should handle clearIngredient', () => {
      const stateWithSelected = {
        selectedId: 'ingredient-123',
      };

      const action = clearIngredient();
      const nextState = ingredientDetailsSlice.reducer(stateWithSelected, action);

      expect(nextState.selectedId).toBeNull();
    });

    it('should clear already null ingredient', () => {
      const action = clearIngredient();
      const state = ingredientDetailsSlice.reducer(undefined, { type: '@@INIT' });
      const nextState = ingredientDetailsSlice.reducer(state, action);

      expect(nextState.selectedId).toBeNull();
    });
  });
});
