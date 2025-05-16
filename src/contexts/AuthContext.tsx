'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

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
        body: JSON.stringify({ email, password }),
      });

      const employerData = await employerResponse.json();

      if (employerResponse.ok) {
        const user = { ...employerData, role: 'employer' as const };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        router.push('/dashboard');
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
          body: JSON.stringify({ email, password }),
        },
      );

      const employeeData = await employeeResponse.json();

      if (employeeResponse.ok) {
        const user = { ...employeeData, role: 'employee' as const };
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        router.push('/dashboard');
        return { success: true, message: 'Login successful! Redirecting...' };
      }

      // If both logins fail, return the error message from the last attempt
      return {
        success: false,
        message:
          employeeData.message ||
          employerData.message ||
          'Invalid email or password. Please try again.',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
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
