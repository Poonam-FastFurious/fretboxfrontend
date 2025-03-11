import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

import { useAuthStore } from "../store/useAuthStore";
import GroupProfile from "./GroupProfile";
import OneToOneProfile from "./OneToOneProfile";

function Showprofile() {
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const {
    selectedChat,
    chatDetails,
    toggleProfile,
    loading,
    error,
    fetchChatDetails,
    renameGroupChat,
  } = useChatStore();
  const { authUser } = useAuthStore();
  console.log("chat details ", chatDetails);

  useEffect(() => {
    if (selectedChat) {
      fetchChatDetails(selectedChat._id);
    }
  }, [selectedChat, fetchChatDetails]);

  if (!selectedChat) return null;

  const loggedInUserId = authUser._id;
  const isGroupAdmin =
    chatDetails?.isGroup && authUser._id === chatDetails.groupAdmin._id;
  const otherUser =
    !chatDetails?.isGroup &&
    chatDetails?.participants.find((user) => user._id !== loggedInUserId);
  const handleEditClick = () => {
    setIsEditing(true);
    setNewGroupName(chatDetails.groupName); // Current name input me dikhaye
  };

  const renameGroup = async () => {
    if (!newGroupName.trim()) return;

    await renameGroupChat(selectedChat._id, newGroupName); // API call ya store update kare
    setIsEditing(false);
  };
  return (
    <>
      <div
        className={`${
          selectedChat ? "user-chat-show" : ""
        } h-[100vh] min-w-[350px] bg-white shadow overflow-y-hidden mb-[85px] lg:mb-0 border-l-4 border-gray-50 absolute xl:relative top-0 bottom-0 user-chat`}
      >
        <div className="px-6 pt-6">
          <div className="text-end">
            <button
              onClick={toggleProfile}
              type="button"
              className="text-2xl text-gray-500 border-0 btn"
              id="user-profile-hide"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>

        {!loading && !error && chatDetails && (
          <>
            {/* Profile Header */}
            <div className="px-6 text-center border-b border-gray-100">
              <div className="mb-4">
                <img
                  src={
                    chatDetails.isGroup
                      ? chatDetails.groupImage || "/default-group.png"
                      : otherUser?.profilePic || "/default-avatar.png"
                  }
                  className="w-24 h-24 p-1 mx-auto border border-gray-100 rounded-full"
                  alt={
                    chatDetails.isGroup
                      ? chatDetails.groupName
                      : otherUser?.fullName
                  }
                />
              </div>

              <h5 className="mb-1 text-16">
                {isEditing ? (
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="    px-2 py-1 text-center  focus:outline-none"
                  />
                ) : (
                  chatDetails.groupName
                )}

                {/* Edit Icon only for Admin */}
                {isGroupAdmin && !isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                )}

                {/* Save Button */}
                {isEditing && (
                  <button
                    onClick={renameGroup}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    <i className="ri-check-line"></i>
                  </button>
                )}
              </h5>
            </div>

            {/* About Section */}
            <div className="p-6 h-[550px]" data-simplebar="">
              <div>
                <div className="text-gray-700 accordion-item">
                  <h2>
                    <button
                      onClick={() => setIsPersonalOpen(!isPersonalOpen)}
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 font-medium text-left border border-gray-100 rounded-t accordion-header group active"
                    >
                      <span className="m-0 text-[14px] font-semibold ltr:block rtl:hidden">
                        <i className="mr-2 align-middle ri-user-2-line d-inline-block"></i>{" "}
                        About
                      </span>

                      <i
                        className={`mdi mdi-chevron-down text-lg transition-transform duration-300 ease-in-out ${
                          isPersonalOpen ? "rotate-180" : ""
                        }`}
                      ></i>
                    </button>
                  </h2>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out border border-t-0 border-gray-100 accordion-body ${
                      isPersonalOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="bg-white accordion-body">
                      <div className="p-5">
                        {!chatDetails.isGroup ? (
                          <>
                            <OneToOneProfile otherUser={otherUser} />
                          </>
                        ) : (
                          <GroupProfile chatDetails={chatDetails} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Showprofile;
