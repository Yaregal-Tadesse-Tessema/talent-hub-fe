import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          confirmButton:
            'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
      default:
        return {
          icon: 'text-yellow-600',
          confirmButton:
            'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-4'>
          <ExclamationTriangleIcon className={`w-6 h-6 ${styles.icon}`} />
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {title}
          </h2>
        </div>

        <p className='text-gray-700 dark:text-gray-300 mb-6'>{message}</p>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-white ${styles.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
