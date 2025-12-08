import { useQuery, useMutation } from "@tanstack/react-query";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { TokenService } from "./token-service";
import type { UseQueryOptions } from "@tanstack/react-query";

type QueryOptions<T> = Omit<UseQueryOptions<T, unknown, T, any[]>, "queryKey">;

export const useAuthenticatedQuery = <T>(
  key: any[],
  queryFn: () => Promise<T>,
  options = {} as QueryOptions<T>
) => {
  const { refetch: refreshToken } = useTokenRefresh();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error: any) {
        if (error.response?.status === 401 && TokenService.getToken()) {
          await refreshToken();
          return await queryFn();
        }

        console.log(error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

export const useAuthenticatedMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options = {}
) => {
  const { refetch: refreshToken } = useTokenRefresh();

  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        return await mutationFn(variables);
      } catch (error: any) {
        if (error.response?.status === 401 && TokenService.getToken()) {
          await refreshToken();
          return await mutationFn(variables);
        }
        throw error;
      }
    },
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
