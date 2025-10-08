'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  password: string;
  address: Record<string, any>;
  birthDate: string;
}

interface EmployerFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [userType, setUserType] = useState<UserType>(() => {
    const typeParam = searchParams?.get('type');
    return typeParam === 'employer' ? 'employer' : 'employee';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [employeeCountryCode, setEmployeeCountryCode] = useState('+251');
  const [employerCountryCode, setEmployerCountryCode] = useState('+251');

  const [employeeData, setEmployeeData] = useState<EmployeeFormData>({
    phone: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    password: '',
    address: {},
    birthDate: '',
  });

  const [employerData, setEmployerData] = useState<EmployerFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    email: '',
    phoneNumber: '',
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

  const validatePhone = (phone: string, countryCode: string): boolean => {
    // Remove country code from phone number for validation
    const phoneWithoutCode = phone.replace(countryCode, '').trim();

    // Ethiopian phone number validation
    // Format 1: 09xxxxxxxxx (10 digits starting with 0)
    // Format 2: 9xxxxxxxxx (9 digits starting with 9)
    // Format 3: +251 9xxxxxxxx (international format)

    // Remove all spaces and non-digit characters except + at the beginning
    const cleanPhone = phoneWithoutCode.replace(/[\s-]/g, '');

    // Check if it's a valid Ethiopian mobile number
    // Ethiopian mobile numbers: 09xxxxxxxxx or 9xxxxxxxxx (9 digits after 0 or 9)
    const ethiopianMobileRegex = /^(0?9\d{8})$/;

    return ethiopianMobileRegex.test(cleanPhone);
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

    // Last name validation (optional)
    if (employeeData.lastName && !validateName(employeeData.lastName)) {
      newErrors.lastName =
        'Last name should only contain letters, 2-50 characters';
    }

    // Phone validation (if provided)
    if (
      employeeData.phone &&
      !validatePhone(employeeData.phone, employeeCountryCode)
    ) {
      newErrors.phone =
        'Please enter a valid Ethiopian phone number (e.g., 09xxxxxxxxx or 9xxxxxxxxx)';
    }

    // Gender validation
    if (!employeeData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Birth date validation (optional)
    if (employeeData.birthDate && !validateBirthDate(employeeData.birthDate)) {
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

  const handleEmployeePhoneBlur = () => {
    if (
      employeeData.phone &&
      !validatePhone(employeeData.phone, employeeCountryCode)
    ) {
      setErrors((prev) => ({
        ...prev,
        phone:
          'Please enter a valid Ethiopian phone number (e.g., 09xxxxxxxxx or 9xxxxxxxxx)',
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
      // Create payload without empty birthDate to avoid database errors
      const payload: any = { ...employeeData };
      if (!payload.birthDate || payload.birthDate.trim() === '') {
        delete payload.birthDate;
      }

      const response = await api.post('/users', payload);

      if (response.data) {
        showToast({
          type: 'success',
          message: 'Account created successfully! Please log in.',
        });
        router.push('/signup/success');
      }
    } catch (error: any) {
      // Handle existing user scenarios
      if (error.response?.data?.status === 'ACTIVE') {
        showToast({
          type: 'error',
          message: 'User already exists. Please click on "Return to Sign In".',
        });
        router.push('/login');
        return;
      } else if (error.response?.data?.status === 'PENDING') {
        showToast({
          type: 'success',
          message: 'Activation email has been resent. Please check your email.',
        });
        router.push('/signup/success');
        return;
      }

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

  const validateEmployerForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!employerData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(employerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!employerData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(employerData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (employerData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!employerData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(employerData.firstName)) {
      newErrors.firstName =
        'First name should only contain letters, 2-50 characters';
    }
    if (employerData.lastName && !validateName(employerData.lastName)) {
      newErrors.lastName =
        'Last name should only contain letters, 2-50 characters';
    }
    if (
      employerData.phoneNumber &&
      !validatePhone(employerData.phoneNumber, employerCountryCode)
    ) {
      newErrors.phone =
        'Please enter a valid Ethiopian phone number (e.g., 09xxxxxxxxx or 9xxxxxxxxx)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmployerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setEmployerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleEmployerPhoneBlur = () => {
    if (
      employerData.phoneNumber &&
      !validatePhone(employerData.phoneNumber, employerCountryCode)
    ) {
      setErrors((prev) => ({
        ...prev,
        phone:
          'Please enter a valid Ethiopian phone number (e.g., 09xxxxxxxxx or 9xxxxxxxxx)',
      }));
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('employerData', employerData);
    if (!validateEmployerForm()) {
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
      const response = await api.post('/lookups/', employerData);
      if (response.data) {
        showToast({
          type: 'success',
          message: 'Employer account created successfully! Please log in.',
        });
        router.push('/signup/success');
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to create employer account. Please try again.',
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
          <Link href='/'>
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
          </Link>
        </div>
        <h2 className='text-2xl font-bold mb-2 text-center'>
          Create a completely free account
        </h2>
        <div className='mb-4 flex justify-center gap-2'>
          <button
            type='button'
            className={`px-4 py-2 rounded-l-lg border ${userType === 'employee' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setUserType('employee');
              setErrors({});
              setShowSuccess(false);
            }}
          >
            Employee
          </button>
          <button
            type='button'
            className={`px-4 py-2 rounded-r-lg border ${userType === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setUserType('employer');
              setErrors({});
              setShowSuccess(false);
            }}
          >
            Employer
          </button>
        </div>
        {userType === 'employee' ? (
          <form
            onSubmit={handleEmployeeSubmit}
            className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'
          >
            <input
              type='text'
              name='firstName'
              placeholder='Enter Your First Name *'
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
              placeholder='Enter Your Last Name (Optional)'
              value={employeeData.lastName}
              onChange={handleEmployeeInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.lastName ? 'border-red-500' : ''}`}
            />
            <input
              type='email'
              name='email'
              placeholder='Enter Your Email *'
              value={employeeData.email}
              onChange={handleEmployeeInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-500' : ''}`}
            />
            <div className='w-full md:col-span-2'>
              <div className='flex w-full'>
                <select
                  value={employeeCountryCode}
                  onChange={(e) => setEmployeeCountryCode(e.target.value)}
                  className='px-3 py-3 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 pr-8'
                >
                  <option value='+251'>🇪🇹 +251</option>
                </select>
                <input
                  type='tel'
                  name='phone'
                  placeholder='09xxxxxxxxx or 9xxxxxxxxx'
                  value={employeeData.phone}
                  onChange={handleEmployeeInputChange}
                  onBlur={handleEmployeePhoneBlur}
                  className={`flex-1 px-4 py-3 border-l-0 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
              )}
            </div>
            <div className='w-full'>
              <select
                name='gender'
                value={employeeData.gender}
                onChange={handleEmployeeInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.gender ? 'border-red-500' : ''}`}
              >
                <option value=''>Select Gender *</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
              {errors.gender && (
                <p className='text-red-500 text-sm mt-1'>{errors.gender}</p>
              )}
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Date of Birth (Optional)
              </label>
              <input
                type='date'
                name='birthDate'
                value={employeeData.birthDate}
                onChange={handleEmployeeInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.birthDate ? 'border-red-500' : ''}`}
              />
            </div>
            <div className='relative w-full'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Enter Your Password *'
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
                placeholder='Confirm Your Password *'
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
        ) : (
          <form
            onSubmit={handleEmployerSubmit}
            className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'
          >
            <input
              type='text'
              name='firstName'
              placeholder='Enter Your First Name *'
              value={employerData.firstName}
              onChange={handleEmployerInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.firstName ? 'border-red-500' : ''}`}
            />
            <input
              type='text'
              name='middleName'
              placeholder='Enter Your Middle Name'
              value={employerData.middleName}
              onChange={handleEmployerInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.middleName ? 'border-red-500' : ''}`}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Enter Your Last Name (Optional)'
              value={employerData.lastName}
              onChange={handleEmployerInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.lastName ? 'border-red-500' : ''}`}
            />
            <input
              type='email'
              name='email'
              placeholder='Enter Your Email *'
              value={employerData.email}
              onChange={handleEmployerInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-500' : ''}`}
            />
            <div className='w-full md:col-span-2'>
              <div className='flex w-full'>
                <select
                  disabled
                  value={employerCountryCode}
                  onChange={(e) => setEmployerCountryCode(e.target.value)}
                  className='px-3 py-3 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 pr-8'
                >
                  <option value='+251'>🇪🇹 +251</option>
                </select>
                <input
                  type='tel'
                  name='phoneNumber'
                  placeholder='09xxxxxxxxx or 9xxxxxxxxx'
                  value={employerData.phoneNumber}
                  onChange={handleEmployerInputChange}
                  onBlur={handleEmployerPhoneBlur}
                  className={`flex-1 px-4 py-3 border-l-0 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
              )}
            </div>
            <div className='relative w-full md:col-span-2'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Enter Your Password *'
                value={employerData.password}
                onChange={handleEmployerInputChange}
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
            <div className='relative w-full md:col-span-2'>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder='Confirm Your Password *'
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
                    <span>Success! Employer account created.</span>
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
              {isLoading ? 'Creating Account...' : 'Sign Up as Employer'}
            </Button>
          </form>
        )}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
