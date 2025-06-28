import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createNewUser } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SignupPage() {
  const { signupSession, setAuth, clearSignupData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (signupSession?.google_data?.name) {
      setFullName(signupSession.google_data.name);
    }
  }, [signupSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username.trim() || !fullName.trim()) {
      setError('Username and Full Name are required.');
      setIsSubmitting(false);
      return;
    }

    if (!signupSession?.session_id) {
      setError('No active signup session found. Please try logging in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createNewUser(
        { username, fullName },
        signupSession.session_id
      );

      if (response.success) {
        setAuth(response.token, response.user);
        clearSignupData(); // Clear signup data after successful signup
        navigate('/');
      } else {
        setError(response.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's no session ID, the signup session is invalid.
  if (!signupSession?.session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Session Expired</h1>
          <p className="text-gray-500 mb-6">
            Your signup session has expired. Please return to the login page to start over.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-slate-900 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Almost there!</h1>
          <p className="text-gray-500 mt-2">
            Let's create your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-slate-900 focus:outline-none transition"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="e.g., jandoe"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent focus:border-slate-900 focus:outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-slate-900 text-white flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {isSubmitting ? <LoadingSpinner size={5} color="border-white" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              clearSignupData();
              navigate('/login');
            }}
            className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}