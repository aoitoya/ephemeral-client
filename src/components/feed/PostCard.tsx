import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
} from "@mui/joy";
import {
  Favorite,
  HeartBroken,
  ChatBubble,
  PersonAdd,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

// Components
import { CommentsSection } from "./CommentsSection";
import { ConnectionRequestDialog } from "@/components/messages/ConnectionRequestDialog";

// Types
import type { Post, Comment } from "@/services/api/post.api";
import { useConnectionMutations } from "@/hooks/useConnection";
import { useVotePost } from "@/hooks/usePosts";
import { API_V1 } from "@/services/api-client";
import { useCurrentUser } from "@/hooks/useAuth";

interface PostCardProps {
  post: Post;
  // onVote: (params: { postId: string; vote: "upvote" | "downvote" }) => void;
  onCommentVote?: (_params: {
    commentId: string;
    vote: "upvote" | "downvote";
  }) => void;
  onAddComment?: (_postId: string, _content: string) => Promise<void>;
  comments?: Comment[];
  isLoadingComments?: boolean;
}

export function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const { mutateAsync: votePost, isPending: isVoting } = useVotePost();
  const connection = useConnectionMutations();
  const { data: currentUser } = useCurrentUser();

  const isOwnPost = currentUser?.id === post.author?.id;

  const handleSendConnectionRequest = async () => {
    await connection.createConnectionRequest({
      recipientId: post.author?.id,
    });
  };

  return (
    <Card variant="outlined" sx={{ "&:hover": { boxShadow: "md" } }}>
      <CardContent>
        {/* Post Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            position: "relative",
            "&:hover .message-button": {
              opacity: 1,
              visibility: "visible",
            },
          }}
        >
          <Avatar size="sm" sx={{ mr: 1.5 }}>
            {post.author?.username?.charAt(0).toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                {post.author?.username || "Anonymous"}
              </Typography>
              {!isOwnPost && (
                <IconButton
                  className="message-button"
                  size="sm"
                  variant="plain"
                  color="neutral"
                  title="Send connection request"
                  sx={{
                    opacity: 0,
                    visibility: "hidden",
                    transition: "opacity 0.2s, visibility 0.2s",
                    p: 0.5,
                    "&:hover": {
                      color: "primary.500",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConnectionDialogOpen(true);
                  }}
                >
                  <PersonAdd fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography level="body-xs" color="neutral">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
        </Box>

        {/* Post Content */}
        <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>
          {post.content}
        </Typography>

        {/* Post Media */}
        {post.mediaKey && (
          <Box sx={{ mb: 2 }}>
            <img
              src={`${API_V1}/media/${post.mediaKey}`}
              alt="Post attachment"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Topics */}
        {post.topics?.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {post.topics.map((topic) => (
              <Typography
                key={topic}
                level="body-xs"
                sx={{
                  bgcolor: "neutral.100",
                  px: 1,
                  py: 0.5,
                  borderRadius: "sm",
                  "&:hover": { bgcolor: "neutral.200", cursor: "pointer" },
                }}
              >
                #{topic}
              </Typography>
            ))}
          </Box>
        )}

        {/* Post Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Vote Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              disabled={isVoting}
              variant={post.userVote === "upvote" ? "soft" : "plain"}
              color={post.userVote === "upvote" ? "danger" : "neutral"}
              onClick={() => votePost({ postId: post.id, vote: "upvote" })}
              size="sm"
            >
              <Favorite />
            </IconButton>

            <Typography level="body-sm" fontWeight="md">
              {post.upvotes}
            </Typography>

            <IconButton
              disabled={isVoting}
              variant={post.userVote === "downvote" ? "soft" : "plain"}
              color={post.userVote === "downvote" ? "primary" : "neutral"}
              onClick={() => votePost({ postId: post.id, vote: "downvote" })}
              size="sm"
            >
              <HeartBroken />
            </IconButton>

            <Typography level="body-xs">{post.downvotes}</Typography>
          </Box>

          {/* Comment Button */}
          <IconButton
            size="sm"
            sx={{ px: 1 }}
            variant={isExpanded ? "soft" : "plain"}
            color={isExpanded ? "primary" : "neutral"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChatBubble />
            <Typography level="body-xs" sx={{ ml: 0.5 }}>
              {post.commentCount || 0}
            </Typography>
          </IconButton>
        </Box>

        {/* Comments Section */}
        {isExpanded && <CommentsSection postId={post.id} />}

        {/* Message Request Dialog */}
        <ConnectionRequestDialog
          open={isConnectionDialogOpen}
          onClose={() => setIsConnectionDialogOpen(false)}
          recipientUsername={post.author?.username || "this user"}
          onSubmit={handleSendConnectionRequest}
        />
      </CardContent>
    </Card>
  );
}

export default PostCard;
