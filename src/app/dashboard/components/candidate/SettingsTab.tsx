import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import AddResumeModal from '@/components/ui/AddResumeModal';

const TABS = [
  { key: 'personal', label: 'Personal' },
  { key: 'profile', label: 'Profile' },
  { key: 'social', label: 'Social Links' },
  { key: 'account', label: 'Account Setting' },
];

const experienceOptions = [
  'Intern',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Manager',
];
const educationOptions = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
];

const mockResumes = [
  { id: 1, name: 'Professional Resume', size: '3.5 MB' },
  { id: 2, name: 'Product Designer', size: '4.7 MB' },
  { id: 3, name: 'Visual Designer', size: '1.3 MB' },
];

const socialPlatforms = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <svg
        width='18'
        height='18'
        fill='currentColor'
        viewBox='0 0 24 24'
        className='text-blue-600'
      >
        <path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0' />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'Twitter',
    icon: (
      <svg
        width='18'
        height='18'
        fill='currentColor'
        viewBox='0 0 24 24'
        className='text-sky-500'
      >
        <path d='M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.92 2.206-4.92 4.924 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.823 2.28 3.152 4.29 3.188A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z' />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <svg
        width='18'
        height='18'
        fill='currentColor'
        viewBox='0 0 24 24'
        className='text-pink-500'
      >
        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.449.425 20.276.131 19 .072 17.72.013 17.311 0 14.052 0h-4.104z' />
        <circle cx='12' cy='12' r='3.5' />
        <circle cx='18.406' cy='5.594' r='1.44' />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'Youtube',
    icon: (
      <svg
        width='18'
        height='18'
        fill='currentColor'
        viewBox='0 0 24 24'
        className='text-red-600'
      >
        <path d='M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.458 3.5 12 3.5 12 3.5s-7.458 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.114 0 12 0 12s0 3.886.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.542 20.5 12 20.5 12 20.5s7.458 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.886 24 12 24 12s0-3.886-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
      </svg>
    ),
  },
];

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState('personal');
  const [resumes, setResumes] = useState(mockResumes);
  const [resumeMenu, setResumeMenu] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [profile, setProfile] = useState({
    nationality: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    education: '',
    experience: '',
    biography: '',
  });
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'facebook', url: '' },
    { platform: 'twitter', url: '' },
    { platform: 'instagram', url: '' },
    { platform: 'youtube', url: '' },
  ]);
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
    profilePublic: true,
    resumePrivate: false,
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  function handleDeleteResume(id: number) {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setResumeMenu(null);
  }

  function handleAddResume(name: string, file: File) {
    setAddLoading(true);
    // Simulate upload delay
    setTimeout(() => {
      setResumes((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      ]);
      setAddLoading(false);
      setAddModalOpen(false);
    }, 1000);
  }

  function handleProfileSave() {
    // Implementation of handleProfileSave function
  }

  function handleSocialLinkChange(
    idx: number,
    field: 'platform' | 'url',
    value: string,
  ) {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === idx ? { ...link, [field]: value } : link)),
    );
  }

  function handleRemoveSocialLink(idx: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddSocialLink() {
    setSocialLinks((prev) => [...prev, { platform: 'facebook', url: '' }]);
  }

  function handleSocialLinksSave() {
    // Implementation for saving social links
  }

  function handleAccountChange(field: string, value: any) {
    setAccount((prev) => ({ ...prev, [field]: value }));
  }
  function handleNotificationChange(field: string, value: boolean) {
    setAccount((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  }
  function handlePrivacyToggle(field: 'profilePublic' | 'resumePrivate') {
    setAccount((prev) => ({ ...prev, [field]: !prev[field] }));
  }
  function handlePasswordVisibility(
    field: 'password' | 'newPassword' | 'confirmPassword',
  ) {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }
  function handleAccountSave() {
    return;
  }
  function handleJobAlertSave() {
    return;
  }
  function handlePasswordSave() {
    return;
  }
  function handleDeleteAccount() {
    return;
  }

  function renderTabContent() {
    if (activeTab === 'personal') {
      return (
        <div className='mt-8'>
          {/* Basic Information */}
          <div className='grid grid-cols-3 gap-8 mb-10'>
            {/* Profile Picture */}
            <div>
              <div className='mb-2 font-medium text-gray-900 dark:text-white'>
                Profile Picture
              </div>
              <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center h-48 w-48 text-center p-4 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800'>
                <div className='text-4xl mb-2'>
                  <svg
                    width='40'
                    height='40'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      d='M12 16v-4m0 0V8m0 4h4m-4 0H8'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <circle cx='12' cy='12' r='10' strokeWidth='2' />
                  </svg>
                </div>
                <div className='font-medium text-gray-600 dark:text-gray-300'>
                  Browse photo{' '}
                  <span className='text-gray-400 dark:text-gray-500'>
                    or drop here
                  </span>
                </div>
                <div className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
                  A photo larger than 400 pixels work best. Max photo size 5 MB.
                </div>
              </div>
            </div>
            {/* Form Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Full name
                </div>
                <Input placeholder='Enter your full name' />
              </div>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Tittle/headline
                </div>
                <Input placeholder='Enter your headline' />
              </div>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Experience
                </div>
                <Select defaultValue=''>
                  <option value='' disabled>
                    Select...
                  </option>
                  {experienceOptions.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Educations
                </div>
                <Select defaultValue=''>
                  <option value='' disabled>
                    Select...
                  </option>
                  {educationOptions.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </Select>
              </div>
              <div className='col-span-2'>
                <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Personal Website
                </div>
                <Input placeholder='Website url...' />
              </div>
            </div>
          </div>
          <Button className='mb-10'>Save Changes</Button>

          {/* CV/Resume Section */}
          <div>
            <div className='font-semibold mb-4 text-gray-900 dark:text-white'>
              Your Cv/Resume
            </div>
            <div className='flex gap-4 mb-4'>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col min-w-[180px] relative border border-gray-200 dark:border-gray-700'
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-blue-600 dark:text-blue-400'>
                      <svg
                        width='24'
                        height='24'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <rect
                          x='4'
                          y='4'
                          width='16'
                          height='16'
                          rx='2'
                          strokeWidth='2'
                        />
                        <path d='M8 8h8M8 12h8M8 16h4' strokeWidth='2' />
                      </svg>
                    </span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {resume.name}
                    </span>
                  </div>
                  <div className='text-xs text-gray-400 dark:text-gray-500 mb-2'>
                    {resume.size}
                  </div>
                  <button
                    className='absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                    onClick={() =>
                      setResumeMenu(resume.id === resumeMenu ? null : resume.id)
                    }
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <circle cx='12' cy='6' r='1.5' />
                      <circle cx='12' cy='12' r='1.5' />
                      <circle cx='12' cy='18' r='1.5' />
                    </svg>
                  </button>
                  {resumeMenu === resume.id && (
                    <div className='absolute right-2 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 w-32'>
                      <button
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                        onClick={() => setResumeMenu(null)}
                      >
                        Edit Resume
                      </button>
                      <button
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400'
                        onClick={() => handleDeleteResume(resume.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Add Resume */}
            <button
              type='button'
              className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center min-w-[180px] p-4 text-center text-gray-400 dark:text-gray-500 cursor-pointer bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors'
              onClick={() => setAddModalOpen(true)}
            >
              <div className='text-2xl mb-2'>+</div>
              <div className='font-medium text-gray-600 dark:text-gray-300'>
                Add Cv/Resume
              </div>
              <div className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
                Browse file or drop here. only pdf
              </div>
            </button>
          </div>
        </div>
      );
    }
    if (activeTab === 'profile') {
      return (
        <div className='mt-8'>
          <form className='grid grid-cols-2 gap-8 mb-10'>
            {/* Nationality */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Nationality
              </div>
              <Select
                value={profile.nationality}
                onChange={(e) =>
                  setProfile({ ...profile, nationality: e.target.value })
                }
              >
                <option value='' disabled>
                  Select...
                </option>
                <option value='Nigeria'>Nigeria</option>
                <option value='United States'>United States</option>
                <option value='United Kingdom'>United Kingdom</option>
                <option value='Canada'>Canada</option>
                <option value='India'>India</option>
                <option value='Other'>Other</option>
              </Select>
            </div>
            {/* Date of Birth */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Date of Birth
              </div>
              <Input
                type='date'
                value={profile.dob}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
                placeholder='dd/mm/yyyy'
              />
            </div>
            {/* Gender */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Gender
              </div>
              <Select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
              >
                <option value='' disabled>
                  Select...
                </option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
                <option value='Prefer not to say'>Prefer not to say</option>
              </Select>
            </div>
            {/* Marital Status */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Marital Status
              </div>
              <Select
                value={profile.maritalStatus}
                onChange={(e) =>
                  setProfile({ ...profile, maritalStatus: e.target.value })
                }
              >
                <option value='' disabled>
                  Select...
                </option>
                <option value='Single'>Single</option>
                <option value='Married'>Married</option>
                <option value='Divorced'>Divorced</option>
                <option value='Widowed'>Widowed</option>
                <option value='Other'>Other</option>
              </Select>
            </div>
            {/* Education */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Education
              </div>
              <Select
                value={profile.education}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
              >
                <option value='' disabled>
                  Select...
                </option>
                {educationOptions.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </Select>
            </div>
            {/* Experience */}
            <div>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Experience
              </div>
              <Select
                value={profile.experience}
                onChange={(e) =>
                  setProfile({ ...profile, experience: e.target.value })
                }
              >
                <option value='' disabled>
                  Select...
                </option>
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </Select>
            </div>
            {/* Biography */}
            <div className='col-span-2'>
              <div className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                Biography
              </div>
              <textarea
                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                rows={4}
                placeholder='Tell us about yourself...'
                value={profile.biography}
                onChange={(e) =>
                  setProfile({ ...profile, biography: e.target.value })
                }
              />
            </div>
          </form>
          <Button onClick={handleProfileSave}>Save Changes</Button>
        </div>
      );
    }
    if (activeTab === 'social') {
      return (
        <div className='mt-8'>
          <div className='font-medium mb-4 text-gray-900 dark:text-white'>
            Social Links
          </div>
          {socialLinks.map((link, idx) => (
            <div key={idx} className='mb-4'>
              <div className='flex items-center gap-4'>
                <div className='w-32'>
                  <Select
                    value={link.platform}
                    onChange={(e) =>
                      handleSocialLinkChange(idx, 'platform', e.target.value)
                    }
                  >
                    {socialPlatforms.map((platform) => (
                      <option key={platform.key} value={platform.key}>
                        {platform.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <Input
                  className='flex-1'
                  placeholder='Profile link/url...'
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(idx, 'url', e.target.value)
                  }
                />
                <button
                  type='button'
                  className='ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
                  onClick={() => handleRemoveSocialLink(idx)}
                  aria-label='Remove social link'
                >
                  <svg
                    width='18'
                    height='18'
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
            </div>
          ))}
          <button
            type='button'
            className='w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mb-8 mt-2 transition-colors'
            onClick={handleAddSocialLink}
          >
            <svg
              width='18'
              height='18'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <circle cx='12' cy='12' r='10' strokeWidth='2' />
              <path d='M12 8v8M8 12h8' strokeWidth='2' strokeLinecap='round' />
            </svg>
            Add New Social Link
          </button>
          <Button onClick={handleSocialLinksSave}>Save Changes</Button>
        </div>
      );
    }
    if (activeTab === 'account') {
      return (
        <div className='mt-8 flex flex-col gap-10'>
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
            <div className='mb-4 flex gap-2'>
              <Select
                value={account.phoneCountry}
                onChange={(e) =>
                  handleAccountChange('phoneCountry', e.target.value)
                }
                className='w-24'
              >
                <option value='+880'>🇧🇩 +880</option>
                <option value='+234'>🇳🇬 +234</option>
                <option value='+1'>🇺🇸 +1</option>
                <option value='+44'>🇬🇧 +44</option>
                <option value='+91'>🇮🇳 +91</option>
              </Select>
              <Input
                placeholder='Phone number..'
                value={account.phone}
                onChange={(e) => handleAccountChange('phone', e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <div className='flex items-center gap-2'>
                <span className='text-gray-400 dark:text-gray-500'>
                  <svg
                    width='18'
                    height='18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      d='M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
                <Input
                  type='email'
                  placeholder='Email address'
                  value={account.email}
                  onChange={(e) => handleAccountChange('email', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAccountSave}>Save Changes</Button>
          </div>

          {/* Notification Preferences */}
          <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <div className='font-medium mb-4 text-gray-900 dark:text-white'>
              Notification
            </div>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <label className='flex items-center gap-2 text-gray-900 dark:text-white'>
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
              <label className='flex items-center gap-2 text-gray-900 dark:text-white'>
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
              <label className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <input
                  type='checkbox'
                  checked={account.notifications.appliedExpire}
                  onChange={(e) =>
                    handleNotificationChange('appliedExpire', e.target.checked)
                  }
                  className='rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                />
                Notify me when my applied jobs are expire
              </label>
              <label className='flex items-center gap-2 text-gray-900 dark:text-white'>
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
              <label className='flex items-center gap-2 col-span-2 text-gray-900 dark:text-white'>
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

          {/* Job Alerts */}
          <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <div className='font-medium mb-4 text-gray-900 dark:text-white'>
              Job Alerts
            </div>
            <div className='flex gap-4 mb-4'>
              <div className='flex items-center gap-2 flex-1'>
                <span className='text-gray-400 dark:text-gray-500'>
                  <svg
                    width='18'
                    height='18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      d='M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <circle
                      cx='12'
                      cy='7'
                      r='4'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
                <Input
                  placeholder='Your job roles'
                  value={account.jobAlertRole}
                  onChange={(e) =>
                    handleAccountChange('jobAlertRole', e.target.value)
                  }
                />
              </div>
              <div className='flex items-center gap-2 flex-1'>
                <span className='text-gray-400 dark:text-gray-500'>
                  <svg
                    width='18'
                    height='18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      d='M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <circle
                      cx='12'
                      cy='10'
                      r='3'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
                <Input
                  placeholder='City, state, country name'
                  value={account.jobAlertLocation}
                  onChange={(e) =>
                    handleAccountChange('jobAlertLocation', e.target.value)
                  }
                />
              </div>
            </div>
            <Button onClick={handleJobAlertSave}>Save Changes</Button>
          </div>

          {/* Profile & Resume Privacy */}
          <div className='border-t border-gray-200 dark:border-gray-700 pt-8 flex gap-8'>
            <div className='flex items-center gap-4'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Profile Privacy
              </span>
              <button
                type='button'
                onClick={() => handlePrivacyToggle('profilePublic')}
                className={`w-12 h-6 rounded-full flex items-center transition-colors ${account.profilePublic ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow transform transition-transform ${account.profilePublic ? 'translate-x-6' : ''}`}
                ></span>
              </button>
              <span className='ml-2 text-sm text-gray-900 dark:text-white'>
                {account.profilePublic ? 'YES' : 'NO'}{' '}
                <span className='text-gray-400 dark:text-gray-500'>
                  {account.profilePublic
                    ? 'Your profile is public now'
                    : 'Your profile is private now'}
                </span>
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Resume Privacy
              </span>
              <button
                type='button'
                onClick={() => handlePrivacyToggle('resumePrivate')}
                className={`w-12 h-6 rounded-full flex items-center transition-colors ${account.resumePrivate ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow transform transition-transform ${account.resumePrivate ? 'translate-x-6' : ''}`}
                ></span>
              </button>
              <span className='ml-2 text-sm text-gray-900 dark:text-white'>
                {account.resumePrivate ? 'YES' : 'NO'}{' '}
                <span className='text-gray-400 dark:text-gray-500'>
                  {account.resumePrivate
                    ? 'Your resume is private now'
                    : 'Your resume is public now'}
                </span>
              </span>
            </div>
          </div>

          {/* Change Password */}
          <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <div className='font-medium mb-4 text-gray-900 dark:text-white'>
              Change Password
            </div>
            <div className='grid grid-cols-3 gap-4 mb-4'>
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
              <div className='relative'>
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
          <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
            <div className='font-medium mb-2 text-red-600 dark:text-red-400 flex items-center gap-2'>
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
    }
    return (
      <div className='mt-8 text-gray-400 dark:text-gray-500 text-center'>
        {activeTab === 'account' && 'Account Setting tab content coming soon.'}
      </div>
    );
  }

  return (
    <div className='flex-1 px-10 py-4 bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-xl font-semibold mb-6 text-gray-900 dark:text-white'>
        Settings
      </h1>
      {/* Horizontal Tabs */}
      <div className='flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-2'>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
      <AddResumeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddResume}
        loading={addLoading}
      />
    </div>
  );
}
