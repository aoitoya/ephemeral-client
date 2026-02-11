import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "./useAuth";
import { TokenService } from "@/services/token-service";
import { SocketContext } from "./socket-context";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;

      const newSocket = io(apiUrl, {
        auth: {
          token: TokenService.getToken(),
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        setConnectionError(null);
      });

      newSocket.on("connect_error", (error) => {
        setConnectionError(error.message);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      newSocket.on("reconnect_attempt", (attempt) => {
        console.log("Socket reconnection attempt:", attempt);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setConnectionError(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  );
}
