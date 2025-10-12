import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(location.state?.from?.pathname || '/');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-950 dark:to-black">

      {/* Subtle blurred background lights */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-blue-400/30 blur-[160px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-purple-500/30 blur-[160px] rounded-full animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl bg-white/60 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-500">

        {/* Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-inner">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to continue to <span className="font-medium">Zerosix</span>
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-xl text-sm text-center transition-all">
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center justify-center relative">
          <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
          <span className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md px-3 text-xs text-gray-500 dark:text-gray-400">
            Sign in with
          </span>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center h-12 rounded-2xl bg-white/80 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] active:scale-[0.99] transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}