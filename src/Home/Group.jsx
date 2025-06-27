import { useEffect, useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

function Group() {
  const {
    chatList,
    fetchChats,
    setSelectedChat,
    createGroupChat,
    fetchChatUsers,
    chatuserList,
    isUsersLoading,
  } = useChatStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChats();
    fetchChatUsers(); // ✅ Fetch users from store
  }, [fetchChatUsers, fetchChats]);

  const groupChats = chatList.filter((chat) => chat.isGroup);
  const filteredGroups = groupChats.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 1) {
      toast.error("Please enter a group name & select at least one users");
      return;
    }

    try {
      await createGroupChat({
        name: groupName,
        users: selectedUsers,
        image: groupImage,
      });

      // Reset form & close modal
      setIsModalOpen(false);
      setGroupName("");
      setGroupImage("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="flex-grow">
      <div className="chat-leftsidebar w-full md:w-[450px] lg:w-[380px] max-w-full bg-white h-screen flex flex-col border-x-[1px] border-gray-200">
        {/* Header + Create Group Button */}
        <div className="px-6 pt-6 bg-white z-10">
          <div className=" flex  justify-between">
            <h4 className="mb-0 text-gray-700">Groups</h4>
            <button
              onClick={() => setIsModalOpen(true)}
              className="  p-2 rounded-full  transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {/* Search Bar */}
          <div className="py-1 mt-5 mb-5 bg-gray-100 flex items-center rounded-lg">
            <span className="bg-gray-100 pe-1 ps-3">
              <i className="text-lg text-gray-400 ri-search-line"></i>
            </span>
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="border-0 bg-gray-100 placeholder:text-[14px] focus:ring-0 focus:outline-none placeholder:text-gray-400 flex-grow px-2"
              placeholder="Search messages or users"
            />
          </div>
        </div>

        {/* Group List */}
        <div className="h-[calc(100vh-250px)] sm:h-[calc(100vh-40px)] px-2 overflow-y-auto custom-scrollbar">
          <ul className="chat-user-list">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <li
                  key={group._id}
                  onClick={() => setSelectedChat(group)}
                  className="flex items-center justify-between hover:bg-gray-100 px-5 py-[15px] transition-all border-b border-gray-200 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="relative self-center mr-3">
                      <img
                        src={
                          group.groupImage || "https://via.placeholder.com/40"
                        }
                        className="rounded-full w-9 h-9"
                        alt={group.groupName}
                      />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h5 className="mb-1 text-base truncate">
                        {group.groupName}
                      </h5>
                      <p className="mb-0 text-gray-500 truncate text-14">
                        {group.latestMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-5">No Groups Found</p>
            )}
          </ul>
        </div>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[500px] bg-white shadow-lg rounded-xl p-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 p-1"
            >
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900">
              Create Group
            </h2>

            {/* Group Name Input */}
            <div className="mt-4">
              <label className="text-gray-700 text-sm font-medium">
                Group Name
              </label>
              <div className="flex items-center border-b border-gray-300 py-2">
                <input
                  type="text"
                  placeholder="Enter group name"
                  className="w-full border-none focus:ring-0 outline-none p-2"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>

            {/* Group Image Input */}
            <div className="mt-4">
              <label className="text-gray-700 text-sm font-medium">
                Group Image URL (optional)
              </label>
              <div className="flex items-center border-b border-gray-300 py-2">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border-none focus:ring-0 outline-none p-2"
                  onChange={(e) => setGroupImage(e.target.files[0])}
                />
                {groupImage && (
                  <img
                    src={URL.createObjectURL(groupImage)}
                    alt="preview"
                    className="w-20 h-20 mt-2 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* User Selection */}
            <div className="mt-4">
              <label className="text-gray-700 text-sm font-medium">
                Select Members
              </label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {isUsersLoading ? (
                  <p className="text-center text-gray-500">Loading users...</p>
                ) : (
                  chatuserList.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => toggleUserSelection(user._id)}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                        selectedUsers.includes(user._id)
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            user.profilePic || "https://via.placeholder.com/40"
                          }
                          className="w-8 h-8 rounded-full mr-2"
                          alt={user.name}
                        />
                        <span className="text-sm">{user.fullName}</span>
                      </div>
                      {selectedUsers.includes(user._id) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Users */}
            <div className="flex flex-wrap mt-2">
              {selectedUsers.map((userId) => {
                const user = chatuserList.find((u) => u._id === userId);
                return (
                  <span
                    key={userId}
                    className="bg-blue-200 text-blue-700 text-sm px-2 py-1 rounded-full mr-2 mt-1"
                  >
                    {user?.fullName}
                  </span>
                );
              })}
            </div>

            {/* Create Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCreateGroup}
                className="bg-green-600 text-white rounded-full px-5 py-2 hover:bg-green-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Group;
