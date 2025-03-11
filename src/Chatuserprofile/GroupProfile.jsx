import React from "react";
import { Trash2 } from "lucide-react"; // Trash icon from lucide-react
import { useChatStore } from "../store/useChatStore";

function GroupProfile({ chatDetails }) {
  const { removeUserFromGroup } = useChatStore();
  return (
    <div>
      <p className="mb-1 text-gray-500">Participants</p>
      <ul>
        {chatDetails.participants.map((user, index) => (
          <li key={index} className="flex items-center gap-3 mb-3">
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt={user.fullName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <h5 className="text-sm">
                {user.fullName}
                {user._id === chatDetails.groupAdmin._id && (
                  <span className="text-xs text-green-500 ml-2">Admin</span>
                )}
              </h5>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {/* Remove button (hide if user is admin) */}
            {user._id !== chatDetails.groupAdmin._id && (
              <button
                onClick={() => removeUserFromGroup(chatDetails._id, user._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupProfile;
