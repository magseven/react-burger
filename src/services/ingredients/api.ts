import { createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import BASE_URL from '../../utils/config-api';

import type { RootState } from '../types';
import type { TIngredientsResponse } from './types';
import type { TIngredient } from '@/utils/types';

export const ingredientsApiConfig = {
  baseUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredients',
  baseQuery: fetchBaseQuery({
    baseUrl: ingredientsApiConfig.baseUrl,
    prepareHeaders: (headers) => {
      for (const [key, value] of Object.entries(ingredientsApiConfig.headers)) {
        headers.set(key, value);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredientsResponse, void>({
      query: () => '/ingredients',
    }),
  }),
});

const selectIngredientsResult = ingredientsApi.endpoints.getIngredients.select();

export const selectIngredientsByType = (
  type: string
): ((state: RootState) => TIngredient[]) =>
  createSelector(selectIngredientsResult, (result): TIngredient[] =>
    (result.data?.data ?? []).filter((ingr) => ingr.type === type)
  );

export const { useGetIngredientsQuery } = ingredientsApi;
