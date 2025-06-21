'use client';
import React, { useState } from 'react';
import {
  FiUser,
  FiBell,
  FiShield,
  FiKey,
  FiMail,
  FiGlobe,
  FiMoon,
  FiSun,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import ProfileTab from './ProfileTab';
import { useTheme } from '@/contexts/ThemeContext';

type SettingsSection =
  | 'profile'
  | 'account'
  | 'notifications'
  | 'security'
  | 'appearance';

const SETTINGS_SECTIONS = [
  { key: 'profile', label: 'Company Profile', icon: FiUser },
  { key: 'account', label: 'Account Settings', icon: FiUser },
  { key: 'notifications', label: 'Notifications', icon: FiBell },
  { key: 'security', label: 'Security', icon: FiShield },
  { key: 'appearance', label: 'Appearance', icon: FiMoon },
] as const;

export default function SettingsTab() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profile');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileTab />;
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className='w-full max-w-6xl'>
      <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-1'>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Horizontal Tabs */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex overflow-x-auto'>
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() =>
                    setActiveSection(section.key as SettingsSection)
                  }
                  className={`px-6 py-4 font-medium flex items-center gap-2 whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeSection === section.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className='p-6'>{renderSectionContent()}</div>
      </div>
    </div>
  );
}

// Account Settings Component
function AccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    language: 'English',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Account Information
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            First Name
          </label>
          <input
            type='text'
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Last Name
          </label>
          <input
            type='text'
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Email
          </label>
          <input
            type='email'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Phone
          </label>
          <input
            type='tel'
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) =>
              setFormData({ ...formData, timezone: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          >
            <option value='UTC-5'>Eastern Time (UTC-5)</option>
            <option value='UTC-6'>Central Time (UTC-6)</option>
            <option value='UTC-7'>Mountain Time (UTC-7)</option>
            <option value='UTC-8'>Pacific Time (UTC-8)</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            disabled={!isEditing}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-700 dark:text-white'
          >
            <option value='English'>English</option>
            <option value='Spanish'>Spanish</option>
            <option value='French'>French</option>
            <option value='German'>German</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className='flex gap-3'>
          <button
            onClick={handleSave}
            className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2'
          >
            <FiCheck className='w-4 h-4' />
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className='px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2'
          >
            <FiX className='w-4 h-4' />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    jobApplications: true,
    newMessages: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
        Notification Preferences
      </h2>

      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Email Notifications
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Receive notifications via email
            </p>
          </div>
          <button
            onClick={() => handleToggle('emailNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.emailNotifications
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.emailNotifications
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Push Notifications
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Receive push notifications in browser
            </p>
          </div>
          <button
            onClick={() => handleToggle('pushNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.pushNotifications
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.pushNotifications
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Job Applications
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Notify when new applications are received
            </p>
          </div>
          <button
            onClick={() => handleToggle('jobApplications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.jobApplications
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.jobApplications
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              New Messages
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Notify when you receive new messages
            </p>
          </div>
          <button
            onClick={() => handleToggle('newMessages')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.newMessages
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.newMessages ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              System Updates
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Receive system and maintenance updates
            </p>
          </div>
          <button
            onClick={() => handleToggle('systemUpdates')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.systemUpdates
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Marketing Emails
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Receive promotional and marketing emails
            </p>
          </div>
          <button
            onClick={() => handleToggle('marketingEmails')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.marketingEmails
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.marketingEmails
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log('Password change requested');
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
        Security Settings
      </h2>

      {/* Change Password */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Change Password
        </h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Current Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showPassword ? (
                  <FiEyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <FiEye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                placeholder='Enter new password'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showNewPassword ? (
                  <FiEyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <FiEye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Confirm New Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                placeholder='Confirm new password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showConfirmPassword ? (
                  <FiEyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <FiEye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Two-Factor Authentication
        </h3>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Add an extra layer of security to your account
        </p>
        <button className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
          Enable 2FA
        </button>
      </div>

      {/* Login Sessions */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Active Sessions
        </h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600'>
            <div>
              <p className='font-medium dark:text-white'>Chrome on Windows</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Last active: 2 hours ago
              </p>
            </div>
            <button className='text-red-600 hover:text-red-700 text-sm font-medium'>
              Revoke
            </button>
          </div>
          <div className='flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600'>
            <div>
              <p className='font-medium dark:text-white'>Safari on iPhone</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Last active: 1 day ago
              </p>
            </div>
            <button className='text-red-600 hover:text-red-700 text-sm font-medium'>
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
        Appearance Settings
      </h2>

      {/* Theme Selection */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Theme
        </h3>
        <div className='grid grid-cols-3 gap-4'>
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <FiSun className='w-8 h-8 mx-auto mb-2 text-yellow-500' />
            <p className='font-medium dark:text-white'>Light</p>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <FiMoon className='w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-300' />
            <p className='font-medium dark:text-white'>Dark</p>
          </button>
          <button
            onClick={() => setTheme('auto')}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'auto'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <FiGlobe className='w-8 h-8 mx-auto mb-2 text-blue-500' />
            <p className='font-medium dark:text-white'>Auto</p>
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Font Size
        </h3>
        <div className='space-y-3'>
          {['small', 'medium', 'large'].map((size) => (
            <label key={size} className='flex items-center'>
              <input
                type='radio'
                name='fontSize'
                value={size}
                checked={fontSize === size}
                onChange={(e) => setFontSize(e.target.value)}
                className='mr-3'
              />
              <span className='capitalize dark:text-white'>{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Compact Mode */}
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Compact Mode
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              Reduce spacing for a more compact layout
            </p>
          </div>
          <button
            onClick={() => setCompactMode(!compactMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              compactMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                compactMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
