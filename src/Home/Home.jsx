import React from "react";
import Aside from "./Aside";
import { useAuthStore } from "../store/useAuthStore";
import ChatList from "./ChatList";
import Profile from "./Profile";
import Group from "./Group";
import Contact from "./Contact";
import Setting from "./Setting";
import Chatwindow from "../Chatdata/Chatwindow";
import { useChatStore } from "../store/useChatStore";
import Showprofile from "../Chatuserprofile/Showprofile";

function Home() {
  const { activeTab } = useAuthStore();
  const { selectedChat, isProfileOpen } = useChatStore();
  return (
    <>
      <div className="bg-[#85b0c0] overflow-hidden">
        <div className="sm:w-[80%] mx-auto">
          <div className="flex">
            <Aside />
            <div className="flex-grow">
              {activeTab === "Chats" && <ChatList />}
              {activeTab === "Profile" && <Profile />}
              {activeTab === "Groups" && <Group />}
              {activeTab === "Contacts" && <Contact />}
              {activeTab === "Settings" && <Setting />}
            </div>

            {selectedChat && <Chatwindow />}
            {isProfileOpen && <Showprofile />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
