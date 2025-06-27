// src/pages/LoginPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchGoogleAuthURL, processGoogleCallback } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import BackendStatus from '../components/BackendStatus';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const { setAuth, setSignupData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Gray theme
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
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      setIsAuthenticating(true);
      processGoogleCallback(code, state)
        .then(response => {
          if (response.user_exists) {
            setAuth(response.token, response.user);
            navigate('/');
          } else {
            setSignupData({ session_id: response.session_id, google_data: response.google_data });
            navigate('/signup');
          }
        })
        .catch(err => {
          setAuthError(err.message || 'Google authentication failed.');
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    }
  }, [navigate, setAuth, setSignupData]);

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const { url } = await fetchGoogleAuthURL();
      window.location.href = url;
    } catch (err) {
      setAuthError(err.message || 'Failed to initiate Google authentication.');
      setIsAuthenticating(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg} transition-all duration-500`}>
      <BackendStatus />

      <div className={`w-full max-w-md ${theme.cardBg} ${theme.shadow} rounded-[2rem] p-8 ${theme.border} border`}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 ${theme.buttonPrimary} rounded-[1.2rem] flex items-center justify-center ${theme.neumorphic}`}>
            <Shield size={32} className="text-white" />
          </div>

          <h1 className={`text-2xl mb-2 ${theme.text}`}>
            <span className="font-light">Welcome</span>{' '}
            <span className="font-bold">back to</span>{' '}
            <span className="font-light">your</span>{' '}
            <span className="font-bold">journey</span>
          </h1>
          <p className={`${theme.textSecondary} text-sm`}>
            Secure authentication powered by Golang backend
          </p>
        </div>

        {authError && (
          <div className={`mb-6 p-4 rounded-xl ${theme.error} border text-sm`}>
            {authError}
          </div>
        )}

        <button
          onClick={handleGoogleAuth}
          disabled={isAuthenticating}
          className={`w-full p-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${theme.buttonSecondary} ${theme.neumorphic} flex items-center justify-center gap-3 disabled:opacity-50`}
        >
          {isAuthenticating ? <LoadingSpinner size={5} color="border-current" /> : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-8 text-center">
          <p className={`text-xs ${theme.textSecondary} mb-2`}>
            Authenticated via Google Cloud Platform (GCP) Identity
          </p>
          <p className={`text-xs ${theme.textSecondary}`}>
            Protected by enterprise-grade Golang backend
          </p>
        </div>
      </div>
    </div>
  );
}