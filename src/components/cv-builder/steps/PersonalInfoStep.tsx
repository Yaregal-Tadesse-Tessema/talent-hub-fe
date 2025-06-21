import { Profile } from '@/app/cv-builder/page';
import { useState } from 'react';
import Image from 'next/image';

interface PersonalInfoStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function PersonalInfoStep({
  profile,
  onUpdate,
}: PersonalInfoStepProps) {
  const [profilePicPreview, setProfilePicPreview] = useState<string>(
    profile.profilePicture,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicPreview(result);
        onUpdate({ profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Personal Information
        </h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Let's start with your basic information. This will be the first thing
          employers see.
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className='flex items-center space-x-6'>
        <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700'>
          {profilePicPreview ? (
            <Image
              src={profilePicPreview}
              alt='Profile preview'
              fill
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500'>
              <svg
                className='w-12 h-12'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Profile Picture
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
              hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50'
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='fullName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Full Name
          </label>
          <input
            type='text'
            id='fullName'
            value={profile.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='John Doe'
          />
        </div>

        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Professional Title
          </label>
          <input
            type='text'
            id='title'
            value={profile.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='Software Engineer'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            value={profile.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='john@example.com'
          />
        </div>

        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Phone
          </label>
          <input
            type='tel'
            id='phone'
            value={profile.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='+1 (555) 000-0000'
          />
        </div>

        <div className='sm:col-span-2'>
          <label
            htmlFor='address'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Address
          </label>
          <input
            type='text'
            id='address'
            value={profile.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='City, Country'
          />
        </div>
      </div>

      {/* Social Links */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='linkedin'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            LinkedIn URL
          </label>
          <input
            type='url'
            id='linkedin'
            value={profile.linkedin}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='https://linkedin.com/in/username'
          />
        </div>

        <div>
          <label
            htmlFor='github'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            GitHub URL
          </label>
          <input
            type='url'
            id='github'
            value={profile.github}
            onChange={(e) => onUpdate({ github: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='https://github.com/username'
          />
        </div>

        <div>
          <label
            htmlFor='twitter'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Twitter URL
          </label>
          <input
            type='url'
            id='twitter'
            value={profile.twitter}
            onChange={(e) => onUpdate({ twitter: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='https://twitter.com/username'
          />
        </div>

        <div>
          <label
            htmlFor='website'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Personal Website
          </label>
          <input
            type='url'
            id='website'
            value={profile.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            placeholder='https://yourwebsite.com'
          />
        </div>
      </div>
    </div>
  );
}
