import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

import Login from './pages/Login';
import Feed from './pages/Feed';
import Expenses from './pages/Expenses';
import Chat from './pages/Chat';

// Root wrapper with providers
export default function App() {
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

// Handles layout, theme, and routes
function MainLayout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const hideUI = location.pathname === '/login';

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 
        ${theme === 'dark'
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-b from-gray-100 via-gray-50 to-white text-gray-900'
        }`}
    >
      {!hideUI && <Header />}

      {/* Page content area */}
      <main className="flex-1 p-6 pb-24 backdrop-blur-xl bg-white/5 dark:bg-black/10 rounded-3xl shadow-inner transition-all duration-300">
        <Routes>
          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* Public routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/feed" replace />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user ? '/feed' : '/login'} replace />}
          />
        </Routes>
      </main>

      {/* Floating bottom navigation */}
      {!hideUI && <BottomNav />}
    </div>
  );
}