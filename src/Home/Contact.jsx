import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function Contact() {
  const {
    fetchChatUsers,
    chatuserList,
    accessChat,
    chatList,
    setSelectedChat,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchChatUsers(); // ✅ Fetch users
  }, []);

  const filteredUserList = chatuserList.filter(
    (user) =>
      user._id !== authUser._id &&
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Search filter
  );

  
  // 🔍 Group contacts alphabetically
  const groupedContacts = filteredUserList.reduce((acc, contact) => {
    const firstLetter = contact.fullName.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  // 🏷️ Function to handle contact click
  const handleContactClick = async (contact) => {
    const existingChat = chatList.find(
      (chat) =>
        !chat.isGroup && chat.participants.some((p) => p._id === contact._id)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = await accessChat(contact._id);

      if (newChat) {
        setSelectedChat(newChat); // ✅ Directly set the response (which is already populated)
      }
    }
  };

  return (
    <div className="chat-leftsidebar w-full md:w-[450px] lg:w-[380px] max-w-full bg-white h-screen flex flex-col border-x-[1px] border-gray-200">
      {/* 🔝 Header */}
      <div className="px-6 pt-6 bg-white z-10 flex items-center">
      
        <h4 className="mb-0 text-gray-700">New Chats</h4>
      </div>

      {/* 🔍 Search Bar */}
      <div className="px-6">
        <div className="py-1 mt-5 mb-5 bg-gray-100 flex items-center rounded-lg">
          <span className="bg-gray-100 pe-1 ps-3">
            <i className="text-lg text-gray-400 ri-search-line"></i>
          </span>
          <input  value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="border-0 bg-gray-100 placeholder:text-[14px] focus:ring-0 focus:outline-none placeholder:text-gray-400 flex-grow px-2"
            placeholder="Search messages or users"
          />
        </div>
      </div>

      {/* 📜 Contact List */}
      <div className="h-[calc(100vh-250px)] sm:h-[calc(100vh-40px)] px-2 overflow-y-auto custom-scrollbar">
        {Object.keys(groupedContacts)
          .sort()
          .map((letter) => (
            <div key={letter} className="px-2">
              {/* 🔠 Alphabet Header */}
              <div className="p-3 font-bold text-gray-700">{letter}</div>
              <ul className="list-unstyled contact-list">
                {groupedContacts[letter].map((contact) => (
                  <li
                    key={contact._id}
                    className="flex items-center justify-between px-5 py-[15px] hover:bg-gray-100 transition-all border-b border-gray-200 cursor-pointer"
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="flex items-center">
                      <img
                        src={contact.profilePic || "default-avatar.png"}
                        className="rounded-full w-9 h-9"
                        alt={contact.fullName}
                      />
                      <div className="ml-3">
                        <h5 className="text-base">{contact.fullName}</h5>
                        <p className="text-gray-500 text-sm">
                          Hey FretBox User
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Contact;
