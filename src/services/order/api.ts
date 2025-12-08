import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import BASE_URL from '../../utils/config-api';

import type { TOrderRequest, TOrderResponse } from './types';

export const orderApiConfig = {
  baseUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};
export const orderApi = createApi({
  reducerPath: 'orders',
  baseQuery: fetchBaseQuery({
    baseUrl: orderApiConfig.baseUrl,
    prepareHeaders: (headers) => {
      for (const [key, value] of Object.entries(orderApiConfig.headers)) {
        headers.set(key, value);
      }

      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        headers.set('Authorization', accessToken);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    postOrder: builder.mutation<TOrderResponse, TOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
    }),
  }),
});
export const { usePostOrderMutation } = orderApi;
