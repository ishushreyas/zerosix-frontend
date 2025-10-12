import { useState } from 'react';
import { Plus, User, Sun, Moon } from 'lucide-react';

export default function Header({ theme, setTheme }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6 relative">
      {/* Left Add Menu */}
      <div className="relative">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus className="h-5 w-5" />
        </button>
        {showAddMenu && (
          <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden z-10">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Room</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Expense</button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="font-semibold text-lg">Expense Manager</div>

      {/* Right Profile Menu */}
      <div className="relative">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <User className="h-5 w-5" />
        </button>
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden z-10">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
            >
              Theme
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
