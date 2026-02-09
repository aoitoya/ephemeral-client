import axios from "axios";
import Cookies from "js-cookie";

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

apiClient.interceptors.request.use((config) => {
  const csrf = Cookies.get("XSRF-TOKEN");
  if (csrf) config.headers["x-xsrf-token"] = csrf;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
