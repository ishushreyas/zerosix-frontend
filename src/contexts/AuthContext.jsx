// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
const navigate = useNavigate();

import { auth, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = async (email, password) => {
    setIsLoading(true);
    const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);
    await api.register({ email, uid: firebaseUser.user.uid });
    const idToken = await firebaseUser.user.getIdToken();
    await api.sessionLogin(idToken);
    setUser(firebaseUser.user);
    setIsLoading(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    const firebaseUser = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await firebaseUser.user.getIdToken();
    await api.sessionLogin(idToken);
    setUser(firebaseUser.user);
    setIsLoading(false);
  };

  const loginWithGoogle = async (path) => {
    setIsLoading(true);
    const firebaseUser = await signInWithPopup(auth, googleProvider);
    const idToken = await firebaseUser.user.getIdToken();
    await api.sessionLogin(idToken);
    setUser(firebaseUser.user);
    setIsLoading(false);
    navigate(path, { replace: true });
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      try {
        await api.sessionLogin(idToken); // ensures backend session sync
        setUser(currentUser);
      } catch (err) {
        console.error('Session login failed:', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  });

  return unsubscribe;
}, []);

  const value = {
    user,
    isLoading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
