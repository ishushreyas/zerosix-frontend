// src/api/auth.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // if you need cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// (1) Check Backend Health
export async function checkBackendHealth() {
  const response = await apiClient.get("/health");
  // expecting { status: 'healthy', message: '...' }
  return response.data;
}

// (2) Get Google OAuth URL
export async function fetchGoogleAuthURL() {
  // backend should return { url, state }
  const response = await apiClient.get('/auth/google/url');
  return response.data.data;
}

// (3) Process Google Callback
export async function processGoogleCallback(code, state) {
  // backend endpoint: POST /auth/google/callback
  const response = await apiClient.post('/auth/google/callback', { code, state });
  return response.data;
}

// (4) Create New User
export async function createNewUser(userData, tempToken) {
  // backend: POST /users/create (expects { username, fullName, email, googleId })
  const response = await apiClient.post(
    '/users/create',
    userData,
    {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    }
  );
  return response.data;
}

// (5) Verify JWT token (optional; you could decode it client-side or ask backend)
export async function verifyJWTToken(token) {
  const response = await apiClient.post(
    '/auth/verify',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export default {
  checkBackendHealth,
  fetchGoogleAuthURL,
  processGoogleCallback,
  createNewUser,
  verifyJWTToken,
};