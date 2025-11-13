import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    getUsers,
    getGroups,
    users,
    groups,
    selectedChat,
    setSelectedChat,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="border-b border-gray-700 w-full p-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-blue-400" />
          <span className="font-semibold hidden lg:block text-gray-100">
            Chats
          </span>
        </div>

        {/* Create Group Button */}
        <button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-transform duration-200 hover:scale-110"
          title="Create Group"
        >
          <Plus className="size-5" />
        </button>
      </div>

      {/* Online Toggle */}
      <div className="mt-3 hidden lg:flex items-center justify-between px-5">
        <label className="cursor-pointer flex items-center gap-2 text-gray-300">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="accent-blue-500"
          />
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-gray-400">
          ({onlineUsers.length - 1} online)
        </span>
      </div>

      {/* Groups Section */}
      <div className="overflow-y-auto w-full py-3 flex-1">
        {groups.length > 0 && (
          <>
            <h4 className="text-xs font-semibold px-5 text-gray-400 uppercase mt-4">
              Groups
            </h4>
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedChat(group)}
                className={`w-full px-5 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 ${
                  selectedChat?._id === group._id
                    ? "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-500 shadow-md"
                    : "hover:bg-gray-800/60"
                }`}
              >
                <div className="relative">
                  <Users className="size-10 text-blue-400" />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate text-gray-100">
                    {group.groupName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {group.members.length} members
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {/* Contacts Section */}
        <h4 className="text-xs font-semibold px-5 text-gray-400 uppercase mt-5">
          Contacts
        </h4>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedChat(user)}
            className={`w-full px-5 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 ${
              selectedChat?._id === user._id
                ? "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-500 shadow-md"
                : "hover:bg-gray-800/60"
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-10 object-cover rounded-full border border-gray-600"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-gray-900 animate-pulse"></span>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate text-gray-100">
                {user.fullName}
              </div>
              <div
                className={`text-xs ${
                  onlineUsers.includes(user._id)
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">
            No users found
          </div>
        )}
      </div>

      {/* Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
