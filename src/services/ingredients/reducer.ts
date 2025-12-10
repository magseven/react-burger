import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getIngredients } from './action';

import type { RootState } from '../types';
import type { TTab } from '@/components/burger-ingredients/types';
import type { TIngredient } from '@/utils/types';

type IngredientsState = {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  data: [],
  loading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Ошибка';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredientsState = (state: RootState): IngredientsState => {
  return state.ingredients;
};

export const selectAllIngredients = createSelector(
  selectIngredientsState,
  (state): TIngredient[] => {
    return [...state.data].sort((a, b) => a.name.localeCompare(b.name));
  }
);

export const selectIngredientsByType = (
  type: TTab
): ((state: RootState) => TIngredient[]) =>
  createSelector([selectAllIngredients], (ingredients): TIngredient[] =>
    ingredients.filter((ingr) => ingr.type === type)
  );

export const selectIngredientById = (
  id?: string
): ((state: RootState) => TIngredient | null) =>
  createSelector(
    [selectAllIngredients],
    (ingredients: TIngredient[]): TIngredient | null => {
      if (!id) return null;
      return ingredients.find((ingr) => ingr._id === id) ?? null;
    }
  );

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;
