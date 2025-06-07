'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { api } from '@/config/api';
import { useToast } from '@/contexts/ToastContext';

type UserType = 'employee' | 'employer';

interface EmployeeFormData {
  phone: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  status: 'Active';
  password: string;
  address: Record<string, any>;
  birthDate: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [userType, setUserType] = useState<UserType>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [employeeData, setEmployeeData] = useState<EmployeeFormData>({
    phone: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'male',
    status: 'Active',
    password: '',
    address: {},
    birthDate: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation - can be adjusted based on requirements
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name: string): boolean => {
    // Only letters, spaces, and hyphens, 2-50 characters
    const nameRegex = /^[A-Za-z\s-]{2,50}$/;
    return nameRegex.test(name);
  };

  const validateBirthDate = (date: string): boolean => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!employeeData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(employeeData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!employeeData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(employeeData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (employeeData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!employeeData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(employeeData.firstName)) {
      newErrors.firstName =
        'First name should only contain letters, 2-50 characters';
    }

    // Last name validation
    if (!employeeData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateName(employeeData.lastName)) {
      newErrors.lastName =
        'Last name should only contain letters, 2-50 characters';
    }

    // Phone validation (if provided)
    if (employeeData.phone && !validatePhone(employeeData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Birth date validation
    if (!employeeData.birthDate) {
      newErrors.birthDate = 'Date of birth is required';
    } else if (!validateBirthDate(employeeData.birthDate)) {
      newErrors.birthDate = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmployeeInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show the first error in toast
      const firstError = Object.values(errors)[0];
      showToast({
        type: 'error',
        message: firstError || 'Please check the form for errors',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/users', employeeData);

      if (response.data) {
        showToast({
          type: 'success',
          message: 'Account created successfully! Please log in.',
        });
        router.push('/login');
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Left: Signup Form */}
      <div className='w-full md:w-1/2'>
        <div className='flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-32 py-8 md:py-12 bg-white'>
          <div className='mb-8 flex items-center gap-2'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='inline-block bg-blue-100 p-2 rounded-full'>
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                  <rect width='24' height='24' rx='6' fill='#2563EB' />
                  <path
                    d='M8 17v-1a4 4 0 0 1 8 0v1'
                    stroke='#fff'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <circle
                    cx='12'
                    cy='9'
                    r='4'
                    stroke='#fff'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              <span className='text-xl font-semibold text-gray-900'>
                TalentHub
              </span>
            </Link>
          </div>
          <h2 className='text-2xl font-bold mb-2'>Create account.</h2>
          <p className='mb-6 text-gray-600 text-sm'>
            Already have account?{' '}
            <Link
              href='/login'
              className='text-blue-600 font-medium hover:underline'
            >
              Log In
            </Link>
          </p>

          {/* User Type Switcher */}
          <div className='mb-6 flex gap-4'>
            <button
              onClick={() => setUserType('employee')}
              className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                userType === 'employee'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Employee
            </button>
            <button
              onClick={() => setUserType('employer')}
              className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                userType === 'employer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Employer
            </button>
          </div>

          {userType === 'employee' ? (
            <form onSubmit={handleEmployeeSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <input
                    type='text'
                    name='firstName'
                    placeholder='First Name'
                    value={employeeData.firstName}
                    onChange={handleEmployeeInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type='text'
                    name='middleName'
                    placeholder='Middle Name'
                    value={employeeData.middleName}
                    onChange={handleEmployeeInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      errors.middleName ? 'border-red-500' : ''
                    }`}
                  />
                </div>
              </div>
              <div>
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={employeeData.lastName}
                  onChange={handleEmployeeInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.lastName ? 'border-red-500' : ''
                  }`}
                />
                {errors.lastName && (
                  <p className='mt-1 text-sm text-red-500'>{errors.lastName}</p>
                )}
              </div>
              <div>
                <input
                  type='email'
                  name='email'
                  placeholder='Email address'
                  value={employeeData.email}
                  onChange={handleEmployeeInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type='tel'
                  name='phone'
                  placeholder='Phone Number'
                  value={employeeData.phone}
                  onChange={handleEmployeeInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
                {errors.phone && (
                  <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>
                )}
              </div>
              <select
                name='gender'
                value={employeeData.gender}
                onChange={handleEmployeeInputChange}
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
              <div>
                <input
                  type='date'
                  name='birthDate'
                  value={employeeData.birthDate}
                  onChange={handleEmployeeInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.birthDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.birthDate && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.birthDate}
                  </p>
                )}
              </div>
              <div>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Password'
                    value={employeeData.password}
                    onChange={handleEmployeeInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
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
                {errors.password && (
                  <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
                )}
              </div>
              <div>
                <div className='relative'>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
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
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                type='submit'
                className='w-full mt-2'
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-600'>
                Employer registration coming soon!
              </p>
            </div>
          )}

          <div className='flex items-center my-4'>
            <div className='flex-grow h-px bg-gray-200' />
            <span className='mx-2 text-gray-400 text-sm'>or</span>
            <div className='flex-grow h-px bg-gray-200' />
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='w-1/2 h-20 flex items-center justify-center gap-2'
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
              Sign up with Google
            </Button>
            <Button
              variant='outline'
              className='w-1/2 h-20 flex items-center justify-center gap-2'
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
              Sign up with Facebook
            </Button>
          </div>
        </div>
      </div>
      {/* Right: Stats & BG */}
      <div className='hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-700 relative clip-path-diagonal'>
        <style jsx>{`
          .clip-path-diagonal {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%);
          }
        `}</style>
        <div className='absolute inset-0 grid grid-cols-3 grid-rows-4 gap-0 opacity-30'>
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`bg-gray-${i % 2 === 0 ? '600' : '200'} w-full h-full`}
            />
          ))}
        </div>
        <div className='relative z-10 text-center'>
          <h2 className='text-3xl font-semibold text-white mb-4'>
            Over 1,75,324 candidates
            <br />
            waiting for good employees.
          </h2>
          <div className='flex justify-center gap-8 mt-8'>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>1,75,324</span>
              <span className='text-gray-300 text-sm mt-1'>Live Job</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>97,354</span>
              <span className='text-gray-300 text-sm mt-1'>Companies</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>7,532</span>
              <span className='text-gray-300 text-sm mt-1'>New Jobs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
