import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { TIngredient } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type IngredientsState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};

export const initialState: IngredientsState = {
  bun: null,
  ingredients: [],
};

export const ctorSlice = createSlice({
  name: 'ctor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        state.ingredients = [...state.ingredients, action.payload];
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
        },
      }),
    },
    deleteIngredient(state, action: PayloadAction<string>) {
      const found = state.ingredients.find((ingr) => ingr.id === action.payload);
      if (found) {
        state.ingredients = state.ingredients.filter(
          (ingr) => ingr.id !== action.payload
        );
      }
    },
    clearOrder(state) {
      state.bun = null;
      state.ingredients = [];
    },
    reorderIngredient(state, action: PayloadAction<{ id: string; index: number }>) {
      const found = state.ingredients.findIndex((ingr) => ingr.id === action.payload.id);
      if (found >= 0)
        state.ingredients.splice(
          action.payload.index,
          0,
          state.ingredients.splice(found, 1)[0]
        );
    },
  },

  selectors: {
    selectBun: (state) => state.bun,
    selectIngredients: (state) => state.ingredients,
  },
});

export const { selectBun, selectIngredients } = ctorSlice.selectors;
export const { addBun, addIngredient, deleteIngredient, clearOrder, reorderIngredient } =
  ctorSlice.actions;

export const selectCtorCounter = createSelector(
  [selectIngredients, selectBun],
  (items, bun) => {
    return items.reduce(
      (acc, ingr) => {
        acc[ingr._id] = acc[ingr._id] ? acc[ingr._id] + 1 : 1;
        return acc;
      },
      bun ? { [bun._id]: 2 } : {}
    );
  }
);
