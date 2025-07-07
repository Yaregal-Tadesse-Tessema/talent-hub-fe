/**
 * Authentication utility functions
 */

// List of public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/find-job',
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
  '/find-employers', // Add this as it's accessible to non-logged users
] as const;

/**
 * Check if the current route is a public route
 */
export const isPublicRoute = (pathname: string): boolean => {
  // Check for exact matches first
  if (PUBLIC_ROUTES.includes(pathname as any)) {
    return true;
  }

  // Check for routes that start with public route patterns
  return PUBLIC_ROUTES.some((route) => {
    // For root route, only match exactly
    if (route === '/') {
      return pathname === '/';
    }
    // For other routes, check if pathname starts with the route
    return pathname.startsWith(route);
  });
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;

  // Clear authentication tokens and user data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('employers');

  // Clear any tutorial state
  const tutorialKeys = Object.keys(localStorage).filter(
    (key) => key.startsWith('tutorial') || key.startsWith('tutorialShown_'),
  );
  tutorialKeys.forEach((key) => localStorage.removeItem(key));
};

/**
 * Handle logout and redirect to login page
 * This function can be used both in API interceptors and components
 */
export const handleLogout = (): void => {
  // Clear all stored values
  clearAuthData();

  // Get current path
  const currentPath = window.location.pathname;

  // Only redirect to login if not on a public route
  if (!isPublicRoute(currentPath)) {
    // Use window.location.href for immediate redirect
    window.location.href = '/login';
  }
};

/**
 * Check if an error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  return (
    error?.message === 'No refresh token available' ||
    error?.response?.status === 401 ||
    error?.message?.includes('refresh token') ||
    error?.message?.includes('unauthorized') ||
    error?.message?.toLowerCase().includes('authentication')
  );
};

/**
 * Handle authentication errors consistently
 * This function can be used in components to handle auth errors
 */
export const handleAuthError = (error: any): void => {
  if (isAuthError(error)) {
    console.log('Authentication error detected, logging out user');
    handleLogout();
  }
};
