'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import EmployerSelection from '@/components/EmployerSelection';
import { EmployerData } from '@/types/employer';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showEmployerSelection, setShowEmployerSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First try employer login
      const employerResponse = await fetch(
        `${API_BASE_URL}/auth/backOffice-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employerData = await employerResponse.json();
      if (employerResponse.ok) {
        // Store employers data
        localStorage.setItem('employers', JSON.stringify(employerData || []));
        console.log('employerData', employerData);
        // Show employer selection popup
        setShowEmployerSelection(true);
        setIsLoading(false);
        return;
      }

      // If employer login fails, try employee login
      const employeeResponse = await fetch(
        `${API_BASE_URL}/auth/portal-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employeeData = await employeeResponse.json();

      if (employeeResponse.ok) {
        const user = {
          ...employeeData?.profile,
          role: 'employee' as const,
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', employeeData.accessToken);
        localStorage.setItem('refreshToken', employeeData.refreshToken);

        // Check if there's a return URL stored
        const returnToJob = localStorage.getItem('returnToJob');
        const returnToCVBuilder = localStorage.getItem('returnToCVBuilder');

        if (returnToJob) {
          localStorage.removeItem('returnToJob'); // Clean up
          router.push(`/find-job/${returnToJob}?apply=true`);
        } else if (returnToCVBuilder) {
          localStorage.removeItem('returnToCVBuilder'); // Clean up
          router.push(returnToCVBuilder);
        } else {
          router.push('/find-job');
        }
      } else {
        // Show error message
        showToast({
          type: 'error',
          message: 'Invalid credentials',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast({
        type: 'error',
        message: 'An error occurred during login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployerSelect = async (employer: EmployerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/backOffice-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: email,
          password: password,
          orgId: employer.tenant.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data with role as employer and selected employer
        const userData = {
          ...data.profile,
          role: 'employer',
          selectedEmployer: employer,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // Close the popup and redirect to dashboard
        setShowEmployerSelection(false);
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw to let the component handle the loading state
    }
  };

  const handleCloseEmployerSelection = () => {
    setShowEmployerSelection(false);
    // Clear all auth-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <div className='min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      <div className='flex flex-1'>
        {/* Left: Hero Section */}
        <div className='hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 justify-center items-center relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-10 left-10 w-32 h-32 bg-white rounded-full'></div>
            <div className='absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full'></div>
            <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full'></div>
          </div>

          <div className='max-w-lg w-full p-12 text-white relative z-10'>
            <div className='mb-8'>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6'
                  />
                </svg>
              </div>
              <h1 className='text-4xl font-bold mb-4 leading-tight'>
                Welcome to <span className='text-blue-200'>TalentHub</span>
              </h1>
              <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
                Connect with top talent and opportunities. Your gateway to
                professional success starts here.
              </p>
            </div>

            {/* Feature Cards */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm'>
                <div className='w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-white'>
                    AI-Powered Matching
                  </h3>
                  <p className='text-blue-100 text-sm'>
                    Find the perfect job or candidate with intelligent
                    recommendations
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm'>
                <div className='w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-white'>
                    Smart Resume Builder
                  </h3>
                  <p className='text-blue-100 text-sm'>
                    Create professional resumes that stand out to employers
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm'>
                <div className='w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-white'>Global Network</h3>
                  <p className='text-blue-100 text-sm'>
                    Connect with professionals and companies worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className='flex w-full md:w-1/2 justify-center items-center p-8'>
          <div className='max-w-md w-full'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Welcome back
              </h2>
              <p className='text-gray-600'>
                Sign in to your{' '}
                <span className='text-blue-600 font-semibold'>
                  <a href='/'>TalentHub</a>
                </span>{' '}
                account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email or Phone Number
                </label>
                <input
                  id='email'
                  type='text'
                  placeholder='Enter your email or phone number'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12'
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember'
                    type='checkbox'
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='remember'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className='text-center mt-8'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link
                  href='/signup'
                  className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'
                >
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='w-full py-6 px-8 flex flex-col md:flex-row items-center justify-center md:justify-between bg-white/80 backdrop-blur-sm border-t border-gray-200/50'>
        <div className='flex gap-6 mb-4 md:mb-0'>
          <a
            href='#'
            className='text-gray-500 hover:text-gray-700 transition-colors text-sm'
          >
            Privacy & Terms
          </a>
          <a
            href='#'
            className='text-gray-500 hover:text-gray-700 transition-colors text-sm'
          >
            Contact Us
          </a>
          <a
            href='#'
            className='text-gray-500 hover:text-gray-700 transition-colors text-sm'
          >
            Help Center
          </a>
        </div>
        <div className='flex items-center space-x-2 text-gray-500 text-sm'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
            />
          </svg>
          <span>English</span>
        </div>
      </footer>

      {/* Employer Selection Modal */}
      {showEmployerSelection && (
        <EmployerSelection
          employers={JSON.parse(localStorage.getItem('employers') || '[]')}
          onSelect={handleEmployerSelect}
          isOpen={showEmployerSelection}
          onClose={handleCloseEmployerSelection}
        />
      )}
    </div>
  );
}
