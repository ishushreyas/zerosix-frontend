import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Home,
  MessageCircle,
  Bell,
  User,
  Sun,
  Moon,
  CreditCard,
  Megaphone,
} from 'lucide-react';

const MainLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/updates', label: 'Updates', icon: Megaphone },
  ];

  const getNavLinkClass = ({ isActive }) => {
    const base = 'w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200';
    return isActive
      ? `${base} bg-blue-500 text-white hover:bg-blue-600 shadow-lg scale-105`
      : `${base} text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white`;
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    const base = 'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200';
    return isActive
      ? `${base} bg-blue-500 text-white shadow-lg scale-105`
      : `${base} text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                MessagingApp
              </h1>
            </NavLink>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <NavLink
                to="/profile"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="h-9 w-9 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline max-w-32 truncate">
                  {user?.displayName || user?.email}
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="z-10 w-72 p-6 hidden md:block">
          <div className="space-y-2">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} className={getNavLinkClass}>
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl min-h-[calc(100vh-12rem)] p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 mx-4 mb-4 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl z-50">
        <div className="flex justify-around p-2">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className={getMobileNavLinkClass}>
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;