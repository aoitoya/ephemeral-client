import {
  Box,
  Typography,
  Button,
  Stack,
  Sheet,
  IconButton,
  Avatar,
  Textarea,
} from "@mui/joy";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageBubble from "./MessageBubble";
import type { Message } from "./types";
import type { User } from "@/services/api/user.api";

interface ChatViewProps {
  user: User;
  messages: Message[];
  currentUserId: string;
  message: string;
  onMessageChange: (_value: string) => void;
  onSendMessage: () => void;
  onBack?: () => void;
  isMobile?: boolean;
}

export default function ChatView({
  user,
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  onBack,
  isMobile = false,
}: ChatViewProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        position: "relative",
      }}
    >
      {/* Header */}
      <Sheet
        variant="soft"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {isMobile && onBack && (
          <IconButton variant="plain" onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        <Box>
          <Typography level="title-md">{user.username}</Typography>
          <Typography level="body-xs" color="neutral">
            Online
          </Typography>
        </Box>
      </Sheet>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "background.level1",
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            isOwnMessage={msg.from.id === currentUserId}
          />
        ))}
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            variant="outlined"
            size="md"
            sx={{
              flex: 1,
              "& .MuiInput-root": {
                "&:before": { border: "none" },
              },
            }}
          />
          <Button
            type="submit"
            variant="solid"
            color="primary"
            disabled={!message.trim()}
            endDecorator={<SendIcon />}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
