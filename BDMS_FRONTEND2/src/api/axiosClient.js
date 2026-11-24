import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearAuthStorage } from '../utils/tokenStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bdms-backend-production.up.railway.app/api';
// http://localhost:8080/api

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function resolvePendingQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

// Central response handling: unwraps ApiResponse<T>, refreshes JWT on 401, and
// normalizes errors so callers always receive a plain { status, message, errors } shape.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({ status: 0, message: 'Network error. Please check your connection or the API server.', errors: null });
    }

    const { status, data } = error.response;

    // Never try to refresh on the auth endpoints themselves.
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint && getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
        setTokens(accessToken, newRefreshToken);
        resolvePendingQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        resolvePendingQueue(refreshError, null);
        clearAuthStorage();
        window.location.href = '/login';
        return Promise.reject({ status: 401, message: 'Session expired. Please log in again.', errors: null });
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      clearAuthStorage();
      window.location.href = '/login';
    }

    const message = data?.message || 'Something went wrong. Please try again.';
    const fieldErrors = data && typeof data.data === 'object' && !Array.isArray(data.data) ? data.data : null;

    return Promise.reject({ status, message, errors: fieldErrors });
  }
);

export default axiosClient;
