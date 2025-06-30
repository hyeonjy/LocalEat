import axios, { InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = cookies().get('accessToken')?.value;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료로 인한 401이면 refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookies().get('refreshToken')?.value;
      if (!refreshToken) {
        throw error;
      }

      try {
        const res = await api.post('/users/refresh', null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        const newAccessToken = res.data.accessToken;

        cookies().set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60, // 1시간
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        throw error;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
