// src/components/BackendStatus.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { checkBackendHealth } from '../api/auth';

export default function BackendStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function ping() {
      try {
        await checkBackendHealth();
        if (isMounted) setStatus('connected');
      } catch (err) {
        if (isMounted) {
          setStatus('disconnected');
          setErrorMsg('Cannot reach backend service');
        }
      }
    }

    ping();

    return () => {
      isMounted = false;
    };
  }, []);

  const theme = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  let bgClass = theme.warning;
  if (status === 'connected') bgClass = theme.success;
  if (status === 'disconnected') bgClass = theme.error;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div
        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm border backdrop-blur-sm ${bgClass}`}
      >
        {status === 'checking' && (
          <>
            <LoadingSpinner size={3} color="border-yellow-600" />
            <span>Connecting to backend...</span>
          </>
        )}
        {status === 'connected' && (
          <>
            <CheckCircle size={14} className="text-green-600" />
            <span>Backend Connected</span>
          </>
        )}
        {status === 'disconnected' && (
          <>
            <XCircle size={14} className="text-red-600" />
            <span>Backend Unavailable</span>
          </>
        )}
      </div>
    </div>
  );
}