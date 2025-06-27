import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../Lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import useDebounce from "../store/useDebounce";
import useTypingSocket from "../store/useTypingSocket";
function ChatList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState(""); // for controlled input

  const debouncedSetSearchQuery = useDebounce(
    (val) => setSearchQuery(val),
    300
  );
  const authUser = useAuthStore((state) => state.authUser);
  const currentUserId = authUser?._id;

  const { chatList, fetchChats, setSelectedChat, selectedChat, typingStatus } =
    useChatStore();

  const onlineUsers = useAuthStore.getState().onlineUsers;
  useTypingSocket();
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const getChatName = (chat) =>
    chat.isGroup
      ? chat.groupName
      : chat.participants.find((p) => p._id !== currentUserId)?.fullName ||
        "Unknown";

  const getChatImage = (chat) =>
    chat.participants.find((p) => p._id !== currentUserId)?.profilePic ||
    "default-avatar.png";

  const filterChats = () => {
    const activeChats = chatList.filter((chat) => chat.status === "active");
    return activeChats.filter((chat) => {
      const name = getChatName(chat).toLowerCase();
      const message = (chat.latestMessage || "").toLowerCase();
      return (
        name.includes(searchQuery.toLowerCase()) ||
        message.includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredChats = filterChats();
  return (
    <div className="flex-grow">
      <div className="chat-leftsidebar w-full md:w-[450px] lg:w-[380px] max-w-full bg-white h-screen flex flex-col border-x-[1px] border-gray-200">
        {/* Header */}
        <div className="px-6 pt-6 bg-white z-10">
          <h4 className="mb-0 text-gray-700">Chats</h4>

          {/* Search Bar */}
          <div className="py-1 mt-5 mb-5 bg-gray-100 flex items-center rounded-lg">
            <span className="bg-gray-100 pe-1 ps-3">
              <i className="text-lg text-gray-400 ri-search-line"></i>
            </span>
            <input
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value); // update instantly for UI
                debouncedSetSearchQuery(value); // update actual filter after delay
              }} // Update state
              type="text"
              className="border-0 bg-gray-100 placeholder:text-[14px] focus:ring-0 focus:outline-none placeholder:text-gray-400 flex-grow px-2"
              placeholder="Search messages or users"
            />
          </div>

          {/* Recent Chats Title */}
          <h5 className="mb-4 text-16">Recent</h5>
        </div>

        {/* User List */}
        <div className="h-[calc(100vh-250px)] sm:h-[calc(100vh-40px)] px-2 overflow-y-auto custom-scrollbar">
          <ul className="chat-user-list ">
            {filteredChats.map((chat) => {
              const chatName = getChatName(chat);
              const chatImage = getChatImage(chat);
              const latestMessage = chat.latestMessage || "No messages yet";

              const isOnline =
                !chat.isGroup &&
                onlineUsers.includes(chat.participants[0]?._id);

              const unreadCount = chat.unreadMessages?.[currentUserId] || 0;

              return (
                <li
                  key={chat._id}
                  onClick={async () => {
                    setSelectedChat(chat);
                    if (chat.unreadMessages?.[currentUserId] > 0) {
                      await useChatStore
                        .getState()
                        .markMessagesAsRead(chat._id);
                    }
                  }}
                  className={` ${
                    selectedChat?._id === chat._id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  } flex items-center justify-between hover:bg-gray-100 px-5 py-[15px] transition-all border-b border-gray-200 cursor-pointer rounded-md"`}
                >
                  <div className="flex items-center">
                    <div className="relative self-center mr-3">
                      <img
                        src={chatImage || "default-avatar.png"}
                        className="rounded-full w-9 h-9"
                        alt={chatName}
                      />
                      {!chat.isGroup && (
                        <span
                          className={`absolute w-2.5 h-2.5 border-2 border-white rounded-full top-7 right-1 ${
                            isOnline ? "bg-green-400" : "bg-gray-400"
                          }`}
                        ></span>
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden max-w-[220px]">
                      <h5 className="mb-1 text-base truncate">{chatName}</h5>
                      <p className="mb-0 text-gray-500 truncate text-14">
                        {typingStatus[chat._id] ? "Typing..." : latestMessage}
                      </p>
                    </div>
                  </div>

                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}

                  <span className="  text-xs font-bold px-2 py-1 rounded-full">
                    {formatMessageTime(chat.updatedAt)}
                  </span>
                </li>
              );
            })}
          </ul>
          {filteredChats.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No chat users</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
