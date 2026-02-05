import { createSlice } from '@reduxjs/toolkit';

import type { IngredientDetailsState } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

export const initialState: IngredientDetailsState = {
  selectedId: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    selectIngredient(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    clearIngredient(state) {
      state.selectedId = null;
    },
  },
  selectors: {
    selectSelectedId: (state) => state.selectedId,
  },
});

export const { selectSelectedId } = ingredientDetailsSlice.selectors;
export const { selectIngredient, clearIngredient } = ingredientDetailsSlice.actions;
