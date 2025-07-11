// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Transaction from './components/Transaction';
import Updates from './components/Updates';
import TransactionDetail from './components/TransactionDetail';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/messages" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
              <Route path="/updates" element={<Updates />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
