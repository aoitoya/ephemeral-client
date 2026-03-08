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

apiClient.interceptors.request.use((config) => {
  console.log("[API REQUEST] Starting request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: (config.baseURL ?? "") + (config.url ?? ""),
    headers: config.headers,
    params: config.params,
    data: config.data,
  });

  const csrf = Cookies.get("XSRF-TOKEN");
  console.log("[API REQUEST] All cookies:", document.cookie);
  console.log("[API REQUEST] CSRF token:", csrf);

  if (csrf) {
    config.headers["x-xsrf-token"] = csrf;
    console.log("[API REQUEST] CSRF token attached to headers");
  } else {
    console.warn("[API REQUEST] No CSRF token found!");
  }

  console.log("[API REQUEST] Final config headers:", config.headers);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("[API RESPONSE] Success response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase(),
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("[API RESPONSE] Error response:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseHeaders: error.response?.headers,
      responseData: error.response?.data,
      requestHeaders: error.config?.headers,
    });

    if (error.response?.status === 401) {
      console.warn("[API RESPONSE] 401 Unauthorized - dispatching auth:unauthorized event");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
