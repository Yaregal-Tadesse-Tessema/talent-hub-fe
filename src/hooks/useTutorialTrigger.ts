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

    // Skip tutorial demo page
    if (pathname === '/tutorial-demo') return;

    // Only trigger on specific pages that have tutorials
    const tutorialPages = ['/find-job', '/find-candidates', '/dashboard'];
    if (!tutorialPages.includes(pathname)) return;

    // Check if we should show tutorial for this page
    const pageTutorialKey = `tutorialShown_${pathname}`;
    const hasShownTutorialForPage = localStorage.getItem(pageTutorialKey);

    if (!hasShownTutorialForPage) {
      // Get appropriate tutorial based on user role and current page
      const role = user.role;
      const tutorials = getTutorialsForRole(role, pathname);

      // Find the first tutorial that hasn't been seen
      const tutorialToShow = tutorials.find(
        (tutorial) => !hasSeenTutorial(tutorial.id),
      );

      if (tutorialToShow) {
        // Mark this page's tutorial as shown
        localStorage.setItem(pageTutorialKey, 'true');

        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          showTutorial(tutorialToShow);
        }, 1000);
      }
    }
  }, [user, pathname, showTutorial, hasSeenTutorial, isTutorialActive]);

  // Trigger tutorial on page change (for role-specific tutorials)
  useEffect(() => {
    if (!user || isTutorialActive) return;

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
    if (!role) return;

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
