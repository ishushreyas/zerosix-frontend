import React, { useState, useEffect } from 'react';
import { User, Mail, ArrowRight, Shield, CheckCircle, XCircle } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [signupData, setSignupData] = useState({ username: '', fullName: '' });
  const [authError, setAuthError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Gray theme configuration
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
    input: 'bg-gray-200/80 border-gray-300/50 focus:border-gray-500',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  // Simulated Golang backend API calls
  const API_BASE = 'http://localhost:8080/api/v1';

  const backendAPI = {
    // Check backend health
    checkHealth: async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate random success/failure
        if (Math.random() > 0.2) {
          return { status: 'healthy', message: 'Backend connected successfully' };
        } else {
          throw new Error('Backend connection failed');
        }
      } catch (error) {
        throw new Error('Failed to connect to Golang backend');
      }
    },

    // Google OAuth URL generation
    getGoogleAuthURL: async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate Golang backend generating OAuth URL
        const state = Math.random().toString(36).substring(7);
        const clientID = "your-google-client-id.apps.googleusercontent.com";
        const redirectURI = encodeURIComponent(`${API_BASE}/auth/google/callback`);
        const scope = encodeURIComponent("openid email profile");
        
        return {
          url: `https://accounts.google.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code&state=${state}`,
          state
        };
      } catch (error) {
        throw new Error('Failed to generate OAuth URL');
      }
    },

    // Simulate OAuth callback processing
    processGoogleCallback: async (code, state) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate backend processing OAuth code
        const mockUserData = {
          googleId: "123456789",
          email: "user@example.com",
          name: "John Doe",
          picture: "https://example.com/avatar.jpg",
          verified: true
        };

        // Check if user exists in database
        const userExists = Math.random() > 0.4;
        
        if (userExists) {
          return {
            success: true,
            userExists: true,
            token: "jwt-token-here",
            user: {
              id: "user-123",
              email: mockUserData.email,
              name: mockUserData.name,
              username: "johndoe",
              createdAt: "2024-01-15T10:30:00Z"
            }
          };
        } else {
          return {
            success: true,
            userExists: false,
            tempToken: "temp-jwt-token",
            googleData: mockUserData
          };
        }
      } catch (error) {
        throw new Error('OAuth processing failed');
      }
    },

    // Create new user
    createUser: async (userData, tempToken) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate user creation in Golang backend
        const newUser = {
          id: "user-" + Math.random().toString(36).substring(7),
          email: userData.email,
          name: userData.fullName,
          username: userData.username,
          googleId: userData.googleId,
          createdAt: new Date().toISOString()
        };

        return {
          success: true,
          token: "jwt-token-new-user",
          user: newUser
        };
      } catch (error) {
        throw new Error('User creation failed');
      }
    },

    // Verify JWT token
    verifyToken: async (token) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
          valid: true,
          user: {
            id: "user-123",
            email: "user@example.com",
            name: "John Doe",
            username: "johndoe"
          }
        };
      } catch (error) {
        throw new Error('Token verification failed');
      }
    }
  };

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await backendAPI.checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
        setAuthError('Backend service unavailable. Please try again later.');
      }
    };
    
    checkBackend();
  }, []);

  const handleGoogleAuth = async () => {
    if (backendStatus !== 'connected') {
      setAuthError('Backend service is not available');
      return;
    }

    setIsAuthenticating(true);
    setAuthError('');
    
    try {
      // Step 1: Get Google OAuth URL from backend
      const { url, state } = await backendAPI.getGoogleAuthURL();
      
      // Step 2: Simulate OAuth redirect and callback
      // In real implementation, user would be redirected to Google
      // and then back to our callback endpoint
      
      // Simulate OAuth code from Google callback
      const mockCode = "oauth-code-" + Math.random().toString(36).substring(7);
      
      // Step 3: Process OAuth callback in backend
      const result = await backendAPI.processGoogleCallback(mockCode, state);
      
      if (result.success) {
        if (result.userExists) {
          // User exists, login successful
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          setCurrentPage('home');
        } else {
          // New user, show signup form
          setUserExists(false);
          localStorage.setItem('tempToken', result.tempToken);
          localStorage.setItem('googleData', JSON.stringify(result.googleData));
          setCurrentPage('signup');
        }
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignup = async () => {
    if (!signupData.username.trim() || !signupData.fullName.trim()) {
      setAuthError('Please fill in all required fields');
      return;
    }

    setIsAuthenticating(true);
    setAuthError('');
    
    try {
      const tempToken = localStorage.getItem('tempToken');
      const googleData = JSON.parse(localStorage.getItem('googleData') || '{}');
      
      const userData = {
        username: signupData.username,
        fullName: signupData.fullName,
        email: googleData.email,
        googleId: googleData.googleId
      };
      
      const result = await backendAPI.createUser(userData, tempToken);
      
      if (result.success) {
        localStorage.removeItem('tempToken');
        localStorage.removeItem('googleData');
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setCurrentPage('home');
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentPage('login');
    setSignupData({ username: '', fullName: '' });
    setAuthError('');
  };

  const BackendStatus = () => (
    <div className="fixed top-4 left-4 z-50">
      <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
        backendStatus === 'connected' 
          ? theme.success 
          : backendStatus === 'disconnected' 
            ? theme.error 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      } border backdrop-blur-sm`}>
        {backendStatus === 'checking' && (
          <>
            <div className="w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
            Connecting to backend...
          </>
        )}
        {backendStatus === 'connected' && (
          <>
            <CheckCircle size={14} className="text-green-600" />
            Golang Backend Connected
          </>
        )}
        {backendStatus === 'disconnected' && (
          <>
            <XCircle size={14} className="text-red-600" />
            Backend Unavailable
          </>
        )}
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg} transition-all duration-500`}>
      <BackendStatus />
      
      {/* Login Card */}
      <div className={`w-full max-w-md ${theme.cardBg} ${theme.shadow} rounded-[2rem] p-8 ${theme.border} border backdrop-blur-xl`}>
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 ${theme.buttonPrimary} rounded-[1.2rem] flex items-center justify-center ${theme.neumorphic}`}>
            <Shield size={32} className="text-white" />
          </div>
          
          {/* Welcome Message */}
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

        {/* Error Message */}
        {authError && (
          <div className={`mb-6 p-4 rounded-xl ${theme.error} border text-sm`}>
            {authError}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isAuthenticating || backendStatus !== 'connected'}
          className={`w-full p-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${theme.buttonSecondary} ${theme.neumorphic} flex items-center justify-center gap-3 disabled:opacity-50`}
        >
          {isAuthenticating ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Backend Info */}
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

  const SignupPage = () => (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg} transition-all duration-500`}>
      <BackendStatus />
      
      <div className={`w-full max-w-md ${theme.cardBg} ${theme.shadow} rounded-[2rem] p-8 ${theme.border} border backdrop-blur-xl`}>
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

        {/* Error Message */}
        {authError && (
          <div className={`mb-6 p-4 rounded-xl ${theme.error} border text-sm`}>
            {authError}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Username *
            </label>
            <input
              type="text"
              value={signupData.username}
              onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
              className={`w-full p-4 rounded-xl border ${theme.input} focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200`}
              placeholder="Choose a unique username"
              disabled={isAuthenticating}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Full Name *
            </label>
            <input
              type="text"
              value={signupData.fullName}
              onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full p-4 rounded-xl border ${theme.input} focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200`}
              placeholder="Enter your full name"
              disabled={isAuthenticating}
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={isAuthenticating || !signupData.username.trim() || !signupData.fullName.trim()}
          className={`w-full mt-8 p-4 rounded-2xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${theme.buttonPrimary} ${theme.neumorphic} flex items-center justify-center gap-3 disabled:opacity-50`}
        >
          {isAuthenticating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Complete Registration
              <ArrowRight size={18} />
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

  const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }, []);

    return (
      <div className={`min-h-screen ${theme.bg} transition-all duration-500`}>
        <BackendStatus />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className={`${theme.cardBg} ${theme.shadow} rounded-[2rem] p-6 mb-8 ${theme.border} border backdrop-blur-xl`}>
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
                onClick={handleSignOut}
                className={`px-6 py-3 rounded-xl ${theme.buttonSecondary} transition-all duration-200 hover:scale-105`}
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* User Info Card */}
          <div className={`${theme.cardBg} ${theme.shadow} rounded-[2rem] p-6 mb-8 ${theme.border} border backdrop-blur-xl`}>
            <h2 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
              <Shield size={18} />
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Email</label>
                <p className={`${theme.text}`}>{user?.email || 'user@example.com'}</p>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Username</label>
                <p className={`${theme.text}`}>{user?.username || 'johndoe'}</p>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>User ID</label>
                <p className={`${theme.text} font-mono text-sm`}>{user?.id || 'user-123'}</p>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>Member Since</label>
                <p className={`${theme.text}`}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2024'}
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
              { title: 'Real-time Updates', icon: Shield, desc: 'Live backend status and health monitoring' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${theme.cardBg} ${theme.shadow} rounded-[1.5rem] p-6 ${theme.border} border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <div className={`w-12 h-12 ${theme.buttonPrimary} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`${theme.textSecondary} text-sm`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render current page
  switch (currentPage) {
    case 'signup':
      return <SignupPage />;
    case 'home':
      return <HomePage />;
    default:
      return <LoginPage />;
  }
};

export default App;
