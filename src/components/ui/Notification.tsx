import React from 'react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
        type === 'success'
          ? 'bg-green-50 text-green-800'
          : 'bg-red-50 text-red-800'
      }`}
    >
      <div className='flex-1'>{message}</div>
      <button
        onClick={onClose}
        className='p-1 hover:bg-white/50 rounded-full transition-colors'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='18' y1='6' x2='6' y2='18'></line>
          <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </button>
    </div>
  );
}
