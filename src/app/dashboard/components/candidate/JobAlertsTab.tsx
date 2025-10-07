import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { profileService } from '@/services/profileService';
import { useToast } from '@/contexts/ToastContext';
import { jobPositions, locations, industries } from '@/constants/jobOptions';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

interface AlertConfiguration {
  id?: string;
  salary: string;
  jobTitle: string;
  Position: string;
  address: string;
  tenantsId: string;
  industry: string;
}

interface JobAlertsTabProps {
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
}

export default function JobAlertsTab({
  userProfile,
  setUserProfile,
}: JobAlertsTabProps) {
  const [alertConfigurations, setAlertConfigurations] = useState<
    AlertConfiguration[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertConfiguration | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AlertConfiguration>({
    salary: '',
    jobTitle: '',
    Position: '',
    address: '',
    tenantsId: '',
    industry: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customPosition, setCustomPosition] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<AlertConfiguration | null>(
    null,
  );
  const { showToast } = useToast();

  // Initialize alert configurations from user profile
  useEffect(() => {
    console.log('userProfile', userProfile);
    if (userProfile?.alertConfiguration) {
      const configs = Array.isArray(userProfile.alertConfiguration)
        ? userProfile.alertConfiguration
        : [userProfile.alertConfiguration];
      setAlertConfigurations(
        configs.filter(
          (config: any) => config && Object.keys(config).length > 0,
        ),
      );
    }
  }, [userProfile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.Position.trim()) {
      newErrors.Position = 'Position is required';
    }

    // If "Other" is selected, validate custom position input
    if (formData.Position === 'other' && !customPosition.trim()) {
      newErrors.Position = 'Please specify the position';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof AlertConfiguration,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Location autocomplete functions
  const handleLocationInputChange = (value: string) => {
    handleInputChange('address', value);

    if (value.length > 0) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase()),
      );
      setLocationSuggestions(filtered.slice(0, 8)); // Show max 8 suggestions
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    handleInputChange('address', location);
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  const handleLocationBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowLocationSuggestions(false);
    }, 200);
  };

  const resetForm = () => {
    setFormData({
      salary: '',
      jobTitle: '',
      Position: '',
      address: '',
      tenantsId: '',
      industry: '',
    });
    setCustomPosition('');
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setErrors({});
    setEditingAlert(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (alert: AlertConfiguration) => {
    setFormData(alert);
    // Check if the position is a custom one (not in the predefined list)
    const isCustomPosition = !jobPositions.some(
      (pos) => pos.value === alert.Position,
    );
    if (isCustomPosition && alert.Position !== 'other') {
      setCustomPosition(alert.Position);
      setFormData((prev) => ({ ...prev, Position: 'other' }));
    } else {
      setCustomPosition('');
    }
    setEditingAlert(alert);
    setShowModal(true);
  };

  const handleDelete = (alert: AlertConfiguration) => {
    setAlertToDelete(alert);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!alertToDelete) return;

    setLoading(true);
    try {
      // Set tenantsId to userProfile.id
      const alertConfigForAPI = {
        ...alertToDelete,
        tenantsId: userProfile.id,
      };

      await profileService.removeAlertConfiguration(alertConfigForAPI);

      const updatedConfigs = alertConfigurations.filter(
        (config) => config !== alertToDelete,
      );

      const updatedUserProfile = {
        ...userProfile,
        alertConfiguration: updatedConfigs,
      };

      setUserProfile(updatedUserProfile);
      setAlertConfigurations(updatedConfigs);

      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem(
          'user',
          JSON.stringify({ ...userData, ...updatedUserProfile }),
        );
      }

      showToast({ type: 'success', message: 'Job alert deleted successfully' });
    } catch (error) {
      console.error('Error deleting job alert:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to delete job alert',
      });
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setAlertToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setAlertToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('formData', formData);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Use custom position if "Other" is selected
      const finalFormData = {
        ...formData,
        Position:
          formData.Position === 'other' ? customPosition : formData.Position,
      };

      // Set tenantsId to userProfile.id
      const alertConfigForAPI = {
        ...finalFormData,
        tenantsId: userProfile.id,
      };

      await profileService.addAlertConfiguration(alertConfigForAPI);

      let updatedConfigs: AlertConfiguration[];

      if (editingAlert) {
        // Update existing alert
        updatedConfigs = alertConfigurations.map((config) =>
          config === editingAlert
            ? { ...finalFormData, id: config.id }
            : config,
        );
      } else {
        // Add new alert
        const newAlert = { ...finalFormData, id: Date.now().toString() };
        updatedConfigs = [...alertConfigurations, newAlert];
      }

      const updatedUserProfile = {
        ...userProfile,
        alertConfiguration: updatedConfigs,
      };
      console.log('updatedUserProfile', updatedUserProfile);

      setUserProfile(updatedUserProfile);
      setAlertConfigurations(updatedConfigs);

      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem(
          'user',
          JSON.stringify({ ...userData, ...updatedUserProfile }),
        );
      }

      showToast({
        type: 'success',
        message: editingAlert
          ? 'Job alert updated successfully'
          : 'Job alert added successfully',
      });

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving job alert:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to save job alert',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className=' px-4'>
      {/* Header - Improved responsive layout */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div></div>
        <Button
          onClick={handleAddNew}
          disabled={loading}
          className='w-full sm:w-auto'
        >
          Add New Alert
        </Button>
      </div>

      {/* Table - Improved responsive design */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {alertConfigurations.length === 0 ? (
          <div className='p-4 sm:p-8 text-center'>
            <div className='text-gray-400 dark:text-gray-500 mb-4'>
              <svg
                className='w-8 h-8 sm:w-12 sm:h-12 mx-auto'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 17h5l-5 5v-5z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No job alerts yet
            </h3>
            <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4'>
              Create your first job alert to get notified about relevant
              opportunities
            </p>
            <Button onClick={handleAddNew} className='w-full sm:w-auto'>
              Create First Alert
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className='hidden lg:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-700'>
                  <tr>
                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Job Title
                    </th>
                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Position
                    </th>
                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Location
                    </th>
                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Industry
                    </th>
                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Salary
                    </th>
                    <th className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {alertConfigurations.map((alert, index) => (
                    <tr
                      key={alert.id || index}
                      className='hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {alert.jobTitle}
                      </td>
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                        {alert.Position}
                      </td>
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                        {alert.address}
                      </td>
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                        {alert.industry}
                      </td>
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                        {alert.salary || 'Not specified'}
                      </td>
                      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(alert)}
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors p-1'
                            disabled={loading}
                          >
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(alert)}
                            className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-1'
                            disabled={loading}
                          >
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card Layout */}
            <div className='lg:hidden'>
              <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                {alertConfigurations.map((alert, index) => (
                  <div
                    key={alert.id || index}
                    className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {alert.jobTitle}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-300'>
                          {alert.Position}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 ml-4'>
                        <button
                          onClick={() => handleEdit(alert)}
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors p-2'
                          disabled={loading}
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(alert)}
                          className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-2'
                          disabled={loading}
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-gray-500 dark:text-gray-400'>
                          Location:
                        </span>
                        <span className='ml-2 text-gray-900 dark:text-white'>
                          {alert.address}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-500 dark:text-gray-400'>
                          Industry:
                        </span>
                        <span className='ml-2 text-gray-900 dark:text-white'>
                          {alert.industry}
                        </span>
                      </div>
                      <div className='sm:col-span-2'>
                        <span className='text-gray-500 dark:text-gray-400'>
                          Salary:
                        </span>
                        <span className='ml-2 text-gray-900 dark:text-white'>
                          {alert.salary || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal - Improved responsive design */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <svg
                  className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 17h5l-5 5v-5z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
                <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'>
                  {editingAlert ? 'Edit Job Alert' : 'Add Job Alert'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1'
                disabled={loading}
              >
                <svg
                  className='w-5 h-5 sm:w-6 sm:h-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='p-4 sm:p-6 space-y-4'>
              {/* Job Title */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Job Title *
                </label>
                <Input
                  type='text'
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange('jobTitle', e.target.value)
                  }
                  placeholder='e.g., Software Engineer, Marketing Manager'
                  className={errors.jobTitle ? 'border-red-500' : ''}
                  disabled={loading}
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
                <Select
                  value={formData.Position}
                  onChange={(e) => {
                    handleInputChange('Position', e.target.value);
                    // Clear custom position when selecting a predefined option
                    if (e.target.value !== 'other') {
                      setCustomPosition('');
                    }
                  }}
                  className={errors.Position ? 'border-red-500' : ''}
                  disabled={loading}
                >
                  <option value=''>Select position</option>
                  {jobPositions.map((position) => (
                    <option key={position.value} value={position.value}>
                      {position.name}
                    </option>
                  ))}
                </Select>

                {/* Custom Position Input - Show when "Other" is selected */}
                {formData.Position === 'other' && (
                  <div className='mt-2'>
                    <Input
                      type='text'
                      value={customPosition}
                      onChange={(e) => setCustomPosition(e.target.value)}
                      placeholder='Please specify the position'
                      className={errors.Position ? 'border-red-500' : ''}
                      disabled={loading}
                    />
                  </div>
                )}

                {errors.Position && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.Position}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Location *
                </label>
                <Input
                  type='text'
                  value={formData.address}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onBlur={handleLocationBlur}
                  onFocus={() => {
                    if (formData.address.length > 0) {
                      setShowLocationSuggestions(true);
                    }
                  }}
                  placeholder='Type to search cities in Ethiopia...'
                  className={errors.address ? 'border-red-500' : ''}
                  disabled={loading}
                />

                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto'>
                    {locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        type='button'
                        className='w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none'
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}

                {errors.address && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Industry *
                </label>
                <Select
                  value={formData.industry}
                  onChange={(e) =>
                    handleInputChange('industry', e.target.value)
                  }
                  className={errors.industry ? 'border-red-500' : ''}
                  disabled={loading}
                >
                  <option value=''>Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.name}
                    </option>
                  ))}
                </Select>
                {errors.industry && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.industry}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Salary Range
                </label>
                <Input
                  type='text'
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder='e.g., $50,000 - $80,000'
                  disabled={loading}
                />
              </div>

              {/* Actions */}
              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <Button
                  type='button'
                  onClick={handleCloseModal}
                  variant='outline'
                  className='flex-1'
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type='submit' className='flex-1' disabled={loading}>
                  {loading
                    ? 'Saving...'
                    : editingAlert
                      ? 'Update Alert'
                      : 'Add Alert'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirmation}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title='Delete Job Alert'
        message={`Are you sure you want to delete the job alert for "${alertToDelete?.jobTitle}"? This action cannot be undone.`}
        confirmText='Delete Alert'
        cancelText='Cancel'
        variant='danger'
        isLoading={loading}
      />
    </div>
  );
}
