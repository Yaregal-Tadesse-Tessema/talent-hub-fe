'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  initPostHog,
  posthog,
  trackEvent,
  identifyUser,
  resetUser,
} from '@/lib/posthog';

interface PostHogContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  identifyUser: (userId: string, userProperties?: Record<string, any>) => void;
  resetUser: () => void;
  posthog: typeof posthog;
  isLoaded: boolean;
}

const PostHogContext = createContext<PostHogContextType | undefined>(undefined);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize PostHog
    initPostHog();
    setIsLoaded(true);

    // Track page view
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('$pageview');
    }
  }, []);

  // Identify user when they log in
  useEffect(() => {
    if (user && isLoaded) {
      identifyUser(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
        isFirstTime: user.isFirstTime,
        ...(user.selectedEmployer && {
          employerId: user.selectedEmployer.id,
          employerName: user.selectedEmployer.name,
        }),
      });
    } else if (!user && isLoaded) {
      // Reset user when they log out
      resetUser();
    }
  }, [user, isLoaded]);

  const contextValue = {
    trackEvent,
    identifyUser,
    resetUser,
    posthog,
    isLoaded,
  };

  return (
    <PostHogContext.Provider value={contextValue}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog() {
  const context = useContext(PostHogContext);
  if (context === undefined) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context;
}

// Hook for tracking page views
export function usePageTracking() {
  const { trackEvent } = usePostHog();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
          trackEvent('Page View', {
            page: newPath,
            referrer: document.referrer,
          });
          setCurrentPath(newPath);
        }
      }
    };

    // Track initial page load
    handleRouteChange();

    // Listen for route changes (Next.js app router)
    const handlePopState = () => handleRouteChange();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath, trackEvent]);
}
