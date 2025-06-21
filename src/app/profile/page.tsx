'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/contexts/ToastContext';
import { profileService } from '@/services/profileService';
import Image from 'next/image';
import { UserProfile, FileInfo } from '@/types/profile';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeResumeTab, setActiveResumeTab] = useState<'view' | 'upload'>(
    'view',
  );
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          if (userData.role !== 'employee') {
            router.push('/dashboard');
            return;
          }

          // Map user data to profile state with proper defaults
          const mappedProfile: UserProfile = {
            id: userData.id || '',
            phone: userData.phone || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            gender: userData.gender || '',
            status: userData.status || '',
            address: userData.address || {},
            birthDate: userData.birthDate || '',
            linkedinUrl: userData.linkedinUrl || '',
            portfolioUrl: userData.portfolioUrl || '',
            yearOfExperience: parseInt(userData.yearOfExperience) || 0,
            industry: Array.isArray(userData.industry) ? userData.industry : [],
            telegramUserId: userData.telegramUserId || '',
            preferredJobLocation: Array.isArray(userData.preferredJobLocation)
              ? userData.preferredJobLocation
              : [],
            highestLevelOfEducation: userData.highestLevelOfEducation || '',
            salaryExpectations: parseInt(userData.salaryExpectations) || 0,
            aiGeneratedJobFitScore:
              parseInt(userData.aiGeneratedJobFitScore) || 0,
            technicalSkills: Array.isArray(userData.technicalSkills)
              ? userData.technicalSkills
              : [],
            softSkills: Array.isArray(userData.softSkills)
              ? userData.softSkills
              : [],
            profile: userData.profile || {},
            resume: userData.resume || {},
            educations: userData.educations || {},
            experiences: userData.experiences || {},
            socialMediaLinks: userData.socialMediaLinks || {},
            profileHeadLine: userData.profileHeadLine || '',
            coverLetter: userData.coverLetter || '',
            professionalSummery: userData.professionalSummery || '',
          };

          console.log('Mapped profile data:', mappedProfile);
          setProfile(mappedProfile);

          // Fetch profile completeness
          try {
            const completenessData =
              await profileService.getProfileCompleteness(userData.id);
            console.log('Profile completeness:', completenessData);
          } catch (error) {
            console.error('Error fetching profile completeness:', error);
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          showToast({
            type: 'error',
            message: 'Error loading profile data',
          });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [router, showToast]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(
        profile.id,
        profile,
      );
      localStorage.setItem(
        'user',
        JSON.stringify({ ...updatedProfile, role: 'employee' }),
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      showToast({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const result = await profileService.uploadProfileImage(profile.id, file);
      const updatedProfile = {
        ...profile,
        profile: result.profile as FileInfo,
      };
      setProfile(updatedProfile);

      // Get the current user data to preserve role
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          ...updatedProfile,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      showToast({
        type: 'success',
        message: 'Profile picture updated successfully',
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to upload profile picture',
      });
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      showToast({
        type: 'error',
        message: 'Only PDF files are allowed',
      });
      return;
    }

    // Check file size (12MB limit)
    if (file.size > 12 * 1024 * 1024) {
      showToast({
        type: 'error',
        message: 'File size exceeds 12MB limit',
      });
      return;
    }

    try {
      const result = await profileService.uploadResume(profile.id, file);
      const updatedProfile = {
        ...profile,
        resume: result.resume as FileInfo,
      };
      setProfile(updatedProfile);

      // Get the current user data to preserve role
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          ...updatedProfile,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      showToast({
        type: 'success',
        message: 'Resume uploaded successfully',
      });
      setActiveResumeTab('view');
    } catch (error) {
      console.error('Error uploading resume:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to upload resume',
      });
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Profile
        </h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'primary'}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 space-y-6 border border-gray-200 dark:border-gray-700'>
        {/* Profile Picture Section */}
        <section className='flex flex-col items-center mb-8'>
          <div className='relative group'>
            <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600'>
              {profile?.profile?.path ? (
                <Image
                  src={profile.profile.path}
                  alt={`${profile.firstName}'s profile picture`}
                  width={128}
                  height={128}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'>
                  <span className='text-4xl'>
                    {profile?.firstName?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
              <label className='cursor-pointer'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleProfileImageUpload}
                />
                <div className='p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-gray-600 dark:text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
              </label>
            </div>
          </div>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Hover over the profile picture to upload a new one
          </p>
        </section>

        {/* Basic Information */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Basic Information
          </h2>
          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  First Name
                </label>
                <Input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Middle Name
                </label>
                <Input
                  value={profile.middleName}
                  onChange={(e) =>
                    setProfile({ ...profile, middleName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Email
                </label>
                <Input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  type='email'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Phone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Gender
                </label>
                <Select
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value })
                  }
                >
                  <option value=''>Select gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Birth Date
                </label>
                <Input
                  value={
                    profile.birthDate
                      ? new Date(profile.birthDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setProfile({ ...profile, birthDate: e.target.value })
                  }
                  type='date'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Status
                </label>
                <Input
                  value={profile.status}
                  onChange={(e) =>
                    setProfile({ ...profile, status: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Full Name
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {`${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Email
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.email}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Phone
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.phone}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Gender
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.gender}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Birth Date
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.birthDate
                    ? new Date(profile.birthDate).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Status
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.status}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Professional Information */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Professional Information
          </h2>
          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Profile Headline
                </label>
                <Input
                  value={profile.profileHeadLine}
                  onChange={(e) =>
                    setProfile({ ...profile, profileHeadLine: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Years of Experience
                </label>
                <Input
                  value={profile.yearOfExperience}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      yearOfExperience: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Highest Level of Education
                </label>
                <Select
                  value={profile.highestLevelOfEducation}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      highestLevelOfEducation: e.target.value,
                    })
                  }
                >
                  <option value=''>Select education level</option>
                  <option value='High School'>High School</option>
                  <option value='Diploma'>Diploma</option>
                  <option value='Bachelor'>Bachelor</option>
                  <option value='Master'>Master</option>
                  <option value='PhD'>PhD</option>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Salary Expectations
                </label>
                <Input
                  value={profile.salaryExpectations}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      salaryExpectations: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Industry
                </label>
                <Input
                  value={profile.industry?.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      industry: e.target.value.split(',').map((i) => i.trim()),
                    })
                  }
                  placeholder='Enter industries separated by commas'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Preferred Job Location
                </label>
                <Input
                  value={profile.preferredJobLocation?.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredJobLocation: e.target.value
                        .split(',')
                        .map((l) => l.trim()),
                    })
                  }
                  placeholder='Enter locations separated by commas'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Profile Headline
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.profileHeadLine}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Years of Experience
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.yearOfExperience} years
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Highest Education
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.highestLevelOfEducation}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Salary Expectations
                </h3>
                <p className='mt-1 text-lg font-semibold text-gray-900 dark:text-white'>
                  ${profile.salaryExpectations.toLocaleString()}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Industry
                </h3>
                <div className='mt-1 flex flex-wrap gap-2'>
                  {profile.industry?.map((ind, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm'
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Preferred Locations
                </h3>
                <div className='mt-1 flex flex-wrap gap-2'>
                  {profile.preferredJobLocation?.map((loc, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm'
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Skills */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Skills
          </h2>
          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Technical Skills
                </label>
                <Input
                  value={profile.technicalSkills?.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      technicalSkills: e.target.value
                        .split(',')
                        .map((s) => s.trim()),
                    })
                  }
                  placeholder='Enter skills separated by commas'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Soft Skills
                </label>
                <Input
                  value={profile.softSkills?.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      softSkills: e.target.value
                        .split(',')
                        .map((s) => s.trim()),
                    })
                  }
                  placeholder='Enter skills separated by commas'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Technical Skills
                </h3>
                <div className='mt-1 flex flex-wrap gap-2'>
                  {profile.technicalSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Soft Skills
                </h3>
                <div className='mt-1 flex flex-wrap gap-2'>
                  {profile.softSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Professional Summary */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Professional Summary
          </h2>
          {isEditing ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Summary
              </label>
              <Textarea
                value={profile.professionalSummery}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    professionalSummery: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
          ) : (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
                {profile.professionalSummery}
              </p>
            </div>
          )}
        </section>

        {/* Cover Letter */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Cover Letter
          </h2>
          {isEditing ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Cover Letter
              </label>
              <Textarea
                value={profile.coverLetter}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    coverLetter: e.target.value,
                  })
                }
                rows={6}
              />
            </div>
          ) : (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
                {profile.coverLetter}
              </p>
            </div>
          )}
        </section>

        {/* Social Media Links */}
        <section>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Social Media Links
          </h2>
          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  LinkedIn URL
                </label>
                <Input
                  value={profile.linkedinUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedinUrl: e.target.value })
                  }
                  type='url'
                  placeholder='https://linkedin.com/in/yourprofile'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Portfolio URL
                </label>
                <Input
                  value={profile.portfolioUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolioUrl: e.target.value })
                  }
                  type='url'
                  placeholder='https://yourportfolio.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Telegram User ID
                </label>
                <Input
                  value={profile.telegramUserId}
                  onChange={(e) =>
                    setProfile({ ...profile, telegramUserId: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  LinkedIn
                </h3>
                <a
                  href={profile.linkedinUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  {profile.linkedinUrl}
                </a>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Portfolio
                </h3>
                <a
                  href={profile.portfolioUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  {profile.portfolioUrl}
                </a>
              </div>
              {profile.telegramUserId && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Telegram
                  </h3>
                  <p className='mt-1 text-gray-900 dark:text-white'>
                    {profile.telegramUserId}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Resume Section */}
        <section className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 space-y-6 border border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Resume
          </h2>

          {/* Resume Tabs */}
          <div className='border-b border-gray-200 dark:border-gray-600'>
            <nav className='-mb-px flex space-x-8'>
              <button
                onClick={() => setActiveResumeTab('view')}
                className={`${
                  activeResumeTab === 'view'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Current Resume
              </button>
              <button
                onClick={() => setActiveResumeTab('upload')}
                className={`${
                  activeResumeTab === 'upload'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Upload New Resume
              </button>
            </nav>
          </div>

          {/* Resume Content */}
          <div className='mt-6'>
            {activeResumeTab === 'view' ? (
              <div className='space-y-4'>
                {profile?.resume?.path ? (
                  <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
                    <div className='flex items-center space-x-4'>
                      <svg
                        className='w-8 h-8 text-gray-400 dark:text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                        />
                      </svg>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {profile.resume.filename || 'Resume.pdf'}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Last updated:{' '}
                          {profile.resume.updatedAt
                            ? new Date(
                                profile.resume.updatedAt,
                              ).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <a
                        href={profile.resume.path}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                      >
                        View
                      </a>
                      <button
                        onClick={() => router.push('/cv-builder')}
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
                      >
                        Generate CV
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500 dark:text-gray-400'>
                      No resume uploaded yet
                    </p>
                    <div className='mt-4 space-x-4'>
                      <button
                        onClick={() => setActiveResumeTab('upload')}
                        className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                      >
                        Upload your resume
                      </button>
                      <button
                        onClick={() => router.push('/cv-builder')}
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
                      >
                        Generate CV with AI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6'>
                  <div className='text-center'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                      />
                    </svg>
                    <div className='mt-4'>
                      <label
                        htmlFor='resume-upload'
                        className='cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-offset-gray-800'
                      >
                        <span>Upload a file</span>
                        <input
                          id='resume-upload'
                          name='resume-upload'
                          type='file'
                          accept='.pdf'
                          className='sr-only'
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                        PDF files only, up to 12MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {isEditing && (
          <div className='flex justify-end gap-4'>
            <Button onClick={() => setIsEditing(false)} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} variant='primary'>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
