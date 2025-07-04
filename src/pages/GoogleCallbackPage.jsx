// src/pages/GoogleCallbackPage.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { processGoogleCallback } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setSignupSession } = useContext(AuthContext);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      processGoogleCallback(code, state)
        .then(async (data) => {
          if (data.data.user_exists) {
            await setAuth(data.data.session_id, data.data.google_data);
            navigate('/');
          } else {
            setSignupSession(data.data.session_id, data.data.google_data);
            navigate('/signup');
          }
        })
        .catch(error => {
          console.error('Error during Google callback:', error);
          navigate('/login?error=google_callback_failed');
        });
    } else {
        navigate('/login?error=missing_code_or_state');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Authenticating with Google...</p>
    </div>
  );
}
