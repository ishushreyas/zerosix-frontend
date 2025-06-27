// src/pages/GoogleCallbackPage.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { exchangeCodeForToken } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      exchangeCodeForToken(code, state)
        .then(data => {
          login(data);
          navigate('/');
        })
        .catch(error => {
          console.error('Error during Google callback:', error);
          navigate('/login?error=google_callback_failed');
        });
    } else {
        navigate('/login?error=missing_code_or_state');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Authenticating with Google...</p>
    </div>
  );
}
