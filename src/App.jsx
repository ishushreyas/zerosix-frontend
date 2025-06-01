// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import { processGoogleCallback } from './api/auth';

function OAuthCallbackHandler() {
  // This component reads `code` and `state` from URL, calls backend, then redirects accordingly.
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = React.useContext(AuthContext);

  React.useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      if (!code || !state) {
        navigate('/login');
        return;
      }

      try {
        const result = await processGoogleCallback(code, state);
        if (result.success) {
          if (result.userExists) {
            // Login
            setAuth(result.token, result.user);
            navigate('/home');
          } else {
            // New user: pass tempToken + googleData via location.state
            navigate('/signup', { state: { tempToken: result.tempToken, googleData: result.googleData } });
          }
        } else {
          navigate('/login', { replace: true, state: { error: 'OAuth failed: no success' } });
        }
      } catch (err) {
        navigate('/login', { replace: true, state: { error: err.message || 'OAuth processing error' } });
      }
    }

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600">Processing authentication...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<OAuthCallbackHandler />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}