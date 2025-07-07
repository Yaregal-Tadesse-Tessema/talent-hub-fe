'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial, TutorialStep } from '@/contexts/TutorialContext';
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiSkipForward,
} from 'react-icons/fi';

interface TutorialOverlayProps {
  children: React.ReactNode;
}

export default function TutorialOverlay({ children }: TutorialOverlayProps) {
  const {
    currentTutorial,
    currentStepIndex,
    isTutorialActive,
    nextStep,
    previousStep,
    closeTutorial,
    skipTutorial,
  } = useTutorial();

  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = currentTutorial?.steps[currentStepIndex];

  // Update highlight when step changes
  useEffect(() => {
    if (!isTutorialActive || !currentStep) return;

    const targetElement = document.querySelector(
      currentStep.target,
    ) as HTMLElement;
    if (targetElement) {
      setHighlightedElement(targetElement);

      const rect = targetElement.getBoundingClientRect();
      setHighlightPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Scroll element into view if needed
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [isTutorialActive, currentStep, currentStepIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTutorialActive) return;

      switch (e.key) {
        case 'Escape':
          closeTutorial();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousStep();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTutorialActive, nextStep, previousStep, closeTutorial]);

  if (!isTutorialActive || !currentTutorial || !currentStep) {
    return <>{children}</>;
  }

  const getTooltipPosition = (step: TutorialStep) => {
    if (!highlightedElement)
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = highlightedElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 320; // Approximate tooltip width
    const tooltipHeight = 200; // Approximate tooltip height

    let top: number | string = rect.bottom + 20;
    let left: number | string = rect.left + rect.width / 2;
    let transform = 'translateX(-50%)';

    switch (step.position) {
      case 'top':
        top = rect.top - 20;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%) translateY(-100%)';
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 20;
        transform = 'translateX(-100%) translateY(-50%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 20;
        transform = 'translateY(-50%)';
        break;
      case 'center':
        top = '50%';
        left = '50%';
        transform = 'translate(-50%, -50%)';
        break;
    }

    // Adjust for viewport boundaries
    const adjustedLeft =
      typeof left === 'number'
        ? Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10))
        : left;
    const adjustedTop =
      typeof top === 'number'
        ? Math.max(10, Math.min(top, viewportHeight - tooltipHeight - 10))
        : top;

    // If tooltip would be cut off, try alternative positions
    if (step.position !== 'center') {
      if (
        typeof adjustedTop === 'number' &&
        adjustedTop !== top &&
        step.position === 'bottom'
      ) {
        // If bottom is cut off, try top
        top = rect.top - 20;
        transform = 'translateX(-50%) translateY(-100%)';
      } else if (
        typeof adjustedTop === 'number' &&
        adjustedTop !== top &&
        step.position === 'top'
      ) {
        // If top is cut off, try bottom
        top = rect.bottom + 20;
        transform = 'translateX(-50%)';
      }

      if (
        typeof adjustedLeft === 'number' &&
        adjustedLeft !== left &&
        step.position === 'right'
      ) {
        // If right is cut off, try left
        left = rect.left - 20;
        transform = 'translateX(-100%) translateY(-50%)';
      } else if (
        typeof adjustedLeft === 'number' &&
        adjustedLeft !== left &&
        step.position === 'left'
      ) {
        // If left is cut off, try right
        left = rect.right + 20;
        transform = 'translateY(-50%)';
      }
    }

    return {
      top:
        typeof top === 'number'
          ? `${Math.max(10, Math.min(top, viewportHeight - tooltipHeight - 10))}px`
          : top,
      left:
        typeof left === 'number'
          ? `${Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10))}px`
          : left,
      transform,
    };
  };

  const tooltipPosition = getTooltipPosition(currentStep);

  return (
    <div ref={overlayRef} className='relative'>
      {children}

      <AnimatePresence>
        {isTutorialActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
            onClick={(e) => {
              // Close tutorial if clicking outside tooltip
              if (e.target === e.currentTarget) {
                closeTutorial();
              }
            }}
          >
            {/* Highlight overlay */}
            {highlightedElement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className='absolute border-2 border-blue-500 rounded-lg shadow-2xl'
                style={{
                  top: highlightPosition.top - 4,
                  left: highlightPosition.left - 4,
                  width: highlightPosition.width + 8,
                  height: highlightPosition.height + 8,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className='absolute inset-0 bg-blue-500/20 rounded-lg animate-pulse' />
              </motion.div>
            )}

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className='absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm p-6'
              style={{
                ...tooltipPosition,
                maxWidth: '320px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                zIndex: 9999,
              }}
            >
              {/* Progress indicator */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                    {currentStepIndex + 1}
                  </div>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    Step {currentStepIndex + 1} of{' '}
                    {currentTutorial.steps.length}
                  </span>
                </div>
                <button
                  onClick={closeTutorial}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {currentStep.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                  {currentStep.content}
                </p>
              </div>

              {/* Action button if specified */}
              {currentStep.action && currentStep.actionText && (
                <div className='mb-4'>
                  <button
                    onClick={() => {
                      if (
                        currentStep.action === 'click' &&
                        highlightedElement
                      ) {
                        highlightedElement.click();
                      }
                      nextStep();
                    }}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2'
                  >
                    <FiPlay size={16} />
                    <span>{currentStep.actionText}</span>
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  {currentStepIndex > 0 && (
                    <button
                      onClick={previousStep}
                      className='flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                    >
                      <FiChevronLeft size={16} />
                      <span className='text-sm'>Previous</span>
                    </button>
                  )}
                </div>

                <div className='flex items-center space-x-2'>
                  {currentStep.skipable && (
                    <button
                      onClick={skipTutorial}
                      className='flex items-center space-x-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                    >
                      <FiSkipForward size={16} />
                      <span className='text-sm'>Skip</span>
                    </button>
                  )}

                  <button
                    onClick={nextStep}
                    className='flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors'
                  >
                    <span className='text-sm'>
                      {currentStepIndex === currentTutorial.steps.length - 1
                        ? 'Finish'
                        : 'Next'}
                    </span>
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <p className='text-xs text-gray-400 dark:text-gray-500 text-center'>
                  Use ← → arrow keys to navigate, Space to continue, Esc to
                  close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
