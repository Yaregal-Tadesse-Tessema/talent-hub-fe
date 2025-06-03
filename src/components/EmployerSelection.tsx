'use client';

import React, { useEffect } from 'react';
import { EmployerData } from '@/types/employer';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EmployerSelectionProps {
  employers: EmployerData[];
  onSelect: (employer: EmployerData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployerSelection({
  employers,
  onSelect,
  isOpen,
  onClose,
}: EmployerSelectionProps) {
  useEffect(() => {
    console.log(employers);
  }, []);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-500'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>

          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Select Your Company
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Please select the company
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {employers.map((employer) => (
              <div
                key={employer.id}
                onClick={() => onSelect(employer)}
                className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-500 cursor-pointer group'
              >
                <div className='p-6 flex flex-col items-center justify-center'>
                  <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                    <span className='text-3xl font-semibold text-gray-400'>
                      {employer?.tenant?.tradeName?.charAt(0)}
                    </span>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors'>
                    {employer?.tenant?.tradeName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
