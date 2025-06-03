import axios from 'axios';

export const API_BASE_URL = 'http://138.197.105.31:3010/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Get current path
      const currentPath = window.location.pathname;
      // List of public routes that don't require authentication
      const publicRoutes = [
        '/find-job',
        '/',
        '/login',
        '/signup',
        '/forgot-password',
        '/verify-email',
        '/reset-password',
      ];

      // Only redirect to login if not on a public route
      if (!publicRoutes.some((route) => currentPath.startsWith(route))) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
