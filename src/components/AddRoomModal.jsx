import { useState } from "react";
import { X, CircleCheck, Plus, Search } from "lucide-react";
import api from "../api";

export default function AddGroupModal() {
  const [group, setGroup] = useState({
    name: "",
    description: "",
    members: [],
    avatar: null,
  });
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const users = [
    { id: 1, username: "Alice" },
    { id: 2, username: "Bob" },
    { id: 3, username: "Charlie" },
    { id: 4, username: "David" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !group.members.includes(u.id)
  );

  const handleMemberSelect = (id) => {
    setGroup({ ...group, members: [...group.members, id] });
    setSearchTerm("");
    setIsMemberOpen(false);
  };

  const handleMemberRemove = (id) => {
    setGroup({ ...group, members: group.members.filter((m) => m !== id) });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setGroup({ ...group, avatar: URL.createObjectURL(file) });
  };

  const handleCreateGroup = async () => {
    if (!group.name || !group.members.length) {
      setError("Group name and members are required");
      return;
    }
    try {
      await api.createGroup(group);
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to create group");
    }
  };

  const resetForm = () => {
    setGroup({ name: "", description: "", members: [], avatar: null });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-lg">Add Group</h2>
          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden hover:shadow-lg transition">
                {group.avatar ? (
                  <img src={group.avatar} alt="Group Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="text-gray-400 dark:text-gray-300" size={32} />
                )}
              </div>
            </label>
            <input id="avatar" type="file" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={group.name}
              onChange={(e) => setGroup({ ...group, name: e.target.value })}
              placeholder="Enter group name"
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={group.description}
              onChange={(e) => setGroup({ ...group, description: e.target.value })}
              placeholder="Add a description"
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          {/* Members */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Members
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {group.members.map((id) => {
                const user = users.find((u) => u.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white text-sm cursor-pointer"
                    onClick={() => handleMemberRemove(id)}
                  >
                    {user.username} <X className="w-3 h-3" />
                  </div>
                );
              })}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-10 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
              <Search className="absolute left-3 top-4 text-gray-400 dark:text-gray-500" size={18} />
              {isMemberOpen && filteredUsers.length > 0 && (
                <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 backdrop-blur-sm rounded-2xl shadow-lg max-h-48 overflow-auto border border-gray-200 dark:border-gray-600">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.id}
                      onClick={() => handleMemberSelect(u.id)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between transition-colors first:rounded-t-2xl last:rounded-b-2xl text-gray-900 dark:text-gray-100"
                    >
                      {u.username}
                      <CircleCheck className="text-blue-600 dark:text-blue-400" size={16} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateGroup}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-gray-700 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium mt-4"
          >
            Create Group
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 mt-2">
              <p className="text-red-600 dark:text-red-400 text-center text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}