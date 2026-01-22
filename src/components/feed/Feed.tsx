import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Sheet,
} from "@mui/joy";
import { PostCard } from "./PostCard";
import { CreatePost } from "./CreatePost";
import { usePosts } from "@/hooks/usePosts";

export function Feed() {
  const { posts, isLoading, error, createPost, isCreating } = usePosts();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        color="danger"
        variant="soft"
        sx={{
          maxWidth: 600,
          mx: "auto",
          my: 4,
          boxShadow: "sm",
          "--Alert-radius": "12px",
        }}
      >
        <Typography level="body-md" fontWeight="lg">
          Error loading posts
        </Typography>
        <Typography level="body-sm" color="neutral">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </Typography>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          width: "100%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CreatePost onSubmit={createPost} isSubmitting={isCreating} />

        <Stack spacing={3} sx={{ mt: 1 }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <PostCard post={post} />
              </Box>
            ))
          ) : (
            <Sheet
              variant="soft"
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: "lg",
                textAlign: "center",
                backgroundColor: "background.surface",
                boxShadow: "sm",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                level="h4"
                component="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: "700",
                  color: "text.primary",
                }}
              >
                No posts yet
              </Typography>
              <Typography
                level="body-md"
                sx={{
                  color: "text.secondary",
                  maxWidth: "40ch",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Be the first to share something with the community!
              </Typography>
            </Sheet>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default Feed;
