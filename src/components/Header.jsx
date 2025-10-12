import React, { useState, useRef, useEffect } from 'react';
import { Plus, User, Sun, Moon } from 'lucide-react';
import AddRoomModal from './AddRoomModal';
import AddExpenseModal from './AddExpenseModal';

// Apple-inspired, rounded, soft-neumorphism header using Tailwind CSS + lucide-react
export default function Header({ theme, setTheme }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // close menus on outside click
  const addRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (addRef.current && !addRef.current.contains(e.target)) setShowAddMenu(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    }
    document.addEventListener('pointerdown', onDocClick);
    return () => document.removeEventListener('pointerdown', onDocClick);
  }, []);

  return (
    <header className="flex items-center justify-between mb-6 relative px-2 md:px-6">
      {/* Left - Add */}
      <div className="relative" ref={addRef}>
        <button
          aria-label="Add"
          aria-expanded={showAddMenu}
          onClick={() => setShowAddMenu(s => !s)}
          className={`group relative flex items-center justify-center h-11 w-11 rounded-full transition-transform transform hover:scale-105 focus:outline-none
            bg-gradient-to-br from-white/80 to-gray-100/60 dark:from-gray-900/70 dark:to-gray-800/60
            backdrop-blur-sm border border-white/40 dark:border-black/40
            shadow-[8px_8px_20px_rgba(13,14,18,0.06),-8px_-8px_20px_rgba(255,255,255,0.6)]`}
        >
          <Plus className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>

        {showAddMenu && (
          <div
            role="menu"
            className="absolute left-0 mt-3 w-48 rounded-2xl overflow-hidden z-30
              bg-white/70 dark:bg-gray-900/65 backdrop-blur-md border border-white/30 dark:border-black/30
              shadow-2xl ring-1 ring-black/5"
          >
            <button
              onClick={() => { setShowAddRoom(true); setShowAddMenu(false); }}
              className="w-full text-left px-4 py-3 hover:bg-white/40 dark:hover:bg-white/5 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-white/60 dark:bg-black/30 shadow-sm">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Add Room</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Create a new room</div>
              </div>
            </button>

            <button
              onClick={() => { setShowAddExpense(true); setShowAddMenu(false); }}
              className="w-full text-left px-4 py-3 hover:bg-white/40 dark:hover:bg-white/5 transition flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-white/60 dark:bg-black/30 shadow-sm">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Add Expense</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Log a new expense</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Center Title */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto text-center">
          <div className="text-lg font-semibold tracking-tight select-none">
            <span className="inline-block px-3 py-1 rounded-2xl bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Expense</span>
            <span className="ml-2 text-gray-800 dark:text-gray-100">Manager</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Smart, simple and beautiful</div>
        </div>
      </div>

      {/* Right - Profile & Theme */}
      <div className="relative flex items-center gap-3" ref={profileRef}>
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="flex items-center gap-2 h-10 px-3 rounded-xl transition-transform hover:scale-[1.02] focus:outline-none
            bg-white/75 dark:bg-gray-900/65 backdrop-blur-sm border border-white/30 dark:border-black/30 shadow-md"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="text-sm hidden sm:inline text-gray-700 dark:text-gray-200">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Profile */}
        <button
          aria-label="Profile"
          aria-expanded={showProfileMenu}
          onClick={() => setShowProfileMenu(s => !s)}
          className="h-11 w-11 rounded-full flex items-center justify-center focus:outline-none
            bg-gradient-to-br from-white/80 to-gray-100/60 dark:from-gray-900/70 dark:to-gray-800/60
            border border-white/30 dark:border-black/30 shadow-[inset_6px_6px_16px_rgba(13,14,18,0.04),0_8px_24px_rgba(2,6,23,0.08)]"
        >
          <User className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>

        {showProfileMenu && (
          <div
            role="menu"
            className="absolute right-0 mt-3 w-44 rounded-2xl overflow-hidden z-30
              bg-white/70 dark:bg-gray-900/65 backdrop-blur-md border border-white/30 dark:border-black/30 shadow-2xl"
          >
            <button className="w-full text-left px-4 py-3 hover:bg-white/40 dark:hover:bg-white/5 transition">
              Profile
            </button>
            <button
              onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setShowProfileMenu(false); }}
              className="w-full text-left px-4 py-3 hover:bg-white/40 dark:hover:bg-white/5 transition flex items-center justify-between"
            >
              <span>Toggle Theme</span>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Modals (kept external) */}
      {showAddRoom && <AddRoomModal onClose={() => setShowAddRoom(false)} />}
      {showAddExpense && <AddExpenseModal onClose={() => setShowAddExpense(false)} />}
    </header>
  );
}
