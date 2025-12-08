import { useState } from "react";
import { Box, Card, Typography, Textarea, Button } from "@mui/joy";

interface CreatePostProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CreatePost({ onSubmit, isSubmitting }: CreatePostProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>
        Create a post
      </Typography>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="What's on your mind?"
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Post
          </Button>
        </Box>
      </form>
    </Card>
  );
}

export default CreatePost;
