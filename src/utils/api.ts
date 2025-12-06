import BASE_URL from './config-api';

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
  // [x: string]: unknown;
  success: boolean;
  user: User;
};

const getUser = async (): Promise<GetUserResponse> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No access token');
    }

    const data = await fetchWithRefresh<GetUserResponse>(`${BASE_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
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
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Login failed! Status: ${response.status}`);
    }

    const res = await checkResponse<LoginResponse>(response);

    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res;
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
      throw new Error('No refresh token found');
    }

    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Logout failed! Status: ${response.status}`);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Registration failed! Status: ${response.status}`);
    }

    const res = await checkResponse<RegisterResponse>(response);

    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const isTokenExists = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

const checkResponse = async <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json() as Promise<T>;
  } else {
    const err = (await res.json()) as unknown as ApiError;
    return Promise.reject(new Error(err.message));
  }
};

type RefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message?: string; // если есть другие поля
};

export const refreshToken = (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  return (
    fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken'),
      }),
    })
      .then((response) => checkResponse<RefreshResponse>(response))
      // !! Важно для обновления токена в мидлваре, чтобы запись
      // была тут, а не в fetchWithRefresh
      .then((refreshData) => {
        if (!refreshData.success) {
          return Promise.reject(
            new Error(refreshData.message ?? 'Token refresh failed')
          );
        }
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        localStorage.setItem('accessToken', refreshData.accessToken);
        return refreshData;
      })
  );
};

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse(res);
  } catch (err: unknown) {
    console.log('catch:', err);
    if (isApiError(err) && err.message === 'jwt expired') {
      const refreshData = await refreshToken();

      const newOptions: RequestInit = {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          Authorization: refreshData.accessToken,
        },
      };

      const res = await fetch(url, newOptions); //повторяем запрос
      return await checkResponse(res);
    }

    if (err instanceof Error) {
      return Promise.reject(err);
    } else {
      return Promise.reject(new Error(String(err)));
    }
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
    const res = await fetch(`${BASE_URL}/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await checkResponse(res);
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const passwordReset2 = async (data: {
  password: string;
  code: string;
}): Promise<ResetResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/password-reset/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await checkResponse(res);
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
    const res = await fetchWithRefresh<userPatchResponse>(`${BASE_URL}/auth/user`, {
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

export const api = {
  getUser,
  login,
  logout,
  isTokenExists,
  register,
  passwordReset,
  passwordReset2,
  userPatch,
};
