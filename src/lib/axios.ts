import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 전송 허용
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료로 인한 401이면 refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // TODO: refresh 요청
        await api.post('/auth/refresh');
        return api(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        // TODO: 강제 로그아웃 또는 로그인 페이지로 이동
      }
    }

    return Promise.reject(error);
  },
);

export default api;
