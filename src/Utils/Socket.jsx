import { io } from "socket.io-client";
import { Baseurl } from "../Config";
// Make sure this file has your base URL

let socket = null;

export const getSocket = (userId) => {
  if (!socket) {
    socket = io(Baseurl, {
      withCredentials: true,
      transports: ["websocket"],
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
