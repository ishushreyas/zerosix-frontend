// components/MainLayout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Home, MessageCircle, Bell, User, Sun, Moon, CreditCard, Megaphone } from 'lucide-react';

const MainLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/updates', label: 'Updates', icon: Megaphone },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "w-full justify-start transition-all duration-200 ease-in-out rounded-xl";
    return isActive 
      ? `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 shadow-lg transform scale-105` 
      : `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white`;
  };
  
  const getMobileNavLinkClass = ({ isActive }) => {
     const baseClasses = "flex flex-col h-auto items-center justify-center p-3 rounded-2xl transition-all duration-200 ease-in-out";
     return isActive
        ? `${baseClasses} bg-blue-500 text-white shadow-lg transform scale-105`
        : `${baseClasses} text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                MessagingApp
              </h1>
            </NavLink>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <NavLink to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                <Avatar className="h-9 w-9 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
        <nav className="w-72 p-6 hidden md:block">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
                   {(props) => (
                    <Button variant="ghost" className={getNavLinkClass(props) + " h-12 font-medium"}>
                        <Icon className="h-5 w-5 mr-4" />
                        {item.label}
                    </Button>
                   )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/10 dark:shadow-black/20 min-h-[calc(100vh-12rem)] p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-700/50 z-50 mx-4 mb-4 rounded-3xl shadow-2xl shadow-gray-900/10 dark:shadow-black/20">
        <div className="flex justify-around p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={`mobile-${item.path}`} to={item.path} className={getMobileNavLinkClass}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;