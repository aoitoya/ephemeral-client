import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { useGetMe } from "@/hooks/useUsers";
import UserList from "./UserList";
import ChatView from "./ChatView";
import type { Message } from "./types";
import { useSocket, useSocketEvent } from "@/hooks/useSocket";
import type { User } from "@/services/api/user.api";
import { useConnectionsFetch } from "@/hooks/useConnection";

export default function Messages() {
  const { socket } = useSocket();
  const { data: currentUser } = useGetMe();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: connections = [] } = useConnectionsFetch({ status: "active" });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 900;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useSocketEvent("chat:message", (payload: Message) => {
    setMessages((prev) => [...prev, payload]);
  });

  useSocketEvent("chat:messages", (payload: Message[]) => {
    setMessages((prev) => [...payload, ...prev]);
  });

  if (!currentUser) {
    return null;
  }

  const sendMessage = () => {
    if (!(socket && selectedUser && message.trim())) return;

    socket.emit("chat:message", {
      content: message,
      room: { type: "single", id: selectedUser.id },
    });

    setMessage("");
  };

  const joinChat = (userId: string) => {
    if (!socket) return;
    socket.emit("chat:join", { type: "single", id: userId });
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    joinChat(user.id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToUsers = () => {
    setShowSidebar(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "calc(100vh - 64px)",
        bgcolor: "background.body",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          order: { xs: 2, md: 1 },
          height: { xs: selectedUser ? "100%" : "auto", md: "100%" },
        }}
      >
        {selectedUser ? (
          <ChatView
            user={selectedUser}
            messages={messages}
            currentUserId={currentUser.id}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={sendMessage}
            onBack={isMobile ? handleBackToUsers : undefined}
            isMobile={isMobile}
          />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: { xs: selectedUser ? "none" : "flex", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.level1",
              p: 3,
            }}
          >
            <Typography level="body-md" color="neutral">
              Select a conversation to start chatting
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          borderTop: { xs: "1px solid", md: "none" },
          borderColor: "divider",
          bgcolor: "background.surface",
          order: { xs: 1, md: 2 },
          display: {
            xs: showSidebar ? "block" : "none",
            md: "block",
          },
          height: { xs: showSidebar ? "auto" : 0, md: "100%" },
          overflow: "hidden",
        }}
      >
        <UserList
          users={connections.map((c) => c.user)}
          selectedUserId={selectedUser?.id}
          onSelectUser={handleSelectUser}
        />
      </Box>
    </Box>
  );
}
