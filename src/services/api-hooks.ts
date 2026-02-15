import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

type QueryOptions<T> = Omit<UseQueryOptions<T, unknown, T, unknown[]>, "queryKey">;

export const useAuthenticatedQuery = <T>(
  key: unknown[],
  queryFn: () => Promise<T>,
  options = {} as QueryOptions<T>
) => {
  return useQuery({
    queryKey: key,
    queryFn,
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
    mutationFn,
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
