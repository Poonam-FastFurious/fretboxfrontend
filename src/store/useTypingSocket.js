// src/hooks/useTypingSocket.js
import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

const useTypingSocket = () => {
  const socket = useAuthStore.getState().socket;
  const setTypingStatus = useChatStore((state) => state.setTypingStatus);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ chatId }) => {
      setTypingStatus(chatId, true);
    };

    const handleStopTyping = ({ chatId }) => {
      setTypingStatus(chatId, false);
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, setTypingStatus]);
};

export default useTypingSocket;
