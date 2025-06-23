import React, { useState, useEffect } from 'react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import {
  alertConfigurationService,
  AddAlertConfigurationRequest,
} from '@/services/alertConfigurationService';

interface AlertConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function AlertConfigurationModal({
  open,
  onClose,
  onSuccess,
  onError,
}: AlertConfigurationModalProps) {
  const [formData, setFormData] = useState<AddAlertConfigurationRequest>({
    id: '',
    salary: '',
    jobTitle: '',
    Position: '',
    address: '',
    tenantsId: [],
    industry: '',
  });
  const [salaryRange, setSalaryRange] = useState({
    min: '',
    max: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        id: '',
        salary: '',
        jobTitle: '',
        Position: '',
        address: '',
        tenantsId: [],
        industry: '',
      });
      setSalaryRange({
        min: '',
        max: '',
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.Position.trim()) {
      newErrors.Position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof AddAlertConfigurationRequest,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSalaryChange = (field: 'min' | 'max', value: string) => {
    setSalaryRange((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[`salary${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors((prev) => ({
        ...prev,
        [`salary${field.charAt(0).toUpperCase() + field.slice(1)}`]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Get user data from localStorage for the id
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }

      const userData = JSON.parse(storedUser);
      const requestData = {
        ...formData,
        id: userData.id,
        salary: `${salaryRange.min}-${salaryRange.max}`,
        tenantsId:
          formData.tenantsId.length > 0
            ? formData.tenantsId
            : [userData.tenantId || ''],
      };

      await alertConfigurationService.addAlertConfiguration(requestData);

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error adding alert configuration:', error);
      onError?.(error.message || 'Failed to add alert configuration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3'>
            <BellIcon className='w-6 h-6 text-blue-600' />
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Add Job Alert
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            disabled={isLoading}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Job Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Job Title *
            </label>
            <input
              type='text'
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder='e.g., Software Engineer, Marketing Manager'
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.jobTitle
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            />
            {errors.jobTitle && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Position *
            </label>
            <input
              type='text'
              value={formData.Position}
              onChange={(e) => handleInputChange('Position', e.target.value)}
              placeholder='e.g., Senior, Junior, Lead'
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.Position
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            />
            {errors.Position && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.Position}
              </p>
            )}
          </div>

          {/* Salary Range */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Minimum Salary
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-2 text-gray-400 dark:text-gray-500'>
                  $
                </span>
                <input
                  type='number'
                  value={salaryRange.min}
                  onChange={(e) => handleSalaryChange('min', e.target.value)}
                  placeholder='50000'
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.salaryMin
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.salaryMin && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.salaryMin}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Maximum Salary
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-2 text-gray-400 dark:text-gray-500'>
                  $
                </span>
                <input
                  type='number'
                  value={salaryRange.max}
                  onChange={(e) => handleSalaryChange('max', e.target.value)}
                  placeholder='80000'
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.salaryMax
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.salaryMax && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.salaryMax}
                </p>
              )}
            </div>
          </div>

          {/* Address/Location */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Location
            </label>
            <input
              type='text'
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder='e.g., New York, NY or Remote'
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.address
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            />
            {errors.address && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.address}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.industry
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            >
              <option value=''>Select Industry</option>
              <option value='InformationTechnology'>
                Information Technology
              </option>
              <option value='Healthcare'>Healthcare</option>
              <option value='Finance'>Finance</option>
              <option value='Education'>Education</option>
              <option value='Manufacturing'>Manufacturing</option>
              <option value='Retail'>Retail</option>
              <option value='Marketing'>Marketing</option>
              <option value='Sales'>Sales</option>
              <option value='Consulting'>Consulting</option>
              <option value='Other'>Other</option>
            </select>
            {errors.industry && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.industry}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                  Adding...
                </>
              ) : (
                'Add Alert'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
