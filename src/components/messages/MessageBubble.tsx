import { Box, Typography, Sheet } from "@mui/joy";
import type { Message } from "./types";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        maxWidth: { xs: "85%", sm: "70%" },
        mx: "auto",
      }}
    >
      <Sheet
        variant="soft"
        color={isOwnMessage ? "primary" : "neutral"}
        sx={{
          p: 1.5,
          borderRadius: "lg",
          borderTopRightRadius: isOwnMessage ? 0 : "lg",
          borderBottomRightRadius: isOwnMessage ? 0 : 4,
          borderTopLeftRadius: isOwnMessage ? 4 : "lg",
          borderBottomLeftRadius: isOwnMessage ? "lg" : 4,
          bgcolor: isOwnMessage ? "primary.softColor" : "neutral.softBg",
        }}
      >
        <Typography level="body-md">{message.content}</Typography>
        <Typography
          level="body-xs"
          color="neutral"
          sx={{ mt: 0.5, display: "block", textAlign: isOwnMessage ? "right" : "left" }}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </Typography>
      </Sheet>
    </Box>
  );
}
