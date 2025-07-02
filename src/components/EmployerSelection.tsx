'use client';

import React, { useEffect, useState } from 'react';
import { EmployerData } from '@/types/employer';
import { employerService } from '@/services/employerService';

interface EmployerSelectionProps {
  employers: EmployerData[];
  onSelect: (employer: EmployerData) => void;
  isOpen: boolean;
  onClose: () => void;
}

type RegistrationType = 'manual' | 'etrade';

export default function EmployerSelection({
  employers,
  onSelect,
  isOpen,
  onClose,
}: EmployerSelectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>('etrade');
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleEmployerSelect = async (employer: EmployerData) => {
    setIsLoading(true);
    try {
      // Add a small delay to make the loading state visible
      await new Promise((resolve) => setTimeout(resolve, 500));
      await onSelect(employer);
    } catch (error) {
      console.error('Error selecting employer:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationType === 'etrade') {
      // ETrade API call using service
      try {
        const data = await employerService.createAccountFromTrade({
          tin: formData.tin,
          licenseNumber: formData.licenseNumber,
        });
        console.log('ETrade company created:', data);
        // Handle success - close modal and refresh employers list
        onClose();
      } catch (error) {
        console.error('Error creating ETrade company:', error);
      }
    } else {
      // Manual registration API call using service
      try {
        const data = await employerService.createTenant({
          name: formData.name,
          tradeName: formData.tradeName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          tin: formData.tin,
          licenseNumber: formData.licenseNumber,
          registrationNumber: formData.registrationNumber,
          companySize: formData.companySize,
          industry: formData.industry,
          organizationType: formData.organizationType,
        });
        console.log('Manual company created:', data);
        // Handle success - close modal and refresh employers list
        onClose();
      } catch (error) {
        console.error('Error creating manual company:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setCurrentStep(1);
  };

  const handleRegistrationTypeChange = (type: RegistrationType) => {
    setRegistrationType(type);
    resetForm();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderManualForm = () => (
    <div className='space-y-8'>
      {/* Progress indicator */}
      <div className='flex items-center justify-center space-x-4 mb-8'>
        {[1, 2, 3].map((step) => (
          <div key={step} className='flex items-center'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className='space-y-6'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Basic Information
            </h3>
            <p className='text-gray-600'>
              Let's start with your company's basic details
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Company Name *
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Enter your company name'
                required
              />
            </div>

            <div>
              <label
                htmlFor='tradeName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Trading Name *
              </label>
              <input
                type='text'
                name='tradeName'
                id='tradeName'
                value={formData.tradeName}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Enter trading name'
                required
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='company@example.com'
              />
            </div>

            <div>
              <label
                htmlFor='phoneNumber'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Phone Number
              </label>
              <input
                type='tel'
                name='phoneNumber'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='+1234567890'
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={nextStep}
              disabled={
                !formData.name ||
                !formData.tradeName ||
                (!formData.email && !formData.phoneNumber)
              }
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all'
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Legal Information */}
      {currentStep === 2 && (
        <div className='space-y-6'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Legal Information
            </h3>
            <p className='text-gray-600'>
              Provide your company's legal registration details
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='tin'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                TIN Number *
              </label>
              <input
                type='text'
                name='tin'
                id='tin'
                value={formData.tin}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Enter TIN number'
                required
              />
            </div>

            <div>
              <label
                htmlFor='licenseNumber'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                License Number *
              </label>
              <input
                type='text'
                name='licenseNumber'
                id='licenseNumber'
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Enter license number'
                required
              />
            </div>

            <div>
              <label
                htmlFor='registrationNumber'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Registration Number *
              </label>
              <input
                type='text'
                name='registrationNumber'
                id='registrationNumber'
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Enter registration number'
                required
              />
            </div>
          </div>

          <div className='flex justify-between'>
            <button
              type='button'
              onClick={prevStep}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all'
            >
              Previous
            </button>
            <button
              type='button'
              onClick={nextStep}
              disabled={
                !formData.tin ||
                !formData.licenseNumber ||
                !formData.registrationNumber
              }
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all'
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Company Details */}
      {currentStep === 3 && (
        <div className='space-y-6'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Company Details
            </h3>
            <p className='text-gray-600'>
              Tell us more about your organization
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='companySize'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Company Size *
              </label>
              <select
                name='companySize'
                id='companySize'
                value={formData.companySize}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                required
              >
                <option value=''>Select company size</option>
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
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Industry *
              </label>
              <select
                name='industry'
                id='industry'
                value={formData.industry}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                required
              >
                <option value=''>Select industry</option>
                <option value='Technology And IT'>Technology And IT</option>
                <option value='Healthcare And Medicine'>
                  Healthcare And Medicine
                </option>
                <option value='Engineering Construction'>
                  Engineering Construction
                </option>
                <option value='Finance And Business'>
                  Finance And Business
                </option>
                <option value='Education And Research'>
                  Education And Research
                </option>
                <option value='Law And Government'>Law And Government</option>
                <option value='Creative & Media'>Creative & Media</option>
                <option value='Hospitality And Tourism'>
                  Hospitality And Tourism
                </option>
                <option value='Science And Environment'>
                  Science And Environment
                </option>
                <option value='Skilled Trades'>Skilled Trades</option>
              </select>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='organizationType'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Organization Type *
              </label>
              <select
                name='organizationType'
                id='organizationType'
                value={formData.organizationType}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                required
              >
                <option value=''>Select organization type</option>
                <option value='PLC'>Private Limited Company</option>
                <option value='SC'>Share Company</option>
                <option value='SP'>Sole Proprietorship</option>
                <option value='GP'>General Partnership</option>
                <option value='LP'>Limited Partnership</option>
                <option value='COOP'>Cooperative Society</option>
                <option value='BRANCH'>Branch of a Foreign Company</option>
                <option value='JV'>Joint Venture</option>
              </select>
            </div>
          </div>

          <div className='flex justify-between'>
            <button
              type='button'
              onClick={prevStep}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all'
            >
              Previous
            </button>
            <button
              type='submit'
              disabled={
                !formData.companySize ||
                !formData.industry ||
                !formData.organizationType
              }
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all'
            >
              Create Company
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderETradeForm = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-8 h-8 text-green-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          ETrade Registration
        </h3>
        <p className='text-gray-600'>Quick registration using ETrade</p>
      </div>

      <div className='space-y-6'>
        <div>
          <label
            htmlFor='tin'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            TIN Number *
          </label>
          <input
            type='text'
            name='tin'
            id='tin'
            value={formData.tin}
            onChange={handleInputChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
            placeholder='Enter your TIN number'
            required
          />
        </div>

        <div>
          <label
            htmlFor='licenseNumber'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            License Number *
          </label>
          <input
            type='text'
            name='licenseNumber'
            id='licenseNumber'
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
            placeholder='Enter your license number'
            required
          />
        </div>
      </div>

      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => setIsCreating(false)}
          className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={!formData.tin || !formData.licenseNumber}
          className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all'
        >
          Register with ETrade
        </button>
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className='fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-white rounded-lg p-8 flex flex-col items-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            <p className='text-gray-700 font-medium'>
              Connecting to your company...
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
        <div className='relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors'
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
              {isCreating ? 'Register Your Company' : 'Select Your Company'}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              {isCreating
                ? 'Choose your registration method and complete the process'
                : employers.length === 0
                  ? "You haven't registered your company yet. Let's get you started!"
                  : 'Please select your company to continue'}
            </p>
          </div>

          {!isCreating ? (
            <>
              <div className='flex justify-center items-center'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 place-items-center'>
                  {employers.map((employer) => (
                    <div
                      key={employer.id}
                      onClick={() =>
                        !isLoading && handleEmployerSelect(employer)
                      }
                      className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-400 group p-8 transform hover:scale-105 hover:-translate-y-1 ${
                        isLoading
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <div className='w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg'>
                          <span className='text-2xl font-bold text-white'>
                            {employer?.tenant?.tradeName?.charAt(0)}
                          </span>
                        </div>
                        <h3 className='text-xl font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors mb-2'>
                          {employer?.tenant?.tradeName}
                        </h3>
                        <div className='flex items-center text-sm text-gray-500 group-hover:text-blue-500 transition-colors'>
                          <svg
                            className='w-4 h-4 mr-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                            />
                          </svg>
                          <span>Company</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-8 text-center'>
                <button
                  onClick={() => setIsCreating(true)}
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                    />
                  </svg>
                  Register New Company
                </button>
              </div>
            </>
          ) : (
            <div>
              {/* Registration Type Switcher */}
              <div className='mb-8'>
                <div className='flex bg-gray-100 rounded-lg p-1'>
                  <button
                    type='button'
                    onClick={() => handleRegistrationTypeChange('etrade')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                      registrationType === 'etrade'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className='flex items-center justify-center space-x-2'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      <span>ETrade</span>
                    </div>
                  </button>

                  <button
                    type='button'
                    onClick={() => handleRegistrationTypeChange('manual')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                      registrationType === 'manual'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className='flex items-center justify-center space-x-2'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                      <span>Manual Registration</span>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {registrationType === 'manual'
                  ? renderManualForm()
                  : renderETradeForm()}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
