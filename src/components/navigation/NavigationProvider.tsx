'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { performanceMonitor } from '@/utils/performance';

interface NavigationContextType {
  isLoading: boolean;
  navigate: (href: string, options?: { replace?: boolean }) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigate = useCallback(
    async (href: string, options?: { replace?: boolean }) => {
      try {
        setIsLoading(true);

        // Track navigation performance
        performanceMonitor.startNavigation(href);

        // Small delay to show loading state for better UX
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (options?.replace) {
          router.replace(href);
        } else {
          router.push(href);
        }

        // Track navigation completion
        setTimeout(() => {
          performanceMonitor.endNavigation(href);
        }, 300);
      } catch (error) {
        console.error('Navigation error:', error);
        performanceMonitor.endNavigation(href);
      } finally {
        // Keep loading state for a minimum time to prevent flickering
        setTimeout(() => setIsLoading(false), 200);
      }
    },
    [router],
  );

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const value = React.useMemo(
    () => ({
      isLoading,
      navigate,
      setLoading,
    }),
    [isLoading, navigate, setLoading],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
      {isLoading && <PageLoadingSpinner text='Loading...' />}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
