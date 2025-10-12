import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Newspaper, Wallet, MessageCircle } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Feed from './pages/Feed';
import Expenses from './pages/Expenses';
import Chat from './pages/Chat';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function MainLayout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  // pages that hide bottom nav + header (like login)
  const hideUI = location.pathname === '/login';

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {!hideUI && <Header />}

      <div className="flex-1 p-6 pb-24">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/feed' : '/login'} />} />
        </Routes>
      </div>

      {!hideUI && <BottomNav />}
    </div>
  );
}

function NavItem({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
        active
          ? 'bg-white/70 dark:bg-gray-700/70 text-black dark:text-white shadow'
          : 'hover:bg-white/30 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export default App;