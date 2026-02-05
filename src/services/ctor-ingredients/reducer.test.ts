import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  ctorSlice,
  initialState,
  addBun,
  addIngredient,
  deleteIngredient,
  clearOrder,
} from './reducer';

import type { TIngredient } from '../../utils/types';

let nanoidCounter = 0;
vi.mock('@reduxjs/toolkit', async () => {
  const actual = await vi.importActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: vi.fn(() => `test-id-${++nanoidCounter}`),
  };
});

describe('Constructor Slice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url',
    __v: 0,
  };

  const mockIngredient1: TIngredient = {
    _id: 'ingredient-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url',
    __v: 0,
  };

  const mockIngredient2: TIngredient = {
    _id: 'ingredient-2',
    name: 'Мясо бессмертных моллюсков',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url',
    __v: 0,
  };

  beforeEach(() => {
    nanoidCounter = 0;
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(initialState).toEqual({
        bun: null,
        ingredients: [],
      });
    });
  });

  describe('reducers', () => {
    it('should handle addBun', () => {
      const action = addBun(mockBun);
      const nextState = ctorSlice.reducer(initialState, action);

      expect(nextState.bun).toEqual(mockBun);
      expect(nextState.ingredients).toEqual([]);
    });

    it('should handle addIngredient with nanoid', () => {
      const action = addIngredient(mockIngredient1);
      const nextState = ctorSlice.reducer(initialState, action);

      expect(nextState.ingredients).toHaveLength(1);
      expect(nextState.ingredients[0]).toEqual({
        ...mockIngredient1,
        id: 'test-id-1',
      });
    });

    it('should handle multiple addIngredient calls', () => {
      const action1 = addIngredient(mockIngredient1);
      const state1 = ctorSlice.reducer(initialState, action1);

      const action2 = addIngredient(mockIngredient2);
      const state2 = ctorSlice.reducer(state1, action2);

      expect(state2.ingredients).toHaveLength(2);
      expect(state2.ingredients[0].id).toBe('test-id-1');
      expect(state2.ingredients[1].id).toBe('test-id-2');
    });

    it('should handle deleteIngredient', () => {
      const addAction = addIngredient(mockIngredient1);
      let state = ctorSlice.reducer(initialState, addAction);
      const ingredientId = state.ingredients[0].id!;

      const deleteAction = deleteIngredient(ingredientId);
      state = ctorSlice.reducer(state, deleteAction);

      expect(state.ingredients).toHaveLength(0);
    });

    it('should not delete ingredient when id not found', () => {
      const addAction = addIngredient(mockIngredient1);
      let state = ctorSlice.reducer(initialState, addAction);

      const deleteAction = deleteIngredient('non-existent-id');
      state = ctorSlice.reducer(state, deleteAction);

      expect(state.ingredients).toHaveLength(1);
    });

    it('should handle clearOrder', () => {
      let state = ctorSlice.reducer(initialState, addBun(mockBun));
      state = ctorSlice.reducer(state, addIngredient(mockIngredient1));
      state = ctorSlice.reducer(state, addIngredient(mockIngredient2));

      const clearAction = clearOrder();
      state = ctorSlice.reducer(state, clearAction);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
