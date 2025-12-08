import {
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from "@/services/api-hooks";
import { commentAPI } from "@/services/api/post.api";
import { useQueryClient } from "@tanstack/react-query";

export const useCommentsFetcher = (
  params: {
    postId?: string;
    commentId?: string;
  },
  options?: { enabled?: boolean }
) => {
  const query = useAuthenticatedQuery(
    ["comments", params.postId || params.commentId],
    () => commentAPI.getComments(params),
    {
      enabled: options?.enabled ?? (!!params.postId || !!params.commentId),
    }
  );

  return { ...query, data: query.data || [] };
};

export const useCommentsVoter = () => {
  const queryClient = useQueryClient();

  const mutation = useAuthenticatedMutation(commentAPI.voteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return mutation;
};

export const useCommentsCreator = () => {
  const queryClient = useQueryClient();

  const mutation = useAuthenticatedMutation(commentAPI.createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return mutation;
};
