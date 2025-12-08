import { apiClient } from "../api-client";

export const authAPI = {
  register: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post("/users/register", credentials);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/users/refresh-token");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
} as const;
