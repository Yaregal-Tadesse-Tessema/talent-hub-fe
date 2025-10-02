import posthog from 'posthog-js';

// PostHog configuration
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      // Enable debug mode in development
      debug: process.env.NODE_ENV === 'development',
      // Disable automatic pageview tracking (we'll do it manually)
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development')
          console.log('PostHog loaded');
      },
      // Capture pageviews automatically
      capture_pageview: false,
      // Capture pageleave events
      capture_pageleave: true,
      // Enable session recordings
      session_recording: {
        enabled: true,
        recordCrossOriginIframes: true,
        maskAllInputs: false, // Set to true for privacy
        maskInputOptions: {
          password: true,
        },
      },
      // Enable feature flags
      bootstrap: {
        featureFlags: {},
      },
    });
  }
};

// PostHog instance
export { posthog };

// Helper functions for common tracking events
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (
  userId: string,
  userProperties?: Record<string, any>,
) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, userProperties);
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset();
  }
};

export const getFeatureFlag = (flagKey: string) => {
  if (typeof window !== 'undefined' && posthog) {
    return posthog.getFeatureFlag(flagKey);
  }
  return undefined;
};
