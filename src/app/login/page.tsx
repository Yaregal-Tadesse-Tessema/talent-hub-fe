'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
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
          router.push('/dashboard');
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
      }
    } catch (error) {
      console.error('Error:', error);
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
    <div className='min-h-screen flex flex-col justify-between'>
      <div className='flex flex-1'>
        {/* Left: What's the latest */}
        <div className='hidden md:flex w-1/2 bg-gray-50 justify-center items-center border-r border-gray-50'>
          <div className='max-w-md w-full p-8 bg-white rounded-lg shadow-md'>
            <img
              src='/images/job-news.avif'
              alt='Bird'
              className='w-full h-48 mr-2'
            />
            <div className='flex items-center my-4'>
              <span className='text-lg font-semibold text-blue-700'>
                Latest Updates
              </span>
            </div>
            <div className='mb-8'>
              <h3 className='text-xl font-bold text-gray-900 mb-1'>
                New Resume Builder Launched!
              </h3>
              <div className='text-xs text-gray-500 mb-2'>Mon May 26 2025</div>
              <div className='text-gray-700 text-sm mb-2'>
                Create a professional resume in minutes with our new Resume
                Builder. Stand out to top employers and land your dream job
                faster. Try it now in your dashboard!
              </div>
              <a href='#' className='text-blue-700 text-sm hover:underline'>
                Learn more
              </a>
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900 mb-1'>
                Find Top Talent with AI Matchmaking
              </h3>
              <div className='text-xs text-gray-500 mb-2'>Fri Mar 07 2025</div>
              <div className='text-gray-700 text-sm mb-2'>
                Our new AI-powered matchmaking system connects you instantly
                with the most suitable candidates for your open positions. Save
                time and hire smarter with intelligent recommendations.
              </div>
              <a href='#' className='text-blue-700 text-sm hover:underline'>
                Learn more
              </a>
            </div>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className='flex w-full md:w-1/2 justify-center items-center'>
          <div className='max-w-md w-full p-8 bg-white rounded shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>
              Sign in to your{' '}
              <span className='text-blue-600'>
                <a href='/'>TalentHub</a>
              </span>{' '}
              account
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <input
                type='text'
                placeholder='Enter your email or phone number'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
                required
              />
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
                  required
                />
                <button
                  type='button'
                  className='absolute right-2 top-2 text-gray-400'
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
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
              <Button
                type='submit'
                className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
              <div className='flex items-center justify-between text-sm mt-2'>
                <div className='flex items-center gap-2'>
                  <input
                    id='remember'
                    type='checkbox'
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className='h-4 w-4 border rounded'
                  />
                  <label htmlFor='remember' className='text-gray-600'>
                    Remember Me
                  </label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-blue-700 hover:underline font-medium'
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
            <div className='text-center mt-6 text-sm text-gray-700'>
              Don't have an account?{' '}
              <Link
                href='/signup'
                className='text-blue-700 hover:underline font-medium'
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className='w-full py-4 px-4 flex flex-col md:flex-row items-center justify-center md:justify-between bg-white border-t border-gray-200 text-xs text-gray-500'>
        <div className='flex gap-4 mb-2 md:mb-0'>
          <a href='#' className='hover:underline'>
            Privacy & Terms
          </a>
          <a href='#' className='hover:underline'>
            Contact Us
          </a>
        </div>
        <div>English</div>
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
