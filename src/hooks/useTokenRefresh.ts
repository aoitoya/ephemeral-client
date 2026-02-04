import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/services/api/auth.api";
import { TokenService } from "@/services/token-service";

export const useTokenRefresh = () => {
  return useQuery({
    queryKey: ["token-refresh"],
    queryFn: async () => {
      try {
        const data = await authAPI.refreshToken();
        TokenService.setToken(data.token);
        return data;
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          TokenService.clearToken();
        }
        throw error;
      }
    },
    enabled: false,
    retry: false,
    staleTime: Infinity,
  });
};
