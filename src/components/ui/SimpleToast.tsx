'use client';

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const SimpleToast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-blue-500' : 'bg-red-500'
      } text-white min-w-[300px] max-w-md`}
    >
      <div className='flex-1'>{message}</div>
      <button
        onClick={onClose}
        className='ml-4 text-white hover:text-gray-200 focus:outline-none'
      >
        <XMarkIcon className='h-5 w-5' />
      </button>
    </div>
  );
};

export default SimpleToast;
