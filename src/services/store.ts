import { combineSlices, configureStore as configureStoreRTK } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { ctorSlice } from './ctor-ingredients/reducer';
import { ingredientDetailsSlice } from './ingredient-details/reducer';
import { ingredientsSlice } from './ingredients/reducer';
import { orderModalSlice } from './order/orderModalSlice';
import { orderSlice } from './order/reducer';
import { userSlice } from './user/reducer';

import type { AppDispatch } from './types';

export const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientDetailsSlice,
  ctorSlice,
  orderModalSlice,
  userSlice,
  orderSlice
);

export const store = configureStoreRTK({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: typeof useSelector = useSelector;
