'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
            <Link href='/'>TalentHub</Link>
          </span>
        </div>
        <h2 className='text-2xl font-bold mb-2 text-center'>Reset Password</h2>
        <p className='mb-6 text-gray-600 text-center'>
          Duis luctus interdum metus, ut consectetur ante consectetur sed.
          Suspendisse euismod viverra massa sit amet mollis.
        </p>
        <form className='w-full space-y-4'>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
            />
            <button
              type='button'
              className='absolute right-2 top-2 text-gray-400'
              onClick={() => setShowPassword((v) => !v)}
            >
              <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                <path
                  d='M10 4.167c-4.167 0-7.5 3.333-7.5 5.833s3.333 5.833 7.5 5.833 7.5-3.333 7.5-5.833-3.333-5.833-7.5-5.833Zm0 9.166a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666Z'
                  stroke='#9CA3AF'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          <div className='relative'>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder='Confirm Password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
            />
            <button
              type='button'
              className='absolute right-2 top-2 text-gray-400'
              onClick={() => setShowConfirm((v) => !v)}
            >
              <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                <path
                  d='M10 4.167c-4.167 0-7.5 3.333-7.5 5.833s3.333 5.833 7.5 5.833 7.5-3.333 7.5-5.833-3.333-5.833-7.5-5.833Zm0 9.166a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666Z'
                  stroke='#9CA3AF'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          <Button type='submit' className='w-full mt-2'>
            Reset Password <span className='ml-2'>&rarr;</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
