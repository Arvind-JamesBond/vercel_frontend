import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const GroupChatModal = ({ onClose }) => {
  const { authUser } = useAuthStore();
  const { createGroupChat, getGroups, users } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Toggle participant selection
  const handleSelectParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length === 0) {
      alert("Please enter a group name and select participants.");
      return;
    }

    try {
      await createGroupChat({ groupName, members: selectedParticipants });
      await getGroups(); // refresh sidebar group list
      onClose();
    } catch (error) {
      console.error("Failed to create group chat:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Group Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Enter group name"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Participants */}
        <div className="mb-4 max-h-60 overflow-y-auto">
          <h3 className="text-sm font-medium mb-2 text-gray-300">
            Select Participants
          </h3>
          <div className="space-y-2">
            {users
              .filter((user) => user._id !== authUser?._id)
              .map((user) => (
                <label
                  key={user._id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedParticipants.includes(user._id)
                      ? "bg-blue-600/40 border border-blue-500"
                      : "hover:bg-gray-800/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(user._id)}
                    onChange={() => handleSelectParticipant(user._id)}
                    className="accent-blue-500"
                  />
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-8 rounded-full object-cover border border-gray-700"
                  />
                  <span className="text-sm truncate">{user.fullName}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
