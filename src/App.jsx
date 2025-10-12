import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeContextProvider, ThemeContext } from './contexts/ThemeContext';

import Login from './pages/Login';
import Feed from './pages/Feed';
import Expenses from './pages/Expenses';
import Chat from './pages/Chat';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

// Separate component to use contexts
function AppContent() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {user && <Header theme={theme} setTheme={() => {}} />}

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

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/feed" : "/login"} />} />
      </Routes>
    </div>
  );
}