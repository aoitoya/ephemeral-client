import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenService } from "@/services/token-service";
import { authAPI } from "@/services/api/auth.api";
import { userAPI } from "@/services/api/user.api";
import type { User } from "@/services/api/user.api";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      TokenService.setToken(data.token);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      TokenService.setToken(data.token);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      TokenService.clearToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: authKeys.user(),
    queryFn: () => userAPI.getMe(),
    enabled: !!TokenService.getToken(),
    retry: (failureCount, error: unknown) => {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
  });
};
