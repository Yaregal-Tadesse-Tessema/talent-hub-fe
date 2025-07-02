'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { userService } from '@/services/userService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Get dynamic origin
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://138.197.105.31:3000';

      const response = await userService.sendPasswordResetEmail({
        email: email,
        link: `${origin}/reset-password`,
      });

      setMessage(
        'Password reset email sent successfully! Please check your email.',
      );
      setEmail('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to send password reset email. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='flex flex-col justify-center px-6 py-12 bg-white rounded-xl shadow-sm max-w-xl w-full mx-4'>
        <div className='mb-8 flex justify-center items-center gap-2'>
          <span className='inline-block bg-blue-100 p-2 rounded-full items-center'>
            <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
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
          <span className='text-xl font-semibold text-gray-900'>
            <Link href='/'>TalentHub</Link>
          </span>
        </div>
        <h2 className='text-2xl text-center font-bold mb-2'>Forget Password</h2>
        <p className='mb-6 text-center text-gray-600 text-sm'>
          Go back to{' '}
          <Link
            href='/login'
            className='text-blue-600 font-medium hover:underline'
          >
            Sign In
          </Link>
        </p>
        <p className='mb-6 text-center text-gray-600 text-sm'>
          Don&apos;t have account{' '}
          <Link
            href='/signup'
            className='text-blue-600 font-medium hover:underline'
          >
            Create Account
          </Link>
        </p>

        {message && (
          <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>
            {message}
          </div>
        )}

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
            disabled={isLoading}
          />
          <Button type='submit' className='w-full mt-2' disabled={isLoading}>
            {isLoading ? (
              <>
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
                Sending...
              </>
            ) : (
              <>
                Reset Password <span className='ml-2'>&rarr;</span>
              </>
            )}
          </Button>
        </form>
        <div className='flex items-center my-4'>
          <div className='flex-grow h-px bg-gray-200' />
          <span className='mx-2 text-gray-400 text-sm'>or</span>
          <div className='flex-grow h-px bg-gray-200' />
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='w-1/2 flex items-center justify-center gap-2'
            disabled={isLoading}
          >
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <g clipPath='url(#clip0_88_102)'>
                <path
                  d='M19.805 10.23c0-.68-.06-1.36-.18-2.02H10.2v3.83h5.44a4.64 4.64 0 0 1-2.01 3.05v2.54h3.25c1.9-1.75 2.93-4.33 2.93-7.4Z'
                  fill='#4285F4'
                />
                <path
                  d='M10.2 20c2.7 0 4.97-.89 6.63-2.41l-3.25-2.54c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H1.25v2.59A10 10 0 0 0 10.2 20Z'
                  fill='#34A853'
                />
                <path
                  d='M4.61 11.88a5.99 5.99 0 0 1 0-3.76V5.53H1.25a10 10 0 0 0 0 8.94l3.36-2.59Z'
                  fill='#FBBC05'
                />
                <path
                  d='M10.2 3.96c1.47 0 2.78.51 3.81 1.5l2.85-2.85C15.17.89 12.9 0 10.2 0A10 10 0 0 0 1.25 5.53l3.36 2.59c.79-2.37 2.99-4.13 5.59-4.13Z'
                  fill='#EA4335'
                />
              </g>
              <defs>
                <clipPath id='clip0_88_102'>
                  <rect width='20' height='20' fill='#fff' />
                </clipPath>
              </defs>
            </svg>
            Sign in with Google
          </Button>
          <Button
            variant='outline'
            className='w-1/2 flex items-center justify-center gap-2'
            disabled={isLoading}
          >
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path
                d='M20 10.061C20 4.505 15.523 0 10 0S0 4.505 0 10.061c0 5.018 3.657 9.167 8.438 9.878v-6.99H5.898v-2.888h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C16.343 19.228 20 15.079 20 10.06Z'
                fill='#1877F2'
              />
              <path
                d='M13.656 12.948l.443-2.888h-2.773V8.185c0-.791.388-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89v1.386H5.898v2.888h2.54v6.99a10.07 10.07 0 0 0 1.562.121c.53 0 1.05-.042 1.562-.121v-6.99h2.094Z'
                fill='#fff'
              />
            </svg>
            Sign in with Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
