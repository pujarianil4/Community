import { io, Socket } from "socket.io-client";
import { AppDispatch } from "@/contexts/store";
import { addNotification } from "@/contexts/reducers";

let socket: Socket | null = null;

export const connectSocket = (
  userId: number,
  dispatch: AppDispatch
): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(`https://community-slr7.onrender.com/notification-ws`, {
    query: { userId: userId.toString() },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  // connect websocket connection

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("notification", (notification: any) => {
    try {
      if (notification?.id) {
        dispatch(addNotification(notification));
        console.log("Notification processed:", notification);
      } else {
        console.warn("Invalid notification received:", notification);
      }
    } catch (error) {
      console.error("Error processing notification:", error);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from WebSocket server:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
  });

  return socket;
};

// Disconnects the WebSocket connection.

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log("Disconnected from WebSocket server");
    socket = null;
  }
};
