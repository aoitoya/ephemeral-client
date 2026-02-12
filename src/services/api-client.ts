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

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

apiClient.interceptors.request.use((config) => {
  console.log("[API] Request to:", config.url);
  console.log("[API] document.cookie:", document.cookie);
  
  // Try js-cookie first
  let csrf = Cookies.get("XSRF-TOKEN");
  console.log("[API] Cookies.get XSRF-TOKEN:", csrf || "NOT FOUND");
  
  // Fallback to manual parsing
  if (!csrf) {
    csrf = getCookie("XSRF-TOKEN") || undefined;
    console.log("[API] Manual parse XSRF-TOKEN:", csrf || "NOT FOUND");
  }
  
  if (csrf) {
    config.headers["x-xsrf-token"] = csrf;
    console.log("[API] Set x-xsrf-token header:", csrf);
  } else {
    console.log("[API] No XSRF-TOKEN cookie found - header NOT set");
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("[API] Response:", response.config.url, "Status:", response.status);
    console.log("[API] set-cookie (lowercase):", response.headers["set-cookie"]);
    console.log("[API] Set-Cookie:", response.headers["Set-Cookie"]);
    console.log("[API] Access-Control-Allow-Origin:", response.headers["access-control-allow-origin"]);
    return response;
  },
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
        failedRequestsQueue.forEach(({ reject }) =>
          reject(refreshError as Error),
        );
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
