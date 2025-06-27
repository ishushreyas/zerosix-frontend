// Enhanced auth.js with better error handling and logging
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

// Create an axios instance with better error handling
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Enhance error message
    if (error.response) {
      // Server responded with error status
      const errorMsg = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      error.message = errorMsg;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Cannot connect to server. Please check your internet connection.';
    } else {
      // Something else went wrong
      error.message = error.message || 'An unexpected error occurred';
    }

    return Promise.reject(error);
  }
);

// (1) Check Backend Health
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    throw error;
  }
}

// (2) Get Google OAuth URL
export async function fetchGoogleAuthURL() {
  try {
    const response = await apiClient.get('/auth/google/url');
    console.log('Google OAuth URL response:', response.data);
    
    // Handle different response structures
    if (response.data.data) {
      return response.data.data; // { url, state }
    } else if (response.data.url && response.data.state) {
      return response.data; // { url, state }
    } else {
      throw new Error('Invalid response format from OAuth URL endpoint');
    }
  } catch (error) {
    console.error('Failed to fetch Google OAuth URL:', error.message);
    throw error;
  }
}

// (3) Process Google Callback - Enhanced with detailed logging
export async function processGoogleCallback(code, state) {
  try {
    console.log('Processing Google callback with:', { 
      code: code ? `${code.substring(0, 10)}...` : 'null', 
      state: state || 'null' 
    });

    const requestData = { code, state };
    const response = await apiClient.post('/auth/google/callback', requestData);
    
    console.log('Google callback response structure:', {
      hasSuccess: 'success' in response.data,
      hasUserExists: 'userExists' in response.data,
      hasToken: 'token' in response.data,
      hasTempToken: 'tempToken' in response.data,
      hasUser: 'user' in response.data,
      hasGoogleData: 'googleData' in response.data,
      responseKeys: Object.keys(response.data)
    });

    // Validate response structure
    const result = response.data;
    
    if (typeof result.success !== 'boolean') {
      console.warn('Response missing success field:', result);
      throw new Error('Invalid response format: missing success field');
    }

    if (!result.success) {
      const errorMsg = result.message || result.error || 'Authentication failed';
      console.error('Backend returned success: false', result);
      throw new Error(errorMsg);
    }

    // For existing users
    if (result.user_exists) {
      if (!result.token) {
        throw new Error('Missing authentication token for existing user');
      }
      if (!result.user) {
        throw new Error('Missing user data for existing user');
      }
    } 
    // For new users
    else {
      if (!result.session_id) {
        throw new Error('Missing session ID for new user');
      }
    }

    return result;
  } catch (error) {
    console.error('Google callback processing failed:', error.message);
    throw error;
  }
}

// (4) Create New User - Enhanced validation
export async function createNewUser(userData, sessionId) {
  try {
    console.log('Creating new user:', { ...userData, sessionId: sessionId ? 'present' : 'missing' });

    if (!sessionId) {
      throw new Error('Session ID is required for user creation');
    }

    // Validate user data
    const requiredFields = ['username', 'fullName'];
    const missingFields = requiredFields.filter(field => !userData[field]?.trim());
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await apiClient.post(
      '/auth/signup',
      { ...userData, session_id: sessionId }
    );

    const result = response.data;
    
    if (!result.success) {
      throw new Error(result.message || 'User creation failed');
    }

    if (!result.token || !result.user) {
      throw new Error('Incomplete response from user creation');
    }

    return result;
  } catch (error) {
    console.error('User creation failed:', error.message);
    throw error;
  }
}

// (5) Verify JWT token
export async function verifyJWTToken(token) {
  try {
    if (!token) {
      throw new Error('Token is required for verification');
    }

    const response = await apiClient.post(
      '/auth/verify',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw error;
  }
}

export default {
  checkBackendHealth,
  fetchGoogleAuthURL,
  processGoogleCallback,
  createNewUser,
  verifyJWTToken,
};