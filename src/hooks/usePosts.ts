// src/hooks/usePosts.ts
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  useAuthenticatedQuery,
  useAuthenticatedMutation,
} from "@/services/api-hooks";
import { postAPI, type Post } from "@/services/api/post.api";

export interface CreatePost {
  content: string;
  topics: string[];
}

export interface Vote {
  postId: string;
  vote: "upvote" | "downvote";
}

export const usePosts = () => {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useAuthenticatedQuery(["posts"], async () => {
    const response = await postAPI.getPosts();
    return response;
  });

  const createPostMutation = useAuthenticatedMutation(
    (text: string) => {
      const data: CreatePost = { content: text, topics: [] };

      const words = text.split(" ");

      data.topics = words
        .filter((word) => word.startsWith("#"))
        .map((word) => word.slice(1));
      data.content = words.filter((word) => !word.startsWith("#")).join(" ");

      return postAPI.createPost(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    }
  );

  const [voteLoading, setVoteLoading] = useState<Record<number, boolean>>({});

  const handleVote = useCallback(
    async (params: Vote) => {
      const { postId } = params;

      try {
        // Set loading state for this post
        setVoteLoading((prev) => ({ ...prev, [postId]: true }));

        // Optimistically update the UI
        await queryClient.cancelQueries({ queryKey: ["posts"] });
        const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

        if (previousPosts) {
          queryClient.setQueryData<Post[]>(["posts"], (old) =>
            old?.map((post) => {
              if (post.id !== params.postId) return post;

              const wasUpvote = post.userVote === "upvote";
              const isUpvote = params.vote === "upvote";

              let newUpvotes = post.upvotes;
              let newDownvotes = post.downvotes;

              if (isUpvote) {
                if (wasUpvote) {
                  newUpvotes--;
                } else {
                  newUpvotes++;
                  if (wasUpvote === false) newDownvotes--;
                }
              } else {
                if (wasUpvote) {
                  newUpvotes--;
                  newDownvotes++;
                } else if (wasUpvote === false) {
                  newDownvotes--;
                } else {
                  newDownvotes++;
                }
              }

              return {
                ...post,
                userVote:
                  wasUpvote === (isUpvote ? true : false) ? null : params.vote,
                upvotes: newUpvotes,
                downvotes: newDownvotes,
              };
            })
          );
        }

        // Perform the actual vote
        await postAPI.votePost(params.postId, params.vote);

        // Invalidate and refetch to ensure we have fresh data
        await queryClient.invalidateQueries({ queryKey: ["posts"] });

        return true;
      } catch (error) {
        // Revert on error
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        throw error;
      } finally {
        // Clear loading state
        setVoteLoading((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [queryClient]
  );

  return {
    posts: posts || [],
    isLoading,
    refetch,
    error,
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    handleVote,
    isVoting: (postId: number) => voteLoading[postId] || false,
  };
};
