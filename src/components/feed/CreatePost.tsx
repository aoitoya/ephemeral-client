import { useState, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Textarea,
  Button,
  IconButton,
  Sheet,
} from "@mui/joy";
import { Close, AddPhotoAlternate } from "@mui/icons-material";

interface CreatePostProps {
  onSubmit: (_content: string, _file?: File) => Promise<void>;
  isSubmitting: boolean;
}

export function CreatePost({ onSubmit, isSubmitting }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) return;

    try {
      await onSubmit(content, selectedFile || undefined);
      setContent("");
      removeFile();
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

        {previewUrl && (
          <Sheet
            sx={{
              position: "relative",
              mb: 2,
              borderRadius: "md",
              overflow: "hidden",
              display: "inline-block",
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                display: "block",
              }}
            />
            <IconButton
              size="sm"
              onClick={removeFile}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.6)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Sheet>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            sx={{ color: "text.secondary" }}
          >
            <AddPhotoAlternate />
          </IconButton>
          <Button
            type="submit"
            disabled={(!content.trim() && !selectedFile) || isSubmitting}
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
