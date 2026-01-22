import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { TokenService } from "@/services/token-service";

const SocketContext = createContext<{
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
} | null>(null);

function useSocketInit() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000",
      {
        auth: {
          token: TokenService.getToken(),
        },
        withCredentials: true,
      }
    );
    const handleConnect = () => {
      console.log("Connected to server");
      setIsConnected(true);
      setError(null);
    };

    const handleConnectError = (err: Error) => {
      console.error("Connection error:", err);
      setError("Failed to connect to the chat server");
      setIsConnected(false);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("connect_error", handleConnectError);
    newSocket.on("disconnect", handleDisconnect);

    setSocket(newSocket);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("connect_error", handleConnectError);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return { socket, isConnected, error };
}

function SocketProvider({ children }: { children: ReactNode }) {
  const socketState = useSocketInit();

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}

function useSocketEvent(event: string, handler: (...args: any[]) => void) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}

export { SocketProvider, useSocket, useSocketEvent };
