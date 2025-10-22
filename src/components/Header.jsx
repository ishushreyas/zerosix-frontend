// components/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { Plus, User, Sun, Moon } from 'lucide-react';
import AddRoomModal from './AddRoomModal';
import AddExpenseModal from './AddExpenseModal';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const addMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(e.target) &&
        !profileMenuRef.current?.contains(e.target)
      ) {
        setShowAddMenu(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseMenuClass =
    'absolute mt-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 overflow-hidden z-30 transition-all animate-fade-in';

  const buttonClass =
    'p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md hover:shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/80 transition-all backdrop-blur-lg';

  return (
    <header className="flex items-center justify-between px-4 py-3 relative bg-transparent select-none">
      {/* Left Add Button */}
      <div className="relative" ref={addMenuRef}>
        <button
          aria-label="Add menu"
          className={buttonClass}
          onClick={() => {
            setShowAddMenu((prev) => !prev);
            setShowProfileMenu(false);
          }}
        >
          <Plus className="h-5 w-5 text-gray-800 dark:text-gray-100" />
        </button>

        {showAddMenu && (
          <div className={`${baseMenuClass} left-0 w-48`}>
            <button
              className="w-full text-left px-5 py-3 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
              onClick={() => {
                setShowAddRoom(true);
                setShowAddMenu(false);
              }}
            >
              Add Room
            </button>
            <button
              className="w-full text-left px-5 py-3 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
              onClick={() => {
                setShowAddExpense(true);
                setShowAddMenu(false);
              }}
            >
              Add Expense
            </button>
          </div>
        )}
      </div>

      {/* Center Title */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
        Expense Manager
      </h1>

      {/* Right Profile Button */}
      <div className="relative" ref={profileMenuRef}>
        <button
          aria-label="Profile menu"
          className={buttonClass}
          onClick={() => {
            setShowProfileMenu((prev) => !prev);
            setShowAddMenu(false);
          }}
        >
          <User className="h-5 w-5 text-gray-800 dark:text-gray-100" />
        </button>

        {showProfileMenu && (
          <div className={`${baseMenuClass} right-0 w-44`}>
            <button className="w-full text-left px-5 py-3 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition">
              Profile
            </button>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-5 py-3 flex items-center justify-between text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
            >
              Theme
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddRoom && <AddRoomModal onClose={() => setShowAddRoom(false)} />}
      {showAddExpense && <AddExpenseModal onClose={() => setShowAddExpense(false)} />}
    </header>
  );
}