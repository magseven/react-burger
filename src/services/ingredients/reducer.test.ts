import { describe, it, expect } from 'vitest';

import { getIngredients } from './action';
import { ingredientsReducer } from './reducer';

import type { TIngredient } from '@/utils/types';

describe('Ingredients Slice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image-url-1',
      image_mobile: 'image-mobile-url-1',
      image_large: 'image-large-url-1',
      __v: 0,
    },
    {
      _id: 'ingredient-2',
      name: 'Соус',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'image-url-2',
      image_mobile: 'image-mobile-url-2',
      image_large: 'image-large-url-2',
      __v: 0,
    },
  ];

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = ingredientsReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        data: [],
        loading: false,
        error: null,
      });
    });
  });

  describe('extraReducers', () => {
    describe('getIngredients.pending', () => {
      it('should set loading to true and clear error', () => {
        const initialState = { data: [], loading: false, error: 'Previous error' };
        const action = { type: getIngredients.pending.type };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.data).toEqual([]);
      });
    });

    describe('getIngredients.fulfilled', () => {
      it('should set loading to false and update data', () => {
        const initialState = { data: [], loading: true, error: null };
        const action = {
          type: getIngredients.fulfilled.type,
          payload: mockIngredients,
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.data).toEqual(mockIngredients);
        expect(state.error).toBeNull();
      });

      it('should replace existing data', () => {
        const oldIngredient: TIngredient = {
          _id: 'old',
          name: 'Old',
          type: 'main',
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          price: 0,
          image: '',
          image_mobile: '',
          image_large: '',
          __v: 0,
        };
        const initialState = { data: [oldIngredient], loading: true, error: null };
        const action = {
          type: getIngredients.fulfilled.type,
          payload: mockIngredients,
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.data).toEqual(mockIngredients);
        expect(state.data).toHaveLength(2);
      });
    });

    // В тесте (reducer.test.ts)
    describe('getIngredients.rejected', () => {
      it('should set loading to false and set error from payload', () => {
        const initialState = { data: [], loading: true, error: null };
        const action = {
          type: getIngredients.rejected.type,
          payload: 'Network error',
          // Добавляем error для соответствия типу
          error: undefined,
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
        expect(state.data).toEqual([]);
      });

      it('should use error.message if no payload', () => {
        const initialState = { data: [], loading: true, error: null };
        const action = {
          type: getIngredients.rejected.type,
          payload: undefined,
          error: { message: 'Timeout error' },
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Timeout error');
      });

      it('should use default error message if no payload or error.message', () => {
        const initialState = { data: [], loading: true, error: null };
        const action = {
          type: getIngredients.rejected.type,
          payload: undefined,
          error: undefined, // или error: { message: undefined }
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Ошибка');
      });

      it('should use default error message if error.message is undefined', () => {
        const initialState = { data: [], loading: true, error: null };
        const action = {
          type: getIngredients.rejected.type,
          payload: undefined,
          error: { message: undefined },
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Ошибка');
      });
    });
  });
});
