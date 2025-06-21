import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size],
        )}
      />
      {text && (
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{text}</p>
      )}
    </div>
  );
};

// Page transition loading component
export const PageLoadingSpinner: React.FC<{ text?: string }> = ({
  text = 'Loading...',
}) => {
  return (
    <div className='fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50'>
      <LoadingSpinner size='lg' text={text} />
    </div>
  );
};

// Inline loading component
export const InlineSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'sm',
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        {
          'w-4 h-4': size === 'sm',
          'w-6 h-6': size === 'md',
          'w-8 h-8': size === 'lg',
        },
      )}
    />
  );
};
