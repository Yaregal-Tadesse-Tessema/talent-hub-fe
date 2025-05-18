'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/contexts/ToastContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'employer' | 'employee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // First try employer login
      const employerResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const employerData = await employerResponse.json();
      if (employerResponse.ok) {
        const user = {
          ...employerData?.organization,
          role: 'employer' as const,
        };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...employerData?.organization,
              role: 'employer' as const,
            }),
          );
          // Store both tokens
          localStorage.setItem('accessToken', employerData.data.accessToken);
          localStorage.setItem('refreshToken', employerData.data.refreshToken);
        }
        showToast({
          type: 'success',
          message: 'Login successful! Redirecting...',
        });
        router.push('/');
        return { success: true, message: 'Login successful! Redirecting...' };
      }

      // If employer login fails, try employee login
      const employeeResponse = await fetch(
        `${API_BASE_URL}/auth/employee-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password }),
        },
      );

      const employeeData = await employeeResponse.json();
      console.log(employeeData);

      if (employeeResponse.ok) {
        const user = {
          ...employeeData?.organization,
          role: 'employee' as const,
        };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
          // Store both tokens
          localStorage.setItem('accessToken', employeeData.accessToken);
          localStorage.setItem('refreshToken', employeeData.refreshToken);
        }
        showToast({
          type: 'success',
          message: 'Login successful!',
        });
        router.push('/');
        return { success: true, message: 'Login successful!' };
      }

      // If both logins fail, return the error message from the last attempt
      const errorMsg =
        employeeData.message ||
        employerData.message ||
        'Invalid email or password. Please try again.';
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
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
