import BASE_URL from './config-api';

import type { TIngredient } from './types';
import type { TOrderRequest, TOrderResponse } from '@/services/order/types';

type ApiError = {
  success?: boolean;
  message: string;
  [key: string]: unknown;
  //code?: number;
};

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as Record<string, unknown>).message === 'string'
  );
}

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
  };
};

export type User = {
  email: string;
  name: string;
};

export type GetUserResponse = {
  success: boolean;
  user: User;
};

const getUser = async (): Promise<GetUserResponse> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Требуется авторизация');
    }

    const data = await fetchWithRefresh<GetUserResponse>('/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    });

    return data;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

type LoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
  message?: string;
};

const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    }

    await request('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    console.warn('Logout error (tokens cleared locally):', error);
  }
};

const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const response = await request<RegisterResponse>('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('api.register', response);
    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Ответ сервера не содержит токены авторизации');
    }

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const isTokenExists = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

type RefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message?: string; // если есть другие поля
};

export const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!refreshTokenValue) {
      throw new Error('Refresh token not found');
    }

    const response = await request<RefreshResponse>('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        token: refreshTokenValue,
      }),
    });

    if (!response.success) {
      throw new Error(response.message ?? 'Token refresh failed');
    }

    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('accessToken', response.accessToken);

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await request<T>(endpoint, options);
    return response;
  } catch (err: unknown) {
    console.log('fetchWithRefresh error:', err);

    if (isApiError(err) && err.message === 'jwt expired') {
      try {
        const refreshData = await refreshToken();

        if (refreshData.accessToken) {
          localStorage.setItem('accessToken', refreshData.accessToken);
        }
        if (refreshData.refreshToken) {
          localStorage.setItem('refreshToken', refreshData.refreshToken);
        }

        const newOptions: RequestInit = {
          ...options,
          headers: {
            ...(options?.headers ?? {}),
            Authorization: refreshData.accessToken,
          },
        };

        const response = await request<T>(endpoint, newOptions);
        return response;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw refreshError;
      }
    }

    throw err;
  }
};

type ResetResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  user: User;
};

export const passwordReset = async (data: { email: string }): Promise<ResetResponse> => {
  try {
    const response = await request<ResetResponse>('/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const passwordReset2 = async (data: {
  password: string;
  token: string;
}): Promise<ResetResponse> => {
  try {
    if (!data.token) {
      throw new Error('Токен не найден. Пожалуйста, авторизуйтесь.');
    }

    const response = await request<ResetResponse>('/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: data.token,
      },
      body: JSON.stringify({
        password: data.password,
        token: data.token,
      }),
    });

    return response;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

type userPatchResponse = {
  success: boolean;
  message?: string;
  user: User;
};

export const userPatch = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<userPatchResponse> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetchWithRefresh<userPatchResponse>(`/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

type StandardApiResponse<T> = {
  success: boolean;
  data: T;
  order?: T;
  message?: string;
  user?: T;
  accessToken?: string;
  refreshToken?: string;
};

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json() as Promise<T>;
  }
  return Promise.reject(
    new Error(`HTTP ${res.status}: ${res.statusText || 'Unknown error'}`)
  );
};

const checkSuccess = <T extends { success?: boolean }>(res: T): T => {
  if (res?.success) {
    return res;
  }
  throw new Error(`Ответ не success: ${JSON.stringify(res)}`);
};

const request = <T>(endpoint: string, reqOptions?: RequestInit): Promise<T> => {
  return fetch(`${BASE_URL}${endpoint}`, reqOptions)
    .then(checkResponse<StandardApiResponse<T>>)
    .then(checkSuccess)
    .then((response): T => {
      return (response.order ?? response.data ?? response) as T;
    });
};

const getIngredients = (): Promise<TIngredient[]> => {
  return request<TIngredient[]>('/ingredients');
};

export const postOrder = (orderData: TOrderRequest): Promise<TOrderResponse> => {
  const accessToken = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = accessToken;
  }

  return request<TOrderResponse>('/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const api = {
  getUser,
  login,
  logout,
  isTokenExists,
  register,
  passwordReset,
  passwordReset2,
  userPatch,
  getIngredients,
  postOrder,
};
