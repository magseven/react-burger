import { combineSlices, configureStore as configureStoreRTK } from '@reduxjs/toolkit';

import { ctorSlice } from './ctor-ingredients/reducer';
import { ingredientDetailsSlice } from './ingredient-details/reducer';
import { ingredientsApi } from './ingredients/api';
import { orderApi } from './order/api';
import { orderModalSlice } from './order/orderModalSlice';

import type { RootState } from './types';

export const rootReducer = combineSlices(
  ingredientsApi,
  ingredientDetailsSlice,
  orderApi,
  ctorSlice,
  orderModalSlice
);

export const configureStore = (
  initialState?: RootState
): ReturnType<typeof configureStoreRTK> => {
  return configureStoreRTK({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ingredientsApi.middleware, orderApi.middleware),
  });
};
