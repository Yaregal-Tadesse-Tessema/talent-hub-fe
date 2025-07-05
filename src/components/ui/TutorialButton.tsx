'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHelpCircle, FiPlay, FiX } from 'react-icons/fi';
import { useTutorial } from '@/contexts/TutorialContext';
import { getTutorialsForRole, getTutorialById } from '@/constants/tutorials';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface TutorialButtonProps {
  tutorialId?: string; // Specific tutorial to show
  className?: string;
  variant?: 'floating' | 'inline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function TutorialButton({
  tutorialId,
  className = '',
  variant = 'floating',
  size = 'md',
}: TutorialButtonProps) {
  const { user } = useAuth();
  const { showTutorial, hasSeenTutorial } = useTutorial();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const role = user?.role;
  const availableTutorials = role ? getTutorialsForRole(role, pathname) : [];

  const handleTutorialClick = (tutorialId: string) => {
    const tutorial = getTutorialById(tutorialId);
    if (tutorial) {
      showTutorial(tutorial);
      setShowMenu(false);
    }
  };

  const getAvailableTutorials = () => {
    if (tutorialId) {
      const tutorial = getTutorialById(tutorialId);
      return tutorial ? [tutorial] : [];
    }
    return availableTutorials.filter(
      (tutorial) => !hasSeenTutorial(tutorial.id),
    );
  };

  const tutorials = getAvailableTutorials();

  if (tutorials.length === 0) {
    return null; // Don't show button if no tutorials available
  }

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={() => handleTutorialClick(tutorials[0].id)}
        className={`text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${className}`}
        title='Start tutorial'
      >
        <FiHelpCircle size={iconSizes[size]} />
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className='relative'>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${sizeClasses[size]} ${className}`}
        >
          <FiHelpCircle size={iconSizes[size]} />
          <span>Help</span>
        </button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-48 z-50'
          >
            <div className='p-2'>
              <div className='text-xs text-gray-500 dark:text-gray-400 px-2 py-1 border-b border-gray-200 dark:border-gray-700'>
                Available Tutorials
              </div>
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial.id}
                  onClick={() => handleTutorialClick(tutorial.id)}
                  className='w-full text-left px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm transition-colors'
                >
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {tutorial.name}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {tutorial.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Floating variant (default)
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleTutorialClick(tutorials[0].id)}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40 ${className}`}
      title='Start tutorial'
    >
      <FiHelpCircle size={24} />
    </motion.button>
  );
}
