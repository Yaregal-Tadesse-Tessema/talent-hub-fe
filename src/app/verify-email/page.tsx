'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  // Placeholder email, replace with actual logic later
  const email = 'emailaddress@gmail.com';

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <div className='flex flex-col items-center w-full max-w-md px-4'>
        <div className='mb-8 flex items-center gap-2'>
          <span className='inline-block bg-blue-100 p-2 rounded-full'>
            <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
              <rect width='24' height='24' rx='6' fill='#2563EB' />
              <path
                d='M8 17v-1a4 4 0 0 1 8 0v1'
                stroke='#fff'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <rect
                x='8'
                y='7'
                width='8'
                height='6'
                rx='3'
                stroke='#fff'
                strokeWidth='2'
              />
            </svg>
          </span>
          <span className='text-2xl font-semibold text-gray-900'>
            TalentHub
          </span>
        </div>
        <h2 className='text-2xl font-bold mb-2 text-center'>
          Email Verification
        </h2>
        <p className='mb-6 text-gray-600 text-center'>
          We&apos;ve sent an verification to{' '}
          <span className='font-medium text-gray-900'>{email}</span> to verify
          your email address and activate your account.
        </p>
        <form className='w-full space-y-4'>
          <input
            type='text'
            placeholder='Verification Code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
          />
          <Button type='submit' className='w-full mt-2'>
            Verify My Account <span className='ml-2'>&rarr;</span>
          </Button>
        </form>
        <div className='mt-6 text-center text-sm text-gray-600'>
          Didn&apos;t recieve any code?{' '}
          <button
            type='button'
            className='text-blue-600 font-medium hover:underline'
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
