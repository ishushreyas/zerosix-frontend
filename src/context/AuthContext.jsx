// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { verifyJWTToken } from '../api/auth';

// Create context
export const AuthContext = createContext({
  user: null,
  token: null,
  setAuth: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signupSession, _setSignupSession] = useState(null); // New state for signup session

  // On mount, check localStorage for existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Optionally verify with backend
      verifyJWTToken(storedToken)
        .then((userRes) => {
          // If verification is successful, userRes will contain the user object
          setToken(storedToken);
          setUser(userRes);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Check for signup session in sessionStorage
    const storedSignupSession = sessionStorage.getItem('signupSession');
    if (storedSignupSession) {
      _setSignupSession(JSON.parse(storedSignupSession));
    }

  }, []);

  const setAuth = (newToken, userObj) => {
    return new Promise((resolve) => {
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(newToken);
      setUser(userObj);
      sessionStorage.removeItem('signupSession'); // Clear signup session on successful auth
      _setSignupSession(null);
      resolve();
    });
  };

  const setSignupSession = (sessionId, googleData) => {
    const sessionData = { session_id: sessionId, google_data: googleData };
    sessionStorage.setItem('signupSession', JSON.stringify(sessionData));
    _setSignupSession(sessionData);
  };

  const clearSignupData = () => {
    sessionStorage.removeItem('signupSession');
    _setSignupSession(null);
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    clearSignupData(); // Also clear signup data on sign out
  };

  // While verifying/loading, you could show a spinner
  if (loading) {
    return null; // or a fullscreen spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, signupSession, setAuth, setSignupSession, clearSignupData, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}