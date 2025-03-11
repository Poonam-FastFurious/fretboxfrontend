import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import MessageSkeleton from "../Messagekelton";

const MessageList = () => {
  const {
    selectedChat,
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedChat._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedChat, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  if (isMessagesLoading) {
    return (
      <div className="w-full h-[100vh] flex flex-col bg-white user-chat">
        <MessageSkeleton />
      </div>
    );
  }
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy!"));
  };
  return (
    <div className="flex-1 w-full overflow-y-auto p-4 lg:p-6 h-0">
      <ul className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageItem key={msg._id} {...msg} handleCopy={handleCopy} />
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
      </ul>
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
