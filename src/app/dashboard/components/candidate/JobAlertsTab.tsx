import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { profileService } from '@/services/profileService';
import { useToast } from '@/contexts/ToastContext';

interface AlertConfiguration {
  id?: string;
  salary: string;
  jobTitle: string;
  Position: string;
  address: string;
  tenantsId: string[];
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
    tenantsId: [],
    industry: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  // Initialize alert configurations from user profile
  useEffect(() => {
    if (userProfile?.alertConfiguration) {
      const configs = Array.isArray(userProfile.alertConfiguration)
        ? userProfile.alertConfiguration
        : [userProfile.alertConfiguration];
      setAlertConfigurations(
        configs.filter((config) => config && Object.keys(config).length > 0),
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

  const resetForm = () => {
    setFormData({
      salary: '',
      jobTitle: '',
      Position: '',
      address: '',
      tenantsId: [],
      industry: '',
    });
    setErrors({});
    setEditingAlert(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (alert: AlertConfiguration) => {
    setFormData(alert);
    setEditingAlert(alert);
    setShowModal(true);
  };

  const handleDelete = async (alertToDelete: AlertConfiguration) => {
    if (!confirm('Are you sure you want to delete this job alert?')) {
      return;
    }

    setLoading(true);
    try {
      const updatedConfigs = alertConfigurations.filter(
        (config) => config !== alertToDelete,
      );

      const updatedUserProfile = {
        ...userProfile,
        alertConfiguration: updatedConfigs,
      };

      await profileService.updateProfile(updatedUserProfile);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('formData', formData);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let updatedConfigs: AlertConfiguration[];

      if (editingAlert) {
        // Update existing alert
        updatedConfigs = alertConfigurations.map((config) =>
          config === editingAlert ? { ...formData, id: config.id } : config,
        );
      } else {
        // Add new alert
        const newAlert = { ...formData, id: Date.now().toString() };
        updatedConfigs = [...alertConfigurations, newAlert];
      }

      const updatedUserProfile = {
        ...userProfile,
        alertConfiguration: updatedConfigs,
      };
      console.log('updatedUserProfile', updatedUserProfile);
      await profileService.updateProfile(updatedUserProfile);

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
    <div className='mt-4 sm:mt-8'>
      <div className='flex items-center justify-between mb-6'>
        <div className='font-medium text-gray-900 dark:text-white text-base sm:text-lg'>
          Job Alerts
        </div>
        <Button onClick={handleAddNew} disabled={loading}>
          Add New Alert
        </Button>
      </div>

      {/* Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {alertConfigurations.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='text-gray-400 dark:text-gray-500 mb-4'>
              <svg
                className='w-12 h-12 mx-auto'
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
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No job alerts yet
            </h3>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              Create your first job alert to get notified about relevant
              opportunities
            </p>
            <Button onClick={handleAddNew}>Create First Alert</Button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Job Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Position
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Industry
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Salary
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
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
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                      {alert.jobTitle}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {alert.Position}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {alert.address}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {alert.industry}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {alert.salary || 'Not specified'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => handleEdit(alert)}
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors'
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
                          className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors'
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-3'>
                <svg
                  className='w-6 h-6 text-blue-600'
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
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {editingAlert ? 'Edit Job Alert' : 'Add Job Alert'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                disabled={loading}
              >
                <svg
                  className='w-6 h-6'
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
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
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
                <Input
                  type='text'
                  value={formData.Position}
                  onChange={(e) =>
                    handleInputChange('Position', e.target.value)
                  }
                  placeholder='e.g., Senior, Junior, Lead'
                  className={errors.Position ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.Position && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.Position}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Location *
                </label>
                <Input
                  type='text'
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder='e.g., New York, NY'
                  className={errors.address ? 'border-red-500' : ''}
                  disabled={loading}
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
                  Industry *
                </label>
                <Input
                  type='text'
                  value={formData.industry}
                  onChange={(e) =>
                    handleInputChange('industry', e.target.value)
                  }
                  placeholder='e.g., Technology, Healthcare, Finance'
                  className={errors.industry ? 'border-red-500' : ''}
                  disabled={loading}
                />
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
              <div className='flex gap-3 pt-4'>
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
    </div>
  );
}
