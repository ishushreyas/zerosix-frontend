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

  // On mount, check localStorage for existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      // Optionally verify with backend
      verifyJWTToken(storedToken)
        .then((res) => {
          if (res.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const setAuth = (newToken, userObj) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(newToken);
    setUser(userObj);
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // While verifying/loading, you could show a spinner
  if (loading) {
    return null; // or a fullscreen spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}