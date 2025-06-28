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
    if (signupSession && signupSession.google_data && signupSession.google_data.name) {
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

    if (!signupSession || !signupSession.session_id) {
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

  if (!signupSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
          <h1 className="text-2xl mb-4 font-bold">Signup Session Required</h1>
          <p className="text-gray-600 mb-6">
            To create an account, please initiate the signup process from the login page.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gray-800 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2 font-bold">Complete Your Profile</h1>
          <p className="text-gray-600 text-sm">
            Just a few more details to get started!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-red-200 text-red-800 border text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gray-800 text-white flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? <LoadingSpinner size={5} color="border-white" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              clearSignupData();
              navigate('/login');
            }}
            className="text-sm text-gray-600 hover:underline"
            disabled={isSubmitting}
          >
            Cancel and go back to login
          </button>
        </div>
      </div>
    </div>
  );
}