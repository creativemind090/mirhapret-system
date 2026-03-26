import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Decode JWT payload without verifying signature (client-side only). */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the stored access token has expired. */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  // Add 10s buffer so we treat "about to expire" as expired
  return Date.now() / 1000 > payload.exp - 10;
}

/** Returns minutes until token expiry, or null if no token. */
export function tokenExpiresInMinutes(): number | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return Math.floor((payload.exp - Date.now() / 1000) / 60);
}

const clearAuthAndRedirect = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  // Dispatch event so AuthContext can react without a hard redirect
  window.dispatchEvent(new CustomEvent('auth:expired'));
  window.location.href = '/signin?session=expired';
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors with proper user-facing messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
      if (hadToken) {
        clearAuthAndRedirect();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
