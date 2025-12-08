import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { TokenService } from "@/services/token-service";

export function useSocket() {
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

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setError("Failed to connect to the chat server");
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return { socket, isConnected, error };
}
