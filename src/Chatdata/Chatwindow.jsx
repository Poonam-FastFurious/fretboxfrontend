import React from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

import MessageList from "./Messagelist";
import { useChatStore } from "../store/useChatStore";

function Chatwindow() {
  const { selectedChat } = useChatStore();

  return (
    <>
      <div
        className={`w-full h-[100vh] flex flex-col bg-white user-chat ${
          selectedChat ? "user-chat-show" : ""
        }`}
      >
        <ChatHeader />
        <MessageList />
        <ChatInput />
      </div>
    </>
  );
}

export default Chatwindow;
