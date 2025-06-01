// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { User, Shield, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import BackendStatus from '../components/BackendStatus';

export default function HomePage() {
  const { user, signOut } = useContext(AuthContext);

  const theme = {
    bg: 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200',
    cardBg: 'bg-gray-100/80 backdrop-blur-xl',
    shadow: 'shadow-2xl shadow-gray-400/20',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300/20',
    buttonPrimary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900',
    buttonSecondary: 'bg-gray-200/90 hover:bg-gray-300/90 border border-gray-300 text-gray-700',
    neumorphic: 'shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]',
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-all duration-500`}>
      <BackendStatus />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className={`${theme.cardBg} ${theme.shadow} rounded-[2rem] p-6 mb-8 ${theme.border} border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${theme.buttonPrimary} rounded-xl flex items-center justify-center`}>
                <User size={20} className="text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme.text}`}>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className={`${theme.textSecondary} text-sm`}>
                  Authenticated via Google OAuth • Backend: Golang
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className={`px-6 py-3 rounded-xl ${theme.buttonSecondary} transition-all duration-200 hover:scale-105`}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Account Info */}
        <div className={`${theme.cardBg} ${theme.shadow} rounded-[2rem] p-6 mb-8 ${theme.border} border`}>
          <h2 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Shield size={18} /> Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Email</label>
              <p className={`${theme.text}`}>{user?.email}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Username</label>
              <p className={`${theme.text}`}>{user?.username}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>User ID</label>
              <p className={`${theme.text} font-mono text-sm`}>{user?.id}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Member Since</label>
              <p className={`${theme.text}`}>
                {new Date(user?.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Secure Authentication', icon: Shield, desc: 'Google OAuth integration with JWT tokens' },
            { title: 'User Management', icon: User, desc: 'Complete user profile and account management' },
            { title: 'API Integration', icon: Mail, desc: 'RESTful API endpoints powered by Golang' },
            { title: 'Data Security', icon: CheckCircle, desc: 'Enterprise-grade security and encryption' },
            { title: 'Scalable Backend', icon: ArrowRight, desc: 'High-performance Golang microservices' },
            { title: 'Real-time Updates', icon: Shield, desc: 'Live backend status and health monitoring' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`${theme.cardBg} ${theme.shadow} rounded-[1.5rem] p-6 ${theme.border} border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            >
              <div className={`w-12 h-12 ${theme.buttonPrimary} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon size={20} className="text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>{feature.title}</h3>
              <p className={`${theme.textSecondary} text-sm`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}