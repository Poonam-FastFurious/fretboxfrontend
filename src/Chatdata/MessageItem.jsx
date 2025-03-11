import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; // ✅ Get current user
import moment from "moment";
import { useChatStore } from "../store/useChatStore";

const MessageItem = ({
  sender,
  content,
  media,
  messageType,
  createdAt,
  handleCopy,
  poll,
  _id: messageId,
}) => {
  const { authUser } = useAuthStore(); // ✅ Get logged-in user
  const { deleteMessage } = useChatStore();
  const voteOnPoll = useChatStore((state) => state.voteOnPoll);
  const senderId = typeof sender === "string" ? sender : sender?._id;
  const senderProfilePic = sender?.profilePic || "/default-profile.png"; // ✅ Check message sender
  const isSentByMe = senderId === authUser._id;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    if (poll) {
      const votedOptionIndex = poll.options.findIndex((option) =>
        option.votesby?.includes(authUser._id)
      );
      if (votedOptionIndex !== -1) {
        setSelectedOption(votedOptionIndex);
      }
    }
  }, [poll, authUser._id]);

  const handleVote = (optionIndex) => {
    if (selectedOption === optionIndex) return; // ✅ पहले वाले वोट पर क्लिक करने से कुछ ना हो
    setSelectedOption(optionIndex);
    voteOnPoll(messageId, optionIndex); // ✅ Send vote to backend
  };
  const handleDelete = async () => {
    await deleteMessage(messageId); // ✅ Call delete function
    setDropdownOpen(false); // ✅ Close dropdown after deleting
  };
  return (
    <li
      className={`flex w-full ${
        isSentByMe ? "justify-end" : "justify-start"
      } py-4 relative`}
    >
      {!isSentByMe && (
        <img
          src={senderProfilePic}
          alt="Sender"
          className="rounded-full h-9 w-9 mr-2"
        />
      )}

      <div
        className={`max-w-[75%] relative px-4 py-3 rounded-lg shadow-md ${
          isSentByMe ? "bg-blue-100" : "bg-gray-200"
        }`}
      >
        {/* ✅ Render Message Based on Type */}
        {messageType === "text" && <p>{content}</p>}

        {messageType === "image" && (
          <img src={media} alt="Sent" className="max-w-40 rounded-lg" />
        )}

        {messageType === "video" && (
          <video src={media} controls className="max-w-40 rounded-lg"></video>
        )}

        {messageType === "file" && (
          <div className="mt-2 flex items-center space-x-2">
            <i className="ri-file-line text-gray-500"></i>
            <a href={media} download className="text-blue-500">
              Download File
            </a>
          </div>
        )}
        {messageType === "poll" && poll && (
          <div className="mt-2 p-3 bg-white rounded-lg shadow">
            <p className="font-semibold">{poll.question}</p>
            <ul className="mt-2">
              {poll.options.map((option, index) => (
                <li
                  key={option._id}
                  className="py-2 px-3 border rounded-md my-1 bg-gray-100 flex justify-between"
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`poll-${poll._id}`}
                      value={index}
                      className="mr-2"
                      onChange={() => handleVote(index)}
                      checked={selectedOption === index} // ✅ Disable after voting
                    />
                    {option.optionText}
                  </label>
                  <span className="text-sm text-gray-500">
                    {option.votesby?.length} votes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-1 text-xs text-gray-500">
          {moment(createdAt).format("hh:mm A")}
        </p>
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <i className="ri-more-2-fill"></i>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            className={`absolute w-[100px] bg-white border rounded shadow-lg z-50 ${
              isSentByMe ? "right-0" : "left-0"
            }`}
            style={{ top: "100%", marginTop: "0px" }} // नीचे खुले
          >
            <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Reply
              <i className="text-gray-500 float-right ri-chat-forward-line"></i>
            </button>
            {content && (
              <button
                onClick={() => handleCopy(content)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Copy{" "}
                <i className="text-gray-500 float-right ri-file-copy-line"></i>
              </button>
            )}
            {isSentByMe && (
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Delete{" "}
                <i className="text-red-500 float-right ri-delete-bin-line"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {isSentByMe && (
        <img
          src={authUser.profilePic}
          alt="Me"
          className="rounded-full h-9 w-9 ml-2"
        />
      )}
    </li>
  );
};

export default MessageItem;
