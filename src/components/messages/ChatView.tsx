import {
  Box,
  Typography,
  Button,
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
  isConnected?: boolean;
  isSending?: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
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
  isConnected = true,
  isSending = false,
  messagesEndRef,
}: ChatViewProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        bgcolor: "background.body",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
        }}
      >
        {isMobile && onBack && (
          <IconButton variant="plain" onClick={onBack} size="sm">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar
          size="sm"
          sx={{ bgcolor: "primary.solidBg" }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography level="title-sm" sx={{ fontWeight: 600 }}>
            {user.username}
          </Typography>
          <Typography level="body-xs" color="neutral">
            Online
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor: "background.level1",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography level="body-sm" color="neutral">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isOwnMessage={msg.from.id === currentUserId}
            />
          ))
        )}
      </Box>

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
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <Textarea
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            minRows={1}
            maxRows={4}
            disabled={!isConnected || isSending}
            sx={{
              flex: 1,
              "& .MuiInput-input": { p: 1.25 },
            }}
          />
          <Button
            type="submit"
            variant="solid"
            color="primary"
            disabled={!message.trim() || !isConnected || isSending}
            sx={{ borderRadius: "20px", px: 2 }}
          >
            {isSending ? "..." : <SendIcon fontSize="small" />}
          </Button>
        </Box>
      </Box>
      <div ref={messagesEndRef} />
    </Box>
  );
}
