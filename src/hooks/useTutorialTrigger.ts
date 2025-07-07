'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTutorial } from '@/contexts/TutorialContext';
import { getTutorialsForRole } from '@/constants/tutorials';

export function useTutorialTrigger() {
  const { user } = useAuth();
  const { showTutorial, hasSeenTutorial, isTutorialActive } = useTutorial();
  const router = useRouter();
  const pathname = usePathname();

  // Trigger tutorial on successful login and page navigation
  useEffect(() => {
    if (!user || isTutorialActive) return;

    // Only show tutorial if user is logging in for the first time
    if (!user.isFirstTime) return;

    // Skip tutorial demo page
    if (pathname === '/tutorial-demo') return;

    // Only trigger on specific pages that have tutorials
    const tutorialPages = ['/find-job', '/find-candidates', '/dashboard'];
    if (!pathname || !tutorialPages.includes(pathname)) return;

    // Get appropriate tutorial based on user role and current page
    const role = user.role;
    const tutorials = getTutorialsForRole(role, pathname);

    // Find the first tutorial that hasn't been seen
    const tutorialToShow = tutorials.find(
      (tutorial) => !hasSeenTutorial(tutorial.id),
    );

    if (tutorialToShow) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        showTutorial(tutorialToShow);
        // Mark user as not first time anymore
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.isFirstTime = false;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (e) {
          // ignore
        }
      }, 1000);
    }
  }, [user, pathname, showTutorial, hasSeenTutorial, isTutorialActive]);

  // Trigger tutorial on page change (for role-specific tutorials)
  useEffect(() => {
    if (!user || isTutorialActive || !pathname) return;

    const role = user.role;
    const tutorials = getTutorialsForRole(role, pathname);

    // Check if there's a tutorial for this specific page that hasn't been seen
    const pageSpecificTutorial = tutorials.find(
      (tutorial) => tutorial.page === pathname && !hasSeenTutorial(tutorial.id),
    );

    if (pageSpecificTutorial) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        showTutorial(pageSpecificTutorial);
      }, 1500);
    }
  }, [pathname, user, showTutorial, hasSeenTutorial, isTutorialActive]);

  // Function to manually trigger a tutorial (for testing or manual activation)
  const triggerTutorial = (tutorialId: string) => {
    const role = user?.role;
    if (!role || !pathname) return;

    const tutorials = getTutorialsForRole(role, pathname);
    const tutorial = tutorials.find((t) => t.id === tutorialId);

    if (tutorial) {
      showTutorial(tutorial);
    }
  };

  // Function to reset tutorial state (for testing)
  const resetTutorialState = () => {
    localStorage.removeItem('tutorialTriggered');
    localStorage.removeItem('seenTutorials');
  };

  return {
    triggerTutorial,
    resetTutorialState,
  };
}
