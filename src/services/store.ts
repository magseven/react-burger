import { combineSlices, configureStore as configureStoreRTK } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { ctorSlice } from './ctor-ingredients/reducer';
import { ingredientDetailsSlice } from './ingredient-details/reducer';
import { ingredientsApi } from './ingredients/api';
import { orderApi } from './order/api';
import { orderModalSlice } from './order/orderModalSlice';
import { userSlice } from './user/reducer';

import type { AppDispatch } from './types';

export const rootReducer = combineSlices(
  ingredientsApi,
  ingredientDetailsSlice,
  orderApi,
  ctorSlice,
  orderModalSlice,
  userSlice
);

export const store = configureStoreRTK({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware, orderApi.middleware),
});

// export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: typeof useSelector = useSelector;
