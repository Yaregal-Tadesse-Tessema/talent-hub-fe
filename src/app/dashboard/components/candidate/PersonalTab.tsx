import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PersonalTabProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

export default function PersonalTab({
  userProfile,
  setUserProfile,
}: PersonalTabProps) {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving personal information:', userProfile);
  };

  return (
    <form className='mt-8' onSubmit={handleSave}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
        {/* Profile Picture */}
        <div>
          <div className='mb-2 font-medium text-gray-900 dark:text-white'>
            Profile Picture
          </div>
          <label className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center h-48 w-48 text-center p-4 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors'>
            {userProfile.profile.path ? (
              <img
                src={userProfile.profile.path}
                alt='Profile'
                className='w-24 h-24 rounded-full object-cover mb-2'
              />
            ) : (
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
            )}
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={() => {
                // TODO: Implement file upload functionality
              }}
            />
            <div className='font-medium text-gray-600 dark:text-gray-300'>
              Browse photo{' '}
              <span className='text-gray-400 dark:text-gray-500'>
                or drop here
              </span>
            </div>
            <div className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
              A photo larger than 400 pixels works best. Max photo size 5 MB.
            </div>
          </label>
        </div>
        {/* Form Fields */}
        <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              First Name
            </label>
            <Input
              value={userProfile.firstName}
              onChange={(e) =>
                setUserProfile({ ...userProfile, firstName: e.target.value })
              }
              placeholder='Enter your first name'
            />
          </div>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Middle Name
            </label>
            <Input
              value={userProfile.middleName}
              onChange={(e) =>
                setUserProfile({ ...userProfile, middleName: e.target.value })
              }
              placeholder='Enter your middle name'
            />
          </div>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Last Name
            </label>
            <Input
              value={userProfile.lastName}
              onChange={(e) =>
                setUserProfile({ ...userProfile, lastName: e.target.value })
              }
              placeholder='Enter your last name'
            />
          </div>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Gender
            </label>
            <Select
              value={userProfile.gender}
              onChange={(e) =>
                setUserProfile({ ...userProfile, gender: e.target.value })
              }
            >
              <option value=''>Select...</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </Select>
          </div>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Birth Date
            </label>
            <Input
              type='date'
              value={userProfile.birthDate}
              onChange={(e) =>
                setUserProfile({ ...userProfile, birthDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Status
            </label>
            <Select
              value={userProfile.status}
              onChange={(e) =>
                setUserProfile({ ...userProfile, status: e.target.value })
              }
            >
              <option value='Active'>Active</option>
              <option value='Inactive'>Inactive</option>
            </Select>
          </div>
          <div className='md:col-span-2'>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Profile Headline
            </label>
            <Input
              value={userProfile.profileHeadLine}
              onChange={(e) =>
                setUserProfile({
                  ...userProfile,
                  profileHeadLine: e.target.value,
                })
              }
              placeholder='Enter your headline'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Professional Summary
            </label>
            <textarea
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
              rows={3}
              placeholder='Tell us about yourself...'
              value={userProfile.professionalSummery}
              onChange={(e) =>
                setUserProfile({
                  ...userProfile,
                  professionalSummery: e.target.value,
                })
              }
            />
          </div>
          <div className='md:col-span-2'>
            <label className='mb-1 text-sm font-medium text-gray-900 dark:text-white block'>
              Cover Letter
            </label>
            <textarea
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
              rows={3}
              placeholder='Write a cover letter...'
              value={userProfile.coverLetter}
              onChange={(e) =>
                setUserProfile({ ...userProfile, coverLetter: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <Button className='mb-10' type='submit'>
        Save Changes
      </Button>
    </form>
  );
}
