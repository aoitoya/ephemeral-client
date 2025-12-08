import { Box, Typography, Sheet } from "@mui/joy";
import type { Message } from "./types";

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
        alignSelf: isOwnMessage ? "flex-end" : "flex-start",
        maxWidth: { xs: "90%", sm: "70%" },
      }}
    >
      <Sheet
        variant={isOwnMessage ? "soft" : "outlined"}
        color={isOwnMessage ? "primary" : "neutral"}
        sx={{
          p: 1.5,
          borderRadius: "lg",
          borderTopLeftRadius: isOwnMessage ? "lg" : 0,
          borderTopRightRadius: isOwnMessage ? 0 : "lg",
        }}
      >
        <Typography level="body-md">{message.content}</Typography>
        <Typography
          level="body-xs"
          color="neutral"
          sx={{ mt: 0.5, textAlign: "right" }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Sheet>
    </Box>
  );
}
