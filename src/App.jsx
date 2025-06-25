// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import { processGoogleCallback } from './api/auth';

// Enhanced OAuthCallbackHandler with detailed logging and error handling
function OAuthCallbackHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = React.useContext(AuthContext);
  const [debugInfo, setDebugInfo] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(true);

  React.useEffect(() => {
    async function handleCallback() {
      try {
        // Step 1: Extract parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        console.log('OAuth Callback - Parameters:', { code: !!code, state: !!state, error });
        setDebugInfo(`Extracting parameters... Code: ${!!code}, State: ${!!state}, Error: ${error}`);

        // Step 2: Handle OAuth errors from Google
        if (error) {
          console.error('OAuth Error from Google:', error);
          const errorDescription = searchParams.get('error_description');
          navigate('/login', { 
            replace: true, 
            state: { error: `OAuth Error: ${error} - ${errorDescription}` } 
          });
          return;
        }

        // Step 3: Validate required parameters
        if (!code) {
          console.error('Missing authorization code');
          setDebugInfo('Missing authorization code');
          navigate('/login', { 
            replace: true, 
            state: { error: 'Missing authorization code from Google' } 
          });
          return;
        }

        if (!state) {
          console.error('Missing state parameter');
          setDebugInfo('Missing state parameter');
          navigate('/login', { 
            replace: true, 
            state: { error: 'Missing state parameter - possible CSRF attack' } 
          });
          return;
        }

        // Step 4: Process with backend
        setDebugInfo('Sending to backend...');
        console.log('Calling processGoogleCallback with:', { code: code.substring(0, 10) + '...', state });
        
        const result = await processGoogleCallback(code, state);
        console.log('Backend response:', result);
        
        // Step 5: Handle backend response
        if (!result) {
          console.error('No response from backend');
          setDebugInfo('No response from backend');
          navigate('/login', { replace: true, state: { error: 'No response from authentication server' } });
          return;
        }

        // Check for different response structures
        if (result.success === false) {
          console.error('Backend returned success: false', result);
          setDebugInfo(`Backend error: ${result.message || 'Unknown error'}`);
          navigate('/login', { 
            replace: true, 
            state: { error: result.message || 'Authentication failed' } 
          });
          return;
        }

        if (!result.success) {
          console.error('Backend did not return success: true', result);
          setDebugInfo('Backend did not confirm success');
          navigate('/login', { 
            replace: true, 
            state: { error: 'Authentication not confirmed by server' } 
          });
          return;
        }

        // Step 6: Handle successful authentication
        if (result.userExists) {
          // Existing user login
          console.log('Existing user login');
          setDebugInfo('Logging in existing user...');
          
          if (!result.token || !result.user) {
            console.error('Missing token or user data for existing user', result);
            navigate('/login', { 
              replace: true, 
              state: { error: 'Incomplete login data received' } 
            });
            return;
          }
          
          setAuth(result.token, result.user);
          navigate('/home');
        } else {
          // New user signup
          console.log('New user signup flow');
          setDebugInfo('Redirecting to signup...');
          
          if (!result.tempToken || !result.googleData) {
            console.error('Missing tempToken or googleData for new user', result);
            navigate('/login', { 
              replace: true, 
              state: { error: 'Incomplete signup data received' } 
            });
            return;
          }
          
          navigate('/signup', { 
            state: { 
              tempToken: result.tempToken, 
              googleData: result.googleData 
            } 
          });
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setDebugInfo(`Error: ${err.message}`);
        
        // Handle different types of errors
        let errorMessage = 'Authentication processing failed';
        
        if (err.response) {
          // HTTP error from backend
          errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
          console.error('Backend HTTP error:', err.response.data);
        } else if (err.request) {
          // Network error
          errorMessage = 'Cannot connect to authentication server';
          console.error('Network error:', err.request);
        } else if (err.message) {
          errorMessage = err.message;
        }

        navigate('/login', { 
          replace: true, 
          state: { error: errorMessage } 
        });
      } finally {
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="mb-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          ) : (
            <div className="text-red-500 text-xl">⚠️</div>
          )}
        </div>
        <p className="text-gray-600 mb-2">
          {isProcessing ? 'Processing authentication...' : 'Authentication failed'}
        </p>
        {debugInfo && (
          <p className="text-sm text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
            {debugInfo}
          </p>
        )}
        {!isProcessing && (
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<OAuthCallbackHandler />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
         {/*} <Route path="*" element={<Navigate to="/login" replace />} />*/}l
        </Routes>
      </Router>
    </AuthProvider>
  );
}