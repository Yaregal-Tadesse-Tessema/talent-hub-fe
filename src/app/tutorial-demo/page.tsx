'use client';

import React from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTutorialById } from '@/constants/tutorials';
import TutorialButton from '@/components/ui/TutorialButton';

export default function TutorialDemoPage() {
  const { showTutorial } = useTutorial();
  const { user, updateUserIsFirstTime } = useAuth();

  const handleStartTutorial = (tutorialId: string) => {
    const tutorial = getTutorialById(tutorialId);
    if (tutorial) {
      showTutorial(tutorial);
    }
  };

  const handleResetIsFirstTime = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.isFirstTime = true;
        localStorage.setItem('user', JSON.stringify(userData));
        // Reload the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error('Error resetting isFirstTime:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
          Tutorial System Demo
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Demo Section 1 */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
              Interactive Elements
            </h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Search Bar
                </label>
                <input
                  data-tutorial='search-bar'
                  type='text'
                  placeholder='Search for something...'
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Filters
                </label>
                <button
                  data-tutorial='filters'
                  className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                >
                  Open Filters
                </button>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Job Card
                </label>
                <div
                  data-tutorial='job-card'
                  className='p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                >
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    Software Engineer
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Tech Company Inc.
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-500'>
                    $80k - $120k
                  </p>
                </div>
              </div>

              <div>
                <button
                  data-tutorial='apply-button'
                  className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Demo Section 2 */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
              Tutorial Controls
            </h2>

            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                  Start Tutorials
                </h3>
                <div className='space-y-2'>
                  <button
                    onClick={() => handleStartTutorial('employee-find-job')}
                    className='w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors'
                  >
                    Employee Find Job Tutorial
                  </button>
                  <button
                    onClick={() =>
                      handleStartTutorial('employer-find-candidates')
                    }
                    className='w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors'
                  >
                    Employer Find Candidates Tutorial
                  </button>
                  <button
                    onClick={() => handleStartTutorial('general-navigation')}
                    className='w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors'
                  >
                    General Navigation Tutorial
                  </button>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                  Tutorial Button Variants
                </h3>
                <div className='space-y-2'>
                  <TutorialButton variant='inline' size='md' />
                  <TutorialButton variant='icon' size='lg' />
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                  Profile Link
                </h3>
                <a
                  data-tutorial='profile-link'
                  href='#'
                  className='inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors'
                >
                  Go to Profile
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100'>
            How to Use
          </h2>
          <div className='space-y-2 text-blue-800 dark:text-blue-200'>
            <p>• Click any tutorial button to start a guided tour</p>
            <p>• Use arrow keys or click Next/Previous to navigate</p>
            <p>• Press Escape to close the tutorial</p>
            <p>• Click outside the tutorial to close it</p>
            <p>• Tutorials will automatically show on successful login</p>
          </div>
        </div>

        {/* Test Section */}
        <div className='mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4 text-yellow-900 dark:text-yellow-100'>
            Testing isFirstTime Functionality
          </h2>
          <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-4'>
              <h3 className='text-lg font-medium mb-2 text-gray-900 dark:text-white'>
                Current User Status
              </h3>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>User:</strong> {user?.name || 'Not logged in'}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role || 'N/A'}
                </p>
                <p>
                  <strong>isFirstTime:</strong>{' '}
                  {user?.isFirstTime ? 'true' : 'false'}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email || 'N/A'}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <button
                onClick={handleResetIsFirstTime}
                className='px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors'
              >
                Reset isFirstTime to true
              </button>
              <button
                onClick={() =>
                  updateUserIsFirstTime().catch((error) =>
                    console.error('Error updating isFirstTime:', error),
                  )
                }
                className='px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors'
              >
                Set isFirstTime to false
              </button>
            </div>

            <div className='text-sm text-yellow-800 dark:text-yellow-200'>
              <p>
                <strong>Testing Instructions:</strong>
              </p>
              <ul className='list-disc list-inside space-y-1 mt-2'>
                <li>
                  Set isFirstTime to true, then navigate to /find-job,
                  /find-candidates, or /dashboard
                </li>
                <li>Tutorial should automatically show for first-time users</li>
                <li>
                  Complete or skip the tutorial to see isFirstTime change to
                  false
                </li>
                <li>
                  Navigate to the same page again - tutorial should not show
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
