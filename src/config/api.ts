import axios from 'axios';
import { handleLogout } from '@/utils/auth';

export const API_BASE_URL = 'http://157.230.227.83:3010/api';

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
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        // Set the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle common error cases
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Handle logout and redirect
          handleLogout();
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              'x-refresh-token': refreshToken,
            },
          },
        );

        const { accessToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Handle logout and redirect for any refresh error
        handleLogout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network errors gracefully
    if (!error.response) {
      console.error('Network error:', error.message);
      // Don't crash the app for network errors
      return Promise.reject(
        new Error(
          'Network connection failed. Please check your internet connection.',
        ),
      );
    }

    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      console.error(
        'Server error:',
        error.response.status,
        error.response.data,
      );
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  },
);
