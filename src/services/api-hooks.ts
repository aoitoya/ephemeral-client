import { useQuery, useMutation } from "@tanstack/react-query";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { TokenService } from "./token-service";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

type QueryOptions<T> = Omit<UseQueryOptions<T, unknown, T, unknown[]>, "queryKey">;

export const useAuthenticatedQuery = <T>(
  key: unknown[],
  queryFn: () => Promise<T>,
  options = {} as QueryOptions<T>
) => {
  const { refetch: refreshToken } = useTokenRefresh();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401 && TokenService.getToken()) {
          await refreshToken();
          return await queryFn();
        }

        console.log(error);
        throw error;
      }
    },
    retry: (failureCount, error: unknown) => {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 401) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

export const useAuthenticatedMutation = <T, V, C = unknown>(
  mutationFn: (_variables: V) => Promise<T>,
  options: UseMutationOptions<T, Error, V, C> = {}
) => {
  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        return await mutationFn(variables);
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401 && TokenService.getToken()) {
          // Try to refresh token and retry the mutation
          console.log("Token expired, refreshing...");
        }

        console.log(error);
        throw error;
      }
    },
    retry: false,
    ...options,
  });
};

// Example usage:
// export const useUserProfile = (userId: string) => {
//   return useAuthenticatedQuery(["user", userId], () =>
//     apiClient.get(`/users/${userId}`).then((res) => res.data)
//   );
// };

// export const useUpdateProfile = () => {
//   return useAuthenticatedMutation((data: { name: string; email: string }) =>
//     apiClient.put("/users/profile", data).then((res) => res.data)
//   );
// };