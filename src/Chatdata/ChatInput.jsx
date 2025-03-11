import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import PoleInput from "./PoleInput";
import { useChatStore } from "../store/useChatStore";

function ChatInput() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { sendMessage, selectedChat } = useChatStore();
  const [showPoll, setShowPoll] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowPopup(false);
      // ✅ Image Preview Logic
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleRemovePreview = () => {
    setFile(null);
    setPreview(null);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !file) || !selectedChat) return; // ✅ Prevent empty messages

    setIsSending(true); // ✅ Start loading
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append(
        "messageType",
        file.type.startsWith("video") ? "video" : "image"
      );
    } else {
      formData.append("content", message);
      formData.append("messageType", "text");
    }
    await sendMessage(formData, selectedChat);

    setMessage(""); // ✅ Clear input after sending
    setFile(null); // ✅ Clear file
    setPreview(null); // ✅ Clear preview
    setIsSending(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <>
      <footer className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <div className="flex gap-2 items-center relative">
          <button
            className="text-gray-500 text-16 border border-gray-300 rounded-lg px-3 py-2"
            onClick={() => setShowPopup(!showPopup)}
          >
            {showPopup ? (
              <i className="ri-close-circle-fill "></i>
            ) : (
              <i className="ri-file-add-fill "></i>
            )}
          </button>

          {showPopup && (
            <div className="absolute bottom-24 left-2 rounded-xl p-2 w-52 shadow-2xl bg-gray-200">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 p-2 hover:bg-white cursor-pointer rounded-md">
                  📄 Document
                </li>
                <li className="flex items-center gap-2 p-2 hover:bg-white cursor-pointer rounded-md">
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    🖼️ Photos & Videos
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </li>
                <li
                  onClick={() => {
                    setShowPoll(true);
                    setShowPopup(false);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-white cursor-pointer rounded-md"
                >
                  📊 Poll
                </li>
              </ul>
            </div>
          )}
          {preview && (
            <div className="absolute bottom-20 left-2 bg-white shadow-md p-2 rounded-lg flex items-center gap-2">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md"
              />
              <button onClick={handleRemovePreview} className="text-red-500">
                ❌
              </button>
            </div>
          )}
          {/* Emoji Picker Button */}

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 text-16 border border-gray-300 rounded-lg px-3 py-2"
          >
            😀
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-16 sm:left-12 left-0 bg-white shadow-lg rounded-lg p-2 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <form
            className="w-full gap-4 mx-auto flex"
            onSubmit={handleSendMessage}
            encType="multipart/form-data"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-[70%] border border-gray-300 rounded-lg p-2 text-14 bg-gray-50 placeholder-gray-500"
              placeholder="Enter Message..."
              disabled={isSending}
            />

            <button
              type="submit"
              className={`px-3 py-2 rounded-lg bg-purple-400  ${
                isSending ? "opacity-50" : ""
              }`}
              disabled={isSending}
            >
              {/* <div className="loader border-t-4 border-white border-solid rounded-full w-4 h-4 animate-spin"></div> */}

              {isSending ? (
                <div className="loader border-t-4 border-white border-solid rounded-full w-4 h-4 animate-spin"></div>
              ) : (
                <i className="ri-send-plane-2-fill"></i>
              )}
            </button>
          </form>
        </div>
      </footer>
      {showPoll && <PoleInput onClose={() => setShowPoll(false)} />}
    </>
  );
}

export default ChatInput;
