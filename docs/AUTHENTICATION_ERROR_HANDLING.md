# Authentication Error Handling

This document explains how authentication errors are handled in the TalentHub application.

## Overview

When a user's authentication token expires or becomes invalid, the application automatically handles the logout process and redirects the user to the login page. This prevents the "No refresh token available" error from being displayed to users.

## Implementation

### 1. API Interceptor (`src/config/api.ts`)

The main authentication error handling is implemented in the Axios response interceptor:

- **401 Error Detection**: When a 401 (Unauthorized) response is received, the interceptor attempts to refresh the access token
- **Refresh Token Check**: If no refresh token is available, the user is automatically logged out
- **Automatic Logout**: Uses the `handleLogout()` function from `src/utils/auth.ts` to clear all authentication data and redirect to login

### 2. Auth Utilities (`src/utils/auth.ts`)

Centralized authentication utility functions:

- `handleLogout()`: Clears all authentication data and redirects to login (only if not on a public route)
- `clearAuthData()`: Removes all authentication-related items from localStorage
- `isAuthError()`: Checks if an error is authentication-related
- `isPublicRoute()`: Determines if the current route is public (doesn't require authentication)

### 3. Component Error Handling

Components can use the auth utilities to handle authentication errors:

```typescript
import { isAuthError } from '@/utils/auth';

try {
  const response = await api.get('/some-endpoint');
  // Handle success
} catch (error) {
  if (isAuthError(error)) {
    // Authentication error - API interceptor will handle logout
    // Just set empty state
    setData([]);
  } else {
    // Handle other errors
    console.error('Other error:', error);
  }
}
```

## Public Routes

The following routes are considered public and don't trigger automatic logout redirects:

- `/find-job`
- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/verify-email`
- `/reset-password`
- `/find-employers`

## How It Works

1. **API Request**: User makes an authenticated API request
2. **Token Expired**: Server returns 401 (Unauthorized)
3. **Interceptor Triggered**: Axios response interceptor catches the 401 error
4. **Refresh Attempt**: Interceptor tries to refresh the access token using the refresh token
5. **No Refresh Token**: If no refresh token exists, `handleLogout()` is called
6. **Data Cleanup**: All authentication data is cleared from localStorage
7. **Redirect**: User is redirected to `/login` (only if not on a public route)
8. **User Experience**: User sees the login page instead of an error message

## Benefits

- **Seamless UX**: Users don't see technical error messages
- **Automatic Recovery**: No manual intervention required
- **Consistent Behavior**: Same logout process across the entire application
- **Security**: Proper cleanup of sensitive authentication data
- **Public Route Support**: Doesn't interrupt users browsing public content

## Testing

To test the authentication error handling:

1. Log in to the application
2. Manually remove the refresh token from localStorage (DevTools → Application → Local Storage)
3. Navigate to a protected route or trigger an API call
4. Verify that you're automatically redirected to the login page without seeing error messages

## Troubleshooting

If authentication errors are still being displayed:

1. Check that the API interceptor is properly configured
2. Verify that the auth utilities are being imported correctly
3. Ensure that the error handling in components uses `isAuthError()`
4. Check that the public routes list includes all necessary routes
