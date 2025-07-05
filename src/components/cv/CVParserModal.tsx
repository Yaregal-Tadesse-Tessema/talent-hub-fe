'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import CVParser from './CVParser';
import { X } from 'lucide-react';

interface CVParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  userId: string;
}

export default function CVParserModal({
  isOpen,
  onClose,
  onSave,
  userId,
}: CVParserModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center p-4'>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
          onClick={onClose}
        />

        {/* Modal */}
        <div className='relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-xl shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              CV Parser
            </h2>
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className='max-h-[80vh] overflow-y-auto'>
            <CVParser
              onSave={(profile) => {
                onSave(profile);
                onClose();
              }}
              onCancel={onClose}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
