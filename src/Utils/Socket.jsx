import { io } from "socket.io-client";
import { Baseurl } from "../confige";

// Make sure this file has your base URL

let socket = null;

export const getSocket = (userId) => {
  if (!socket) {
    socket = io(Baseurl, {
      withCredentials: true,
      transports: ["websocket"],
      query: {
        userId: userId, // ✅ Pass userId here
      },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      if (userId) {
        socket.emit("userOnline", userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};
