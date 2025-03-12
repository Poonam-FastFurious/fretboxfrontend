import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../../../backupfretbox/src/Lib/Utils";
import { useAuthStore } from "../store/useAuthStore";
function ChatList() {
  const [searchQuery, setSearchQuery] = useState("");

  const { chatList, fetchChats, setSelectedChat, selectedChat } =
    useChatStore();
  useEffect(() => {
    fetchChats();
  }, []);
  useEffect(() => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", () => {
      fetchChats(); // Chat list ko update karega jab naya message aaye
    });

    return () => {
      socket.off("newMessage"); // Cleanup
    };
  }, []);

  const activeChats = chatList.filter((chat) => chat.status === "active");

  const filteredChats = activeChats.filter((chat) => {
    const isGroup = chat.isGroup;
    const chatName = isGroup ? chat.groupName : chat.participants[0].fullName;
    const latestMessage = chat.latestMessage || "";

    return (
      chatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      latestMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update state
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
              const isGroup = chat.isGroup;
              const chatName = isGroup
                ? chat.groupName
                : chat.participants[0].fullName;
              const chatImage = isGroup
                ? chat.groupImage
                : chat.participants[0].profilePic;
              const latestMessage = chat.latestMessage || "No messages yet";
              // const unreadMessages = chat.unreadMessages
              //   ? Object.values(chat.unreadMessages)[0]
              //   : 0;

              return (
                <li
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
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
                      {!isGroup && (
                        <span
                          className={`absolute w-2.5 h-2.5 border-2 border-white rounded-full top-7 right-1 
    ${
      useAuthStore.getState().onlineUsers.includes(chat.participants[0]._id)
        ? "bg-green-400"
        : "bg-gray-400"
    }`}
                        ></span>
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h5 className="mb-1 text-base truncate">{chatName}</h5>
                      <p className="mb-0 text-gray-500 truncate text-14">
                        {latestMessage}
                      </p>
                    </div>
                  </div>

                  {/* {unreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadMessages}
                    </span>
                  )} */}

                  <span className="  text-xs font-bold px-2 py-1 rounded-full">
                    {formatMessageTime(chat.updatedAt)}
                  </span>
                </li>
              );
            })}
          </ul>
          {filteredChats.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No chat users
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
