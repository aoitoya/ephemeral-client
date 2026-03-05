import axios from "axios";
import Cookies from "js-cookie";

export const API_V1 = `${import.meta.env.VITE_API_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_V1,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

apiClient.interceptors.request.use((config) => {
  let csrf = Cookies.get("XSRF-TOKEN");

  if (!csrf) {
    csrf = getCookie("XSRF-TOKEN") || undefined;
  }

  if (csrf) {
    config.headers["x-xsrf-token"] = csrf;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
