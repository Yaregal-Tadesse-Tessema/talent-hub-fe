import { useState, useEffect } from 'react';
import { usePostHog } from '@/contexts/PostHogContext';

export function useFeatureFlags() {
  const { posthog, isLoaded } = usePostHog();
  const [flags, setFlags] = useState<
    Record<string, boolean | string | number | undefined>
  >({});

  useEffect(() => {
    if (isLoaded && posthog) {
      // PostHog doesn't expose getAllFlags(), so we'll use getFeatureFlag for specific flags
      // or rely on the bootstrap config
      const handleFlagUpdate = () => {
        // Trigger a re-render when flags update
        setFlags((prev) => ({ ...prev, _updated: Date.now() }));
      };

      posthog.onFeatureFlags?.(handleFlagUpdate);

      return () => {
        // Cleanup if needed
      };
    }
  }, [isLoaded, posthog]);

  const isFeatureEnabled = (flagKey: string): boolean => {
    if (posthog) {
      return posthog.isFeatureEnabled(flagKey) || false;
    }
    return false;
  };

  const getFeatureFlag = (flagKey: string): boolean | string | undefined => {
    if (posthog) {
      return posthog.getFeatureFlag(flagKey);
    }
    return undefined;
  };

  return {
    flags,
    isFeatureEnabled,
    getFeatureFlag,
    isLoaded,
  };
}

// Specific feature flags for TalentHub
export const FEATURE_FLAGS = {
  // CV Builder features
  CV_AI_GENERATION: 'cv-ai-generation',
  CV_TEMPLATE_MODERN: 'cv-template-modern',
  CV_TEMPLATE_CREATIVE: 'cv-template-creative',
  CV_PARSE_ENHANCED: 'cv-parse-enhanced',

  // Skills Analysis features
  SKILLS_AI_ANALYSIS: 'skills-ai-analysis',
  LEARNING_RECOMMENDATIONS: 'learning-recommendations',
  SKILLS_GAP_ANALYSIS: 'skills-gap-analysis',

  // Job Search features
  ADVANCED_FILTERING: 'advanced-filtering',
  JOB_ALERTS_SMART: 'job-alerts-smart',
  APPLY_WITH_ONE_CLICK: 'apply-with-one-click',

  // Employer features
  AI_JOB_DESCRIPTION: 'ai-job-description',
  CANDIDATE_SCORING: 'candidate-scoring',
  APPLICATION_AUTOMATION: 'application-automation',

  // UI/UX features
  DARK_MODE: 'dark-mode',
  TUTORIAL_ENHANCED: 'tutorial-enhanced',
  NOTIFICATIONS_PUSH: 'notifications-push',

  // Performance features
  LAZY_LOADING: 'lazy-loading',
  CACHING_ENHANCED: 'caching-enhanced',
  BUNDLE_OPTIMIZATION: 'bundle-optimization',
} as const;

// Hook for specific feature flags
export function useFeatureFlag(flagKey: string) {
  const { isFeatureEnabled, getFeatureFlag, isLoaded } = useFeatureFlags();

  return {
    isEnabled: isFeatureEnabled(flagKey),
    value: getFeatureFlag(flagKey),
    isLoaded,
  };
}
