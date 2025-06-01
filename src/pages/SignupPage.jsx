// src/pages/SignupPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createNewUser } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import BackendStatus from '../components/BackendStatus';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);

  // Get tempToken and googleData from location.state (pushed via callback)
  const { tempToken, googleData } = location.state || {};
  const [signupData, setSignupData] = useState({ username: '', fullName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!tempToken || !googleData) {
      // If someone visits /signup directly without proper data, redirect to login
      navigate('/login');
    }
  }, [tempToken, googleData, navigate]);

  const theme = {
    bg: 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200',
    cardBg: 'bg-gray-100/80 backdrop-blur-xl',
    shadow: 'shadow-2xl shadow-gray-400/20',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300/20',
    buttonPrimary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900',
    neumorphic: 'shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const handleChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!signupData.username.trim() || !signupData.fullName.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const payload = {
        username: signupData.username,
        fullName: signupData.fullName,
        email: googleData.email,
        googleId: googleData.googleId,
      };

      const result = await createNewUser(payload, tempToken);
      if (result.success) {
        // Store real token + user
        setAuth(result.token, result.user);
        navigate('/home');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg} transition-all duration-500`}>
      <BackendStatus />

      <div className={`w-full max-w-md ${theme.cardBg} ${theme.shadow} rounded-[2rem] p-8 ${theme.border} border`}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 ${theme.buttonPrimary} rounded-[1.2rem] flex items-center justify-center ${theme.neumorphic}`}>
            <User size={32} className="text-white" />
          </div>

          <h1 className={`text-2xl mb-2 ${theme.text}`}>
            <span className="font-light">Complete</span>{' '}
            <span className="font-bold">your</span>{' '}
            <span className="font-light">profile</span>
          </h1>
          <p className={`${theme.textSecondary} text-sm`}>
            Your Google account has been verified successfully
          </p>
        </div>

        {formError && (
          <div className={`mb-6 p-4 rounded-xl ${theme.error} border text-sm`}>
            {formError}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Username *
            </label>
            <input
              name="username"
              type="text"
              value={signupData.username}
              onChange={handleChange}
              className={`w-full p-4 rounded-xl border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200`}
              placeholder="Choose a unique username"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Full Name *
            </label>
            <input
              name="fullName"
              type="text"
              value={signupData.fullName}
              onChange={handleChange}
              className={`w-full p-4 rounded-xl border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !signupData.username.trim() || !signupData.fullName.trim()}
          className={`w-full mt-8 p-4 rounded-2xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${theme.buttonPrimary} ${theme.neumorphic} flex items-center justify-center gap-3 disabled:opacity-50`}
        >
          {isSubmitting ? <LoadingSpinner size={5} color="border-white" /> : (
            <>
              Complete Registration
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className={`text-xs ${theme.textSecondary}`}>
            Account will be created and stored securely in our Golang backend
          </p>
        </div>
      </div>
    </div>
  );
}