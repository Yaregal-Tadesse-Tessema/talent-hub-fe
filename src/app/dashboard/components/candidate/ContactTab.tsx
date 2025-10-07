import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ContactTabProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

const countries = [{ code: 'ET', name: 'Ethiopia' }];

const phoneCountryCodes = [{ code: '+251', country: '🇪🇹 ET' }];

export default function ContactTab({
  userProfile,
  setUserProfile,
}: ContactTabProps) {
  const handleAddressChange = (field: string, value: string) => {
    setUserProfile({
      ...userProfile,
      address: {
        ...userProfile.address,
        [field]: value,
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving contact information:', userProfile);
  };

  return (
    <form className='mt-8' onSubmit={handleSave}>
      <div className='space-y-8'>
        {/* Phone & Email Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Contact Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Phone */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Phone Number
              </label>
              <div className='flex'>
                <select
                  value={userProfile.phoneCountryCode || '+251'}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      phoneCountryCode: e.target.value,
                    })
                  }
                  className='w-20 text-sm border border-gray-300 rounded-md px-2 py-1'
                >
                  {phoneCountryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type='tel'
                  placeholder='Enter phone number'
                  value={userProfile.phone || ''}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, phone: e.target.value })
                  }
                  className='flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 ml-2'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Email Address
              </label>
              <Input
                type='email'
                value={userProfile.email}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, email: e.target.value })
                }
                placeholder='Enter email address'
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Address Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* City */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                City
              </label>
              <Input
                value={userProfile.address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder='Enter city'
              />
            </div>

            {/* Country */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Country
              </label>
              <Select
                value={userProfile.address?.country || 'ET'}
                onChange={(e) => handleAddressChange('country', e.target.value)}
              >
                <option value=''>Select country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button type='submit' className='px-8'>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
