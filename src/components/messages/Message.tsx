import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { useGetMe } from "@/hooks/useUsers";
import UserList from "./UserList";
import ChatView from "./ChatView";
import type { Message } from "./types";
import { useSocket } from "@/hooks/useSocket";
import type { User } from "@/services/api/user.api";
import {
  useConnectionsFetch,
  useOnlineConnectionsFetch,
} from "@/hooks/useConnection";

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

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (payload: Message) => {
      setMessages((prev) => [...prev, payload]);
    };

    const handleMessages = (payload: Message[]) => {
      console.log("payload", payload);
      setMessages((prev) => [...payload, ...prev]);
    };

    socket.on("chat:message", handleMessage);
    socket.on("chat:messages", handleMessages);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket]);

  if (!currentUser) {
    return null;
  }

  console.log(messages);

  const sendMessage = () => {
    if (!(socket && selectedUser && message.trim())) return;

    // const newMessage: Message = {
    //   id: Date.now().toString(),
    //   content: message,
    //   from: currentUser,
    //   createdAt: "-",
    // };

    socket.emit("chat:message", {
      content: message,
      room: { type: "single", id: selectedUser.id },
    });

    // setMessages((prev) => [...prev, newMessage]);
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
        position: "relative",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          order: { xs: 2, md: 1 },
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.level1",
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
          width: { xs: "100%", md: 300 },
          borderTop: { xs: "1px solid", md: "none" },
          borderColor: "divider",
          bgcolor: "background.surface",
          order: { xs: 1, md: 2 },
          display: {
            xs: showSidebar ? "block" : "none",
            md: "block",
          },
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
