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
    const baseClasses = "w-full justify-start";
    return isActive 
      ? `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90` 
      : `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
  };
  
  const getMobileNavLinkClass = ({ isActive }) => {
     const baseClasses = "flex flex-col h-auto items-center justify-center p-2 rounded-md";
     return isActive
        ? `${baseClasses} bg-accent text-accent-foreground`
        : `${baseClasses} text-muted-foreground`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <NavLink to="/" className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">MessagingApp</h1>
            </NavLink>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <NavLink to="/profile" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user?.displayName || user?.email}</span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r bg-background/95 p-4 hidden md:block">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
                   {(props) => (
                    <Button variant="ghost" className={getNavLinkClass(props)}>
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                    </Button>
                   )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* Child routes will render here */}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around p-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={`mobile-${item.path}`} to={item.path} className={getMobileNavLinkClass}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;