import React, { useEffect } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
function ChatHeader() {
  const { setSelectedChat, selectedChat, toggleProfile } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  useEffect(() => {
    console.log("Updated selectedChat:", selectedChat);
  }, [selectedChat]);
  if (!selectedChat) return null;
  const isGroup = selectedChat.isGroup;
  const otherParticipant = !isGroup
    ? selectedChat.participants.find(
        (participant) => participant._id !== authUser._id
      )
    : null;

  // ✅ Get correct chat name and image
  const chatName = isGroup
    ? selectedChat.groupName
    : otherParticipant?.fullName;
  const chatImage = isGroup
    ? selectedChat.groupImage || "default-group.png"
    : otherParticipant?.profilePic || "default-avatar.png";

  return (
    <>
      <header
        onClick={toggleProfile}
        className="p-4 border-b border-gray-100 lg:p-6 flex items-center sticky top-0 bg-white z-10 shadow-sm"
      >
        <div className="flex items-center w-full">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent clicking header from opening profile when going back
              setSelectedChat(null);
            }}
            className="block  lg:hidden p-2 text-gray-500 user-chat-remove text-16"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>

          <div className=" flex  cursor-pointer">
            <img
              src={chatImage || "default-avatar.png"}
              className="rounded-full h-9 w-9 rtl:ml-3 ltr:mr-3"
              alt={chatName}
            />

            <div className="flex-grow overflow-hidden ml-4">
              {/* Show selected user name or default message */}
              <h5 className="mb-0 truncate text-16 text-gray-800">
                {chatName}
                {!isGroup && onlineUsers.includes(otherParticipant?._id) ? (
                  <i className="ml-1 text-10 text-green-400 ri-record-circle-fill"></i>
                ) : (
                  <i className="ml-1 text-10 text-red-400 ri-record-circle-fill"></i>
                )}
              </h5>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default ChatHeader;
