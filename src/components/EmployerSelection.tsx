'use client';

import React, { useEffect, useState } from 'react';
import { EmployerData } from '@/types/employer';

interface EmployerSelectionProps {
  employers: EmployerData[];
  onSelect: (employer: EmployerData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployerSelection({
  employers,
  onSelect,
  isOpen,
  onClose,
}: EmployerSelectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    email: '',
    phoneNumber: '',
    tin: '',
    licenseNumber: '',
    registrationNumber: '',
    companySize: '',
    industry: '',
    organizationType: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the API call to create a new company
    console.log('Form submitted:', formData);
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {isCreating ? 'Create New Company' : 'Select Your Company'}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              {isCreating
                ? 'Please fill in the company details'
                : 'Please select the company'}
            </p>
          </div>

          {!isCreating ? (
            <>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {employers.map((employer) => (
                  <div
                    key={employer.id}
                    onClick={() => onSelect(employer)}
                    className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-500 cursor-pointer group'
                  >
                    <div className='p-6 flex flex-col items-center justify-center'>
                      <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                        <span className='text-3xl font-semibold text-gray-400'>
                          {employer?.tenant?.tradeName?.charAt(0)}
                        </span>
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors'>
                        {employer?.tenant?.tradeName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-8 text-center'>
                <button
                  onClick={() => setIsCreating(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Create New Company
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Company Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='tradeName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Trading Name
                  </label>
                  <input
                    type='text'
                    name='tradeName'
                    id='tradeName'
                    value={formData.tradeName}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='phoneNumber'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phoneNumber'
                    id='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='tin'
                    className='block text-sm font-medium text-gray-700'
                  >
                    TIN
                  </label>
                  <input
                    type='text'
                    name='tin'
                    id='tin'
                    value={formData.tin}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='licenseNumber'
                    className='block text-sm font-medium text-gray-700'
                  >
                    License Number
                  </label>
                  <input
                    type='text'
                    name='licenseNumber'
                    id='licenseNumber'
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='registrationNumber'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Registration Number
                  </label>
                  <input
                    type='text'
                    name='registrationNumber'
                    id='registrationNumber'
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='companySize'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Company Size
                  </label>
                  <select
                    name='companySize'
                    id='companySize'
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  >
                    <option value=''>Select size</option>
                    <option value='1-10'>1-10 employees</option>
                    <option value='11-50'>11-50 employees</option>
                    <option value='51-200'>51-200 employees</option>
                    <option value='201-500'>201-500 employees</option>
                    <option value='501+'>501+ employees</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='industry'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Industry
                  </label>
                  <input
                    type='text'
                    name='industry'
                    id='industry'
                    value={formData.industry}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='organizationType'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Organization Type
                  </label>
                  <select
                    name='organizationType'
                    id='organizationType'
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    required
                  >
                    <option value=''>Select type</option>
                    <option value='Corporation'>Corporation</option>
                    <option value='LLC'>LLC</option>
                    <option value='Partnership'>Partnership</option>
                    <option value='Sole Proprietorship'>
                      Sole Proprietorship
                    </option>
                    <option value='Non-Profit'>Non-Profit</option>
                  </select>
                </div>
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => setIsCreating(false)}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Create Company
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
