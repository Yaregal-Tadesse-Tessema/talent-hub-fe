'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'scroll' | 'wait';
  actionText?: string;
  skipable?: boolean;
}

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
  role: 'employee' | 'employer' | 'both';
  page: string; // Which page this tutorial is for
}

interface TutorialContextType {
  currentTutorial: Tutorial | null;
  currentStepIndex: number;
  isTutorialActive: boolean;
  showTutorial: (tutorial: Tutorial) => void;
  nextStep: () => void;
  previousStep: () => void;
  closeTutorial: () => void;
  skipTutorial: () => void;
  hasSeenTutorial: (tutorialId: string) => boolean;
  markTutorialAsSeen: (tutorialId: string) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  // Check if user has seen a tutorial
  const hasSeenTutorial = (tutorialId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const seenTutorials = localStorage.getItem('seenTutorials');
    if (!seenTutorials) return false;

    try {
      const parsed = JSON.parse(seenTutorials);
      return parsed.includes(tutorialId);
    } catch {
      return false;
    }
  };

  // Mark tutorial as seen
  const markTutorialAsSeen = (tutorialId: string) => {
    if (typeof window === 'undefined') return;

    const seenTutorials = localStorage.getItem('seenTutorials');
    let parsed: string[] = [];

    if (seenTutorials) {
      try {
        parsed = JSON.parse(seenTutorials);
      } catch {
        parsed = [];
      }
    }

    if (!parsed.includes(tutorialId)) {
      parsed.push(tutorialId);
      localStorage.setItem('seenTutorials', JSON.stringify(parsed));
    }
  };

  const showTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
    setCurrentStepIndex(0);
    setIsTutorialActive(true);
  };

  const nextStep = () => {
    if (!currentTutorial) return;

    if (currentStepIndex < currentTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tutorial completed
      markTutorialAsSeen(currentTutorial.id);
      closeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const closeTutorial = () => {
    setIsTutorialActive(false);
    setCurrentTutorial(null);
    setCurrentStepIndex(0);
  };

  const skipTutorial = () => {
    if (currentTutorial) {
      markTutorialAsSeen(currentTutorial.id);
    }
    closeTutorial();
  };

  const value: TutorialContextType = {
    currentTutorial,
    currentStepIndex,
    isTutorialActive,
    showTutorial,
    nextStep,
    previousStep,
    closeTutorial,
    skipTutorial,
    hasSeenTutorial,
    markTutorialAsSeen,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
