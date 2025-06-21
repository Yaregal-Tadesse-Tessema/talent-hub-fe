'use client';

import React from 'react';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

export function ThemeToggle({
  variant = 'button',
  className = '',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <div className='flex flex-col space-y-1'>
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiSun className='w-4 h-4' />
            <span className='text-sm'>Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiMoon className='w-4 h-4' />
            <span className='text-sm'>Dark</span>
          </button>
          <button
            onClick={() => setTheme('auto')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === 'auto'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiGlobe className='w-4 h-4' />
            <span className='text-sm'>Auto</span>
          </button>
        </div>
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={() => {
        const themes: Array<'light' | 'dark' | 'auto'> = [
          'light',
          'dark',
          'auto',
        ];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      }}
      className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      title={`Current theme: ${theme}`}
    >
      {theme === 'light' && <FiSun className='w-5 h-5 text-yellow-500' />}
      {theme === 'dark' && <FiMoon className='w-5 h-5 text-gray-300' />}
      {theme === 'auto' && <FiGlobe className='w-5 h-5 text-blue-500' />}
    </button>
  );
}
