import axios from 'axios';
import { cookies } from 'next/headers';

export const createServerApi = (
  accessToken?: string,
  refreshToken?: string,
) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshToken) {
          const refreshError = new Error('RefreshTokenExpired');
          refreshError.name = 'RefreshTokenExpired';
          throw refreshError;
        }

        try {
          const { data } = await api.post('/users/refresh', null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });

          const newAccessToken = data.accessToken;

          cookies().set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60, // 1시간
          });

          /* 헤더 교체 후 재시도 */
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch {
          const refreshError = new Error('RefreshTokenExpired');
          refreshError.name = 'RefreshTokenExpired';
          throw refreshError;
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};
