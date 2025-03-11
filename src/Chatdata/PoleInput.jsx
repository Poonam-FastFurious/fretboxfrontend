import { Plus, Send, Smile, X } from "lucide-react";
import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";

function PoleInput({ onClose }) {
  const { sendPoll, selectedChat } = useChatStore();

  // State for poll question and options
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // Minimum 2 options required

  // Handle sending poll
  const handleSendPoll = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please provide a question and at least two valid options.");
      return;
    }

    const pollData = {
      question,
      options,
    };

    await sendPoll(pollData, selectedChat);
    onClose(); // Close modal after sending
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[550px] bg-white shadow-lg rounded-xl p-4 relative">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-2 right-2 p-1">
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">Create Poll</h2>

          {/* Question Input */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm font-medium">
              Question
            </label>
            <div className="flex items-center border-b border-gray-300 py-1">
              <input
                type="text"
                placeholder="Ask question"
                className="w-full border-none focus:ring-0 outline-none p-2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Smile className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Options Input */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm font-medium">Options</label>
            {options.map((opt, index) => (
              <div
                key={index}
                className="flex items-center border-b border-gray-300 py-1"
              >
                <input
                  type="text"
                  placeholder="Add"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="w-full border-none focus:ring-0 outline-none p-12"
                />
                <Smile className="w-5 h-5 text-gray-500 cursor-pointer mx-2" />
              </div>
            ))}
            <button
              onClick={() => setOptions([...options, ""])}
              className="flex items-center text-blue-600 text-sm mt-12"
            >
              <Plus className="w-4 h-4 mr-1" /> Add option
            </button>
          </div>

          {/* Multiple Answers Toggle */}

          {/* Send Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSendPoll}
              className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PoleInput;
