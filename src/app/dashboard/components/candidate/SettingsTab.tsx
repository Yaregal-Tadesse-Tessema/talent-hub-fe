import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import JobAlertsTab from './JobAlertsTab';
import { profileService } from '@/services/profileService';
import { userService } from '@/services/userService';
import { useToast } from '@/contexts/ToastContext';

const TABS = [
  { key: 'jobAlerts', label: 'Job Alerts' },
  { key: 'security', label: 'Security' },
];

const initialProfile = {
  phone: '',
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  status: 'Active',
  password: '',
  address: {},
  birthDate: '',
  linkedinUrl: '',
  portfolioUrl: '',
  yearOfExperience: 0,
  industry: [],
  telegramUserId: '',
  preferredJobLocation: [],
  highestLevelOfEducation: '',
  salaryExpectations: 0,
  aiGeneratedJobFitScore: 0,
  technicalSkills: [],
  softSkills: [],
  profile: { path: '' },
  resume: {},
  educations: {},
  experiences: {},
  socialMediaLinks: {},
  profileHeadLine: '',
  coverLetter: '',
  professionalSummery: '',
  phoneCountryCode: '+251',
  isProfilePublic: true,
  isResumePublic: true,
  alertConfiguration: {
    id: '',
    salary: '',
    jobTitle: '',
    Position: '',
    address: '',
    tenantsId: [],
    industry: '',
  },
};

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState('jobAlerts');
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [account, setAccount] = useState({
    mapLocation: '',
    phoneCountry: '+880',
    phone: '',
    email: '',
    notifications: {
      shortlisted: true,
      saved: false,
      appliedExpire: false,
      jobAlerts: true,
      rejected: true,
    },
    jobAlertRole: '',
    jobAlertLocation: '',
    isProfilePublic: true,
    isResumePublic: true,
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const { showToast } = useToast();

  // Load current privacy settings from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAccount((prev) => ({
          ...prev,
          isProfilePublic: userData.isProfilePublic ?? true,
          isResumePublic: userData.isResumePublic ?? true,
        }));

        // Load the full user profile data
        setUserProfile(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  function handleAccountChange(field: string, value: any) {
    setAccount((prev) => ({ ...prev, [field]: value }));
  }
  function handleNotificationChange(field: string, value: boolean) {
    setAccount((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  }
  function handlePrivacyToggle(field: 'isProfilePublic' | 'isResumePublic') {
    setAccount((prev) => ({ ...prev, [field]: !prev[field] }));
  }
  function handlePasswordVisibility(
    field: 'password' | 'newPassword' | 'confirmPassword',
  ) {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }
  async function handleAccountSave() {
    try {
      // Get current user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        showToast({ type: 'error', message: 'User not found' });
        return;
      }

      const userData = JSON.parse(storedUser);

      // Update privacy settings - exclude role field as it's only for FE
      const { role, ...userDataWithoutRole } = userData;
      const updatedProfile = {
        ...userDataWithoutRole,
        isProfilePublic: account.isProfilePublic,
        isResumePublic: account.isResumePublic,
      };

      // Save to backend
      const result = await profileService.updateProfile(updatedProfile);

      // Update localStorage - preserve the role for FE
      localStorage.setItem(
        'user',
        JSON.stringify({ ...result, role: 'employee' }),
      );

      showToast({
        type: 'success',
        message: 'Privacy settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update privacy settings',
      });
    }
  }
  function handleJobAlertSave() {
    return;
  }
  async function handlePasswordSave() {
    try {
      // Validate password fields
      if (!account.newPassword || !account.confirmPassword) {
        showToast({
          type: 'error',
          message: 'Please fill in all password fields',
        });
        return;
      }

      if (account.newPassword !== account.confirmPassword) {
        showToast({
          type: 'error',
          message: 'New password and confirm password do not match',
        });
        return;
      }

      if (account.newPassword.length < 6) {
        showToast({
          type: 'error',
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      // Get user email from localStorage or URL params
      let userEmail = '';

      // First try to get from localStorage (logged in user)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userEmail = userData.email;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // If not found in localStorage, try to get from URL params
      if (!userEmail && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        userEmail = urlParams.get('email') || '';
      }

      if (!userEmail) {
        showToast({
          type: 'error',
          message: 'Email address not found. Please log in again.',
        });
        return;
      }

      // Call the API to change password
      await userService.changePasswordByEmail({
        email: userEmail,
        newPassword: account.newPassword,
        confirmNewPassword: account.confirmPassword,
      });

      // Clear password fields on success
      setAccount((prev) => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: '',
      }));

      showToast({
        type: 'success',
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      showToast({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to change password. Please try again.',
      });
    }
  }
  function handleDeleteAccount() {
    return;
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'jobAlerts':
        return (
          <JobAlertsTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
      case 'security':
        return (
          <div className='mt-4 sm:mt-8 flex flex-col gap-6 sm:gap-10'>
            {/* Map Location, Phone, Email */}
            <div>
              <div className='mb-4'>
                <Input
                  placeholder='Map Location'
                  value={account.mapLocation}
                  onChange={(e) =>
                    handleAccountChange('mapLocation', e.target.value)
                  }
                />
              </div>
              <div className='mb-4 flex flex-col sm:flex-row gap-2'>
                <Select
                  value={account.phoneCountry}
                  onChange={(e) =>
                    handleAccountChange('phoneCountry', e.target.value)
                  }
                  className='w-full sm:w-24'
                >
                  <option value='+251'>🇪🇹 +251</option>
                </Select>
                <Input
                  placeholder='Phone number..'
                  value={account.phone}
                  onChange={(e) => handleAccountChange('phone', e.target.value)}
                />
              </div>
              <div className='mb-4'>
                <div className='flex items-center gap-2'>
                  <Input
                    type='email'
                    placeholder='Email address'
                    value={account.email}
                    onChange={(e) =>
                      handleAccountChange('email', e.target.value)
                    }
                  />
                </div>
              </div>
              <Button onClick={handleAccountSave}>Save Changes</Button>
            </div>

            {/* Notification Preferences */}
            <div className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <div className='font-medium mb-4 text-gray-900 dark:text-white text-base sm:text-lg'>
                Notification
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4'>
                <label className='flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white'>
                  <input
                    type='checkbox'
                    checked={account.notifications.shortlisted}
                    onChange={(e) =>
                      handleNotificationChange('shortlisted', e.target.checked)
                    }
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                  />
                  Notify me when employers shortlisted me
                </label>
                <label className='flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white'>
                  <input
                    type='checkbox'
                    checked={account.notifications.saved}
                    onChange={(e) =>
                      handleNotificationChange('saved', e.target.checked)
                    }
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                  />
                  Notify me when employers saved my profile
                </label>
                <label className='flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white'>
                  <input
                    type='checkbox'
                    checked={account.notifications.appliedExpire}
                    onChange={(e) =>
                      handleNotificationChange(
                        'appliedExpire',
                        e.target.checked,
                      )
                    }
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                  />
                  Notify me when my applied jobs are expire
                </label>
                <label className='flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white'>
                  <input
                    type='checkbox'
                    checked={account.notifications.rejected}
                    onChange={(e) =>
                      handleNotificationChange('rejected', e.target.checked)
                    }
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                  />
                  Notify me when employers rejected me
                </label>
                <label className='flex items-center gap-2 col-span-1 sm:col-span-2 text-sm sm:text-base text-gray-900 dark:text-white'>
                  <input
                    type='checkbox'
                    checked={account.notifications.jobAlerts}
                    onChange={(e) =>
                      handleNotificationChange('jobAlerts', e.target.checked)
                    }
                    className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                  />
                  Notify me when i have up to 5 job alerts
                </label>
              </div>
              <Button onClick={handleAccountSave}>Save Changes</Button>
            </div>

            {/* Profile & Resume Privacy */}
            <div className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <div className='font-medium mb-4 text-gray-900 dark:text-white text-base sm:text-lg'>
                Privacy Settings
              </div>
              <div className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
                Control who can see your profile and resume information
              </div>
              <div className='flex flex-col sm:flex-row gap-6 sm:gap-8'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                  <span className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                    Profile Visibility
                  </span>
                  <button
                    type='button'
                    onClick={() => handlePrivacyToggle('isProfilePublic')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${account.isProfilePublic ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow transform transition-transform ${account.isProfilePublic ? 'translate-x-6' : ''}`}
                    ></span>
                  </button>
                  <span className='text-xs sm:text-sm text-gray-900 dark:text-white'>
                    {account.isProfilePublic ? 'YES' : 'NO'}{' '}
                    <span className='text-gray-400 dark:text-gray-500'>
                      {account.isProfilePublic
                        ? 'Your profile is public now'
                        : 'Your profile is private now'}
                    </span>
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                  <span className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                    Resume Visibility
                  </span>
                  <button
                    type='button'
                    onClick={() => handlePrivacyToggle('isResumePublic')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${account.isResumePublic ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow transform transition-transform ${account.isResumePublic ? 'translate-x-6' : ''}`}
                    ></span>
                  </button>
                  <span className='text-xs sm:text-sm text-gray-900 dark:text-white'>
                    {account.isResumePublic ? 'YES' : 'NO'}{' '}
                    <span className='text-gray-400 dark:text-gray-500'>
                      {account.isResumePublic
                        ? 'Your resume is public now'
                        : 'Your resume is private now'}
                    </span>
                  </span>
                </div>
              </div>
              <Button onClick={handleAccountSave} className='mt-4'>
                Save Privacy Settings
              </Button>
            </div>

            {/* Change Password */}
            <div className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <div className='font-medium mb-4 text-gray-900 dark:text-white text-base sm:text-lg'>
                Change Password
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
                <div className='relative'>
                  <Input
                    type={showPassword.password ? 'text' : 'password'}
                    placeholder='Password'
                    value={account.password}
                    onChange={(e) =>
                      handleAccountChange('password', e.target.value)
                    }
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    onClick={() => handlePasswordVisibility('password')}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
                      <path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  </button>
                </div>
                <div className='relative'>
                  <Input
                    type={showPassword.newPassword ? 'text' : 'password'}
                    placeholder='New Password'
                    value={account.newPassword}
                    onChange={(e) =>
                      handleAccountChange('newPassword', e.target.value)
                    }
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    onClick={() => handlePasswordVisibility('newPassword')}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
                      <path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  </button>
                </div>
                <div className='relative sm:col-span-2 lg:col-span-1'>
                  <Input
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    value={account.confirmPassword}
                    onChange={(e) =>
                      handleAccountChange('confirmPassword', e.target.value)
                    }
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    onClick={() => handlePasswordVisibility('confirmPassword')}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
                      <path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  </button>
                </div>
              </div>
              <Button onClick={handlePasswordSave}>Save Changes</Button>
            </div>

            {/* Delete Account */}
            <div className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <div className='font-medium mb-2 text-red-600 dark:text-red-400 flex items-center gap-2 text-base sm:text-lg'>
                <svg
                  width='18'
                  height='18'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <circle cx='12' cy='12' r='10' strokeWidth='2' />
                  <path
                    d='M15 9l-6 6M9 9l6 6'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                Close Account
              </div>
              <div className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
                If you delete your account, you will no longer be able to get
                information about the matched jobs, following employers, and job
                alert, shortlisted jobs and more. You will be abandoned from all
                the services.
              </div>
              <Button
                onClick={handleDeleteAccount}
                className='bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-700'
              >
                Close Account
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className='flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header */}
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-gray-900 dark:text-white'>
          Settings
        </h1>
        <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Horizontal Tabs */}
      <div className='flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto'>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-1 sm:px-2 font-medium transition-colors border-b-2 -mb-px text-sm sm:text-base whitespace-nowrap ${activeTab === tab.key ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='w-full'>{renderTabContent()}</div>
    </div>
  );
}
