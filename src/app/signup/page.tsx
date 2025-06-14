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
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(false);
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
        setShowSuccess(true);
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to create account. Please try again.',
      });
      setShowSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-4 mt-6 flex flex-col items-center'>
        {/* Logo/Illustration */}
        <div className='mb-4'>
          {/* Replace with your logo if available */}
          <svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
            <circle cx='32' cy='32' r='32' fill='#2563EB' />
            <text
              x='32'
              y='40'
              textAnchor='middle'
              fontSize='28'
              fill='#fff'
              fontWeight='bold'
            >
              TH
            </text>
          </svg>
        </div>
        <h2 className='text-2xl font-bold mb-2 text-center'>
          Create a completely free account
        </h2>
        <form
          onSubmit={handleEmployeeSubmit}
          className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'
        >
          <input
            type='text'
            name='firstName'
            placeholder='Enter Your First Name'
            value={employeeData.firstName}
            onChange={handleEmployeeInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.firstName ? 'border-red-500' : ''}`}
          />
          <input
            type='text'
            name='middleName'
            placeholder='Enter Your Middle Name'
            value={employeeData.middleName}
            onChange={handleEmployeeInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.middleName ? 'border-red-500' : ''}`}
          />
          <input
            type='text'
            name='lastName'
            placeholder='Enter Your Last Name'
            value={employeeData.lastName}
            onChange={handleEmployeeInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.lastName ? 'border-red-500' : ''}`}
          />
          <input
            type='email'
            name='email'
            placeholder='Enter Your Email'
            value={employeeData.email}
            onChange={handleEmployeeInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-500' : ''}`}
          />
          <input
            type='tel'
            name='phone'
            placeholder='Enter Your Phone Number'
            value={employeeData.phone}
            onChange={handleEmployeeInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.phone ? 'border-red-500' : ''}`}
          />
          <select
            name='gender'
            value={employeeData.gender}
            onChange={handleEmployeeInputChange}
            className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200'
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          <input
            type='date'
            name='birthDate'
            value={employeeData.birthDate}
            onChange={handleEmployeeInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 md:col-span-2 ${errors.birthDate ? 'border-red-500' : ''}`}
          />
          <div className='relative w-full'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Enter Your Password'
              value={employeeData.password}
              onChange={handleEmployeeInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
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
          <div className='relative w-full'>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder='Confirm Your Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
              onClick={() => setShowConfirm((v) => !v)}
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
          {/* Password requirements */}
          <ul className='text-xs text-gray-600 mb-2 space-y-1 md:col-span-2'>
            <li className='flex items-center gap-2'>
              <span className='text-green-600'>•</span> 8 characters minimum
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-green-600'>•</span> At least one number
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-green-600'>•</span> Upper & lowercase
              character
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-green-600'>•</span> At least one special
              character
            </li>
          </ul>
          {/* Error and Success Messages */}
          {(Object.values(errors).some(Boolean) || showSuccess) && (
            <div
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg mt-2 md:col-span-2 ${
                showSuccess
                  ? 'bg-green-50 border border-green-400 text-green-700'
                  : 'bg-red-50 border border-red-400 text-red-700'
              }`}
            >
              {showSuccess ? (
                <>
                  <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                    <circle cx='10' cy='10' r='10' fill='#22C55E' />
                    <path
                      d='M6 10.5l2.5 2.5L14 8'
                      stroke='#fff'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span>Success! Account created.</span>
                </>
              ) : (
                <>
                  <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                    <circle cx='10' cy='10' r='10' fill='#EF4444' />
                    <path
                      d='M7 7l6 6M13 7l-6 6'
                      stroke='#fff'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span>{Object.values(errors).find(Boolean)}</span>
                </>
              )}
            </div>
          )}
          <Button
            type='submit'
            className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg md:col-span-2'
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up for free'}
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-blue-600 font-medium hover:underline'
          >
            Return to Sign In
          </Link>
        </div>
      </div>
      {/* Footer */}
      <footer className='w-full max-w-md mx-auto mt-8 flex flex-col items-center text-xs text-gray-500 gap-2'>
        <div className='flex gap-4'>
          <Link href='/privacy' className='hover:underline'>
            Privacy & Terms
          </Link>
          <Link href='/contact' className='hover:underline'>
            Contact Us
          </Link>
          <span>English</span>
        </div>
        <div className='text-gray-400'>
          &copy; {new Date().getFullYear()} Talent Hub
        </div>
      </footer>
    </div>
  );
}
