'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface LoadingAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

interface ParsingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

export default function LoadingAnimation({
  isVisible,
  onComplete,
}: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: ParsingStep[] = [
    {
      id: 'analyzing',
      label: 'Analyzing CV structure',
      icon: <FileText className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'personal',
      label: 'Extracting personal information',
      icon: <User className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'contact',
      label: 'Finding contact details',
      icon: <Mail className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'experience',
      label: 'Processing work experience',
      icon: <Briefcase className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'education',
      label: 'Extracting education history',
      icon: <GraduationCap className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'skills',
      label: 'Categorizing skills',
      icon: <CheckCircle className='w-4 h-4' />,
      completed: false,
      current: false,
    },
    {
      id: 'finalizing',
      label: 'Finalizing data structure',
      icon: <Loader2 className='w-4 h-4 animate-spin' />,
      completed: false,
      current: false,
    },
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
      return;
    }

    const stepDurations = [1000, 1500, 800, 2000, 1200, 1000, 800]; // Longer durations to account for retries
    let totalDelay = 0;

    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setCompletedSteps((prev) => new Set([...Array.from(prev), step.id]));
      }, totalDelay);
      totalDelay += stepDurations[index];
    });

    // Complete the animation
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, totalDelay + 500);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='text-center mb-4'>
          <div className='relative inline-block mb-3'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <FileText className='w-6 h-6 text-white' />
            </div>
            <div className='absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
              <Loader2 className='w-3 h-3 text-white animate-spin' />
            </div>
          </div>
          <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
            AI-Powered CV Parsing
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Our AI is analyzing your CV and extracting information...
          </p>
        </div>

        {/* Progress Steps */}
        <div className='space-y-2'>
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === index;
            const isUpcoming = currentStep > index;

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                    : isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='w-4 h-4' />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Label */}
                <div className='flex-1'>
                  <p
                    className={`text-xs font-medium transition-colors duration-300 ${
                      isCompleted
                        ? 'text-green-700 dark:text-green-300'
                        : isCurrent
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className='flex-shrink-0'>
                  {isCompleted && (
                    <CheckCircle className='w-4 h-4 text-green-500' />
                  )}
                  {isCurrent && (
                    <div className='flex space-x-1'>
                      <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce'></div>
                      <div
                        className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className='mt-4'>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500 ease-out'
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 text-center'>
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Fun Facts */}
        <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700'>
          <p className='text-xs text-blue-700 dark:text-blue-300 text-center'>
            💡 <strong>Did you know?</strong> Our AI can extract information
            from CVs in multiple languages and formats!
          </p>
        </div>
      </div>
    </div>
  );
}
