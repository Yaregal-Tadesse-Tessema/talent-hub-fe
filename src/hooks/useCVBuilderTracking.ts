import { useEffect, useRef } from 'react';
import { AnalyticsService } from '@/services/analyticsService';

interface UseCVBuilderTrackingProps {
  step: number;
  totalSteps: number;
  isCompleted: boolean;
  template?: string;
}

export function useCVBuilderTracking({
  step,
  totalSteps,
  isCompleted,
  template,
}: UseCVBuilderTrackingProps) {
  const stepStartTime = useRef<number>(Date.now());
  const cvBuilderStartTime = useRef<number>(Date.now());

  // Track CV Builder start
  useEffect(() => {
    if (step === 0) {
      AnalyticsService.trackCVBuilderStart(template);
      cvBuilderStartTime.current = Date.now();
    }
  }, [step, template]);

  // Track step completion
  useEffect(() => {
    if (step > 0) {
      const timeSpent = (Date.now() - stepStartTime.current) / 1000;
      const stepNames = [
        'personal_info',
        'professional_summary',
        'experience',
        'education',
        'skills',
        'additional_info',
      ];

      AnalyticsService.trackCVBuilderStepComplete(
        stepNames[step - 1] || 'unknown',
        timeSpent,
      );
      stepStartTime.current = Date.now();
    }
  }, [step]);

  // Track CV Builder completion
  useEffect(() => {
    if (isCompleted) {
      const totalTime = (Date.now() - cvBuilderStartTime.current) / 1000;
      AnalyticsService.trackCVBuilderFinish(
        template || 'default',
        totalTime,
        totalSteps,
      );
    }
  }, [isCompleted, template, totalSteps]);

  return {
    trackCVDownload: (format = 'pdf') => {
      AnalyticsService.trackCVDownload(template || 'default', format);
    },
    trackTemplateSelect: (selectedTemplate: string) => {
      AnalyticsService.trackCVTemplateSelect(selectedTemplate);
    },
  };
}
