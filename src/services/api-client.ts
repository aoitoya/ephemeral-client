import axios from "axios";
import Cookies from "js-cookie";

export const API_V1 = "/api/v1";

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
  console.log("[API] Request to:", config.url);
  console.log("[API] document.cookie:", document.cookie);

  let csrf = Cookies.get("XSRF-TOKEN");
  console.log("[API] Cookies.get XSRF-TOKEN:", csrf || "NOT FOUND");

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
    console.log(
      "[API] Response:",
      response.config.url,
      "Status:",
      response.status,
    );
    console.log(
      "[API] set-cookie (lowercase):",
      response.headers["set-cookie"],
    );
    console.log("[API] Set-Cookie:", response.headers["Set-Cookie"]);
    console.log(
      "[API] Access-Control-Allow-Origin:",
      response.headers["access-control-allow-origin"],
    );
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
