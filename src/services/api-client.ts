import axios from "axios";
import Cookies from "js-cookie";
import { TokenService } from "./token-service";
import { authAPI } from "./api/auth.api";

export const API_URL = import.meta.env.VITE_API_URL || "";
export const API_V1 = `${API_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_V1,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

apiClient.interceptors.request.use((config) => {
  const csrf = Cookies.get("XSRF-TOKEN");
  if (csrf) config.headers["x-xsrf-token"] = csrf;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await authAPI.refreshToken();
        TokenService.setToken(data.token);

        failedRequestsQueue.forEach(({ resolve }) => resolve(data.token));
        failedRequestsQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError as Error));
        failedRequestsQueue = [];

        TokenService.clearToken();
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
