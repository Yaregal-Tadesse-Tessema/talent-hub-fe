'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/contexts/ToastContext';
import { EmployerData } from '@/types/employer';
import { useTheme } from './ThemeContext';
import { clearAuthData } from '@/utils/auth';
import { profileService } from '@/services/profileService';
import { AnalyticsService } from '@/services/analyticsService';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  role: 'employer' | 'employee';
  selectedEmployer?: EmployerData;
  profile?: {
    path?: string;
  };
  isFirstTime?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  selectEmployer: (employer: EmployerData) => Promise<void>;
  updateUserIsFirstTime: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const { setTheme } = useTheme();

  useEffect(() => {
    // This effect runs only on the client
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // First try employer login
      const employerResponse = await fetch(
        `${API_BASE_URL}/auth/backOffice-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employerData = await employerResponse.json();
      if (employerResponse.ok) {
        const user = {
          ...employerData?.profile,
          role: 'employer' as const,
          isFirstTime: true,
        };
        console.log(employerData);
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...employerData?.profile,
              role: 'employer' as const,
              isFirstTime: true,
            }),
          );
          // Store both tokens
          localStorage.setItem('accessToken', employerData.accessToken);
          localStorage.setItem('refreshToken', employerData.refreshToken);
          // Store employers data
          localStorage.setItem('employers', JSON.stringify(employerData || []));
        }
        showToast({
          type: 'success',
          message: 'Login successful! Redirecting...',
        });

        // Track successful login
        AnalyticsService.trackLogin('employer', 'email');

        // Clear any previous tutorial state to ensure fresh tutorial on login
        const tutorialKeys = Object.keys(localStorage).filter(
          (key) =>
            key.startsWith('tutorial') || key.startsWith('tutorialShown_'),
        );
        tutorialKeys.forEach((key) => localStorage.removeItem(key));

        // Check if there's a return URL stored
        const returnToJob = localStorage.getItem('returnToJob');
        const returnToCVBuilder = localStorage.getItem('returnToCVBuilder');

        if (returnToJob) {
          localStorage.removeItem('returnToJob'); // Clean up
          router.push(`/find-job/${returnToJob}?apply=true`);
        } else if (returnToCVBuilder) {
          localStorage.removeItem('returnToCVBuilder'); // Clean up
          router.push(returnToCVBuilder);
        } else {
          router.push('/dashboard');
        }

        return { success: true, message: 'Login successful! Redirecting...' };
      }

      // If employer login fails, try employee login
      const employeeResponse = await fetch(
        `${API_BASE_URL}/auth/portal-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employeeData = await employeeResponse.json();

      if (employeeResponse.ok) {
        const user = {
          ...employeeData?.profile,
          role: 'employee' as const,
          isFirstTime: true,
        };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...employeeData?.profile,
              role: 'employee' as const,
              isFirstTime: true,
            }),
          );
          // Store both tokens
          localStorage.setItem('accessToken', employeeData.accessToken);
          localStorage.setItem('refreshToken', employeeData.refreshToken);
        }
        showToast({
          type: 'success',
          message: 'Login successful!',
        });

        // Track successful login
        AnalyticsService.trackLogin('employee', 'email');

        // Clear any previous tutorial state to ensure fresh tutorial on login
        const tutorialKeys = Object.keys(localStorage).filter(
          (key) =>
            key.startsWith('tutorial') || key.startsWith('tutorialShown_'),
        );
        tutorialKeys.forEach((key) => localStorage.removeItem(key));

        // Check if there's a return URL stored
        const returnToJob = localStorage.getItem('returnToJob');
        const returnToCVBuilder = localStorage.getItem('returnToCVBuilder');

        if (returnToJob) {
          localStorage.removeItem('returnToJob'); // Clean up
          router.push(`/find-job/${returnToJob}?apply=true`);
        } else if (returnToCVBuilder) {
          localStorage.removeItem('returnToCVBuilder'); // Clean up
          router.push(returnToCVBuilder);
        } else {
          router.push('/find-job');
        }

        return { success: true, message: 'Login successful!' };
      }

      // If both logins fail, return the error message from the last attempt
      const errorMsg =
        employeeData.message ||
        employerData.message ||
        'Invalid email or password. Please try again.';

      // Track failed login
      AnalyticsService.trackLoginFailed(email, errorMsg);

      showToast({ type: 'error', message: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      showToast({ type: 'error', message: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const logout = () => {
    // Track logout before clearing user data
    if (user) {
      AnalyticsService.trackLogout(user.role);
    }

    setUser(null);
    clearAuthData();
    setTheme('light');
    router.push('/login');
  };

  const selectEmployer = async (employer: EmployerData) => {
    if (user) {
      const updatedUser = {
        ...user,
        selectedEmployer: employer,
      };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Check if there's a return URL stored
      const returnToJob = localStorage.getItem('returnToJob');
      const returnToCVBuilder = localStorage.getItem('returnToCVBuilder');

      if (returnToJob) {
        localStorage.removeItem('returnToJob'); // Clean up
        router.push(`/find-job/${returnToJob}?apply=true`);
      } else if (returnToCVBuilder) {
        localStorage.removeItem('returnToCVBuilder'); // Clean up
        router.push(returnToCVBuilder);
      } else {
        router.push('/dashboard');
      }
    } else {
      throw new Error('User not found');
    }
  };

  const updateUserIsFirstTime = async () => {
    if (user) {
      try {
        // Since the User interface is simplified but actual user data contains more fields,
        // we'll use the user data as-is and only update the isFirstTime field
        const userDataForAPI = {
          ...user,
          isFirstTime: false,
        } as any; // Type assertion to handle the interface mismatch

        // Update the database via API
        const updatedProfile =
          await profileService.updateProfile(userDataForAPI);

        // Update local state and localStorage with the updated profile data
        const updatedUser = {
          ...user,
          ...updatedProfile,
          isFirstTime: false,
          role: user.role, // Preserve the role type
        };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error(
          'Failed to update user isFirstTime status in database:',
          error,
        );
        // Fallback: still update localStorage even if API call fails
        const updatedUser = {
          ...user,
          isFirstTime: false,
        };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        // Show error toast but don't throw to prevent tutorial interruption
        showToast({
          type: 'error',
          message: 'Failed to update tutorial status. Please try again later.',
        });
        throw error;
      }
    } else {
      throw new Error('User not found');
    }
  };

  // Memoize user data to prevent unnecessary re-renders
  const userValue = React.useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      selectEmployer,
      updateUserIsFirstTime,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={userValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
