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
    companySize: '',
    industry: '',
    organizationType: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    tradeName: '',
    email: '',
    phoneNumber: '',
    tin: '',
    licenseNumber: '',
    companySize: '',
    industry: '',
    organizationType: '',
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    tradeName: false,
    email: false,
    phoneNumber: false,
    tin: false,
    licenseNumber: false,
    companySize: false,
    industry: false,
    organizationType: false,
  });

  if (!isOpen) return null;

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Company name is required';
        if (value.trim().length < 2)
          return 'Company name must be at least 2 characters';
        return '';
      case 'tradeName':
        if (!value.trim()) return 'Trading name is required';
        if (value.trim().length < 2)
          return 'Trading name must be at least 2 characters';
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'phoneNumber':
        if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        return '';
      case 'tin':
        if (!value.trim()) return 'TIN number is required';
        if (value.trim().length < 5)
          return 'TIN number must be at least 5 characters';
        return '';
      case 'licenseNumber':
        if (!value.trim()) return 'License number is required';
        if (value.trim().length < 3)
          return 'License number must be at least 3 characters';
        return '';
      case 'companySize':
        if (!value) return 'Company size is required';
        return '';
      case 'industry':
        if (!value) return 'Industry is required';
        return '';
      case 'organizationType':
        if (!value) return 'Organization type is required';
        return '';
      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    let isValid = true;
    const errors = { ...formErrors };

    if (step === 1) {
      // Validate required fields for step 1
      const requiredFields = ['name', 'tradeName'];
      requiredFields.forEach((field) => {
        const error = validateField(
          field,
          formData[field as keyof typeof formData],
        );
        errors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });

      // Validate optional fields if they have values
      ['email', 'phoneNumber'].forEach((field) => {
        if (formData[field as keyof typeof formData]) {
          const error = validateField(
            field,
            formData[field as keyof typeof formData],
          );
          errors[field as keyof typeof errors] = error;
          if (error) isValid = false;
        }
      });

      // At least email or phone is required
      if (!formData.email && !formData.phoneNumber) {
        errors.email = 'Either email or phone number is required';
        errors.phoneNumber = 'Either email or phone number is required';
        isValid = false;
      } else if (formData.email || formData.phoneNumber) {
        // Clear the "either required" error if one is provided
        if (formData.email && !errors.email) errors.email = '';
        if (formData.phoneNumber && !errors.phoneNumber)
          errors.phoneNumber = '';
      }
    } else if (step === 2) {
      // Validate required fields for step 2
      const requiredFields = ['tin', 'licenseNumber'];
      requiredFields.forEach((field) => {
        const error = validateField(
          field,
          formData[field as keyof typeof formData],
        );
        errors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });
    } else if (step === 3) {
      // Validate required fields for step 3
      const requiredFields = ['companySize', 'industry', 'organizationType'];
      requiredFields.forEach((field) => {
        const error = validateField(
          field,
          formData[field as keyof typeof formData],
        );
        errors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on change if it's been touched
    if (touchedFields[name as keyof typeof touchedFields] || value !== '') {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // Special handling for email/phone requirement
      if (name === 'email' || name === 'phoneNumber') {
        if (
          (name === 'email' && value && !formData.phoneNumber) ||
          (name === 'phoneNumber' && value && !formData.email)
        ) {
          setFormErrors((prev) => ({
            ...prev,
            email: name === 'email' && value ? '' : prev.email,
            phoneNumber:
              name === 'phoneNumber' && value ? '' : prev.phoneNumber,
          }));
        }
      }
    }
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
      // Validate ETrade fields
      const errors = { ...formErrors };
      let isValid = true;

      ['tin', 'licenseNumber'].forEach((field) => {
        const error = validateField(
          field,
          formData[field as keyof typeof formData],
        );
        errors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });

      setFormErrors(errors);
      if (!isValid) return;

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
      // Validate all steps for manual registration
      const isStep1Valid = validateStep(1);
      const isStep2Valid = validateStep(2);
      const isStep3Valid = validateStep(3);

      if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
        // Go to the first invalid step
        if (!isStep1Valid) setCurrentStep(1);
        else if (!isStep2Valid) setCurrentStep(2);
        else if (!isStep3Valid) setCurrentStep(3);
        return;
      }

      // Manual registration API call using service
      try {
        const data = await employerService.createTenant({
          name: formData.name,
          tradeName: formData.tradeName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          tin: formData.tin,
          licenseNumber: formData.licenseNumber,
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
      companySize: '',
      industry: '',
      organizationType: '',
    });
    setFormErrors({
      name: '',
      tradeName: '',
      email: '',
      phoneNumber: '',
      tin: '',
      licenseNumber: '',
      companySize: '',
      industry: '',
      organizationType: '',
    });
    setTouchedFields({
      name: false,
      tradeName: false,
      email: false,
      phoneNumber: false,
      tin: false,
      licenseNumber: false,
      companySize: false,
      industry: false,
      organizationType: false,
    });
    setCurrentStep(1);
  };

  const handleRegistrationTypeChange = (type: RegistrationType) => {
    setRegistrationType(type);
    resetForm();
  };

  const nextStep = () => {
    if (currentStep < 3 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reusable input component with error handling
  const FormInput = ({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
    className = '',
    ...props
  }: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    [key: string]: any;
  }) => {
    const hasError =
      touchedFields[name as keyof typeof touchedFields] &&
      formErrors[name as keyof typeof formErrors];

    return (
      <div className={className}>
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
          }`}
          placeholder={placeholder}
          {...props}
        />
        {hasError && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <svg
              className='w-4 h-4 mr-1 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {formErrors[name as keyof typeof formErrors]}
          </p>
        )}
      </div>
    );
  };

  // Reusable select component with error handling
  const FormSelect = ({
    name,
    label,
    placeholder,
    required = false,
    className = '',
    children,
    ...props
  }: {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => {
    const hasError =
      touchedFields[name as keyof typeof touchedFields] &&
      formErrors[name as keyof typeof formErrors];

    return (
      <div className={className}>
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
        <select
          name={name}
          id={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
          }`}
          {...props}
        >
          {placeholder && <option value=''>{placeholder}</option>}
          {children}
        </select>
        {hasError && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <svg
              className='w-4 h-4 mr-1 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {formErrors[name as keyof typeof formErrors]}
          </p>
        )}
      </div>
    );
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
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-blue-600'
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
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Basic Information
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Let's start with your company's basic details. We'll need at least
              your company name and one way to contact you.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <FormInput
              name='name'
              label='Company Name'
              placeholder='Enter your company name'
              required
            />

            <FormInput
              name='tradeName'
              label='Trading Name'
              placeholder='Enter trading name'
              required
            />

            <FormInput
              name='email'
              label='Email Address'
              type='email'
              placeholder='company@example.com'
            />

            <FormInput
              name='phoneNumber'
              label='Phone Number'
              type='tel'
              placeholder='+1234567890'
            />
          </div>

          {!formData.email && !formData.phoneNumber && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
              <div className='flex'>
                <svg
                  className='w-5 h-5 text-amber-400 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-amber-700'>
                  Please provide either an email address or phone number so we
                  can contact you.
                </p>
              </div>
            </div>
          )}

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={nextStep}
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium'
            >
              Continue to Legal Information
              <svg
                className='w-5 h-5 ml-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Legal Information */}
      {currentStep === 2 && (
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
              Legal Information
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Provide your company's legal registration details to verify your
              business
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <FormInput
              name='tin'
              label='TIN Number'
              placeholder='Enter TIN number'
              required
            />

            <FormInput
              name='licenseNumber'
              label='License Number'
              placeholder='Enter license number'
              required
            />
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex'>
              <svg
                className='w-5 h-5 text-blue-400 mr-3 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <h4 className='text-sm font-medium text-blue-800 mb-1'>
                  Legal Documentation Required
                </h4>
                <p className='text-sm text-blue-700'>
                  Your TIN and License numbers will be used to verify your
                  business registration and ensure compliance with local
                  regulations.
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <button
              type='button'
              onClick={prevStep}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium'
            >
              <svg
                className='w-5 h-5 mr-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 17l-5-5m0 0l5-5m-5 5h12'
                />
              </svg>
              Back to Basic Info
            </button>
            <button
              type='button'
              onClick={nextStep}
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium'
            >
              Continue to Company Details
              <svg
                className='w-5 h-5 ml-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Company Details */}
      {currentStep === 3 && (
        <div className='space-y-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-purple-600'
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
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Company Details
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Tell us more about your organization to help us better serve your
              needs
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <FormSelect
              name='companySize'
              label='Company Size'
              placeholder='Select company size'
              required
            >
              <option value='1-10'>1-10 employees</option>
              <option value='11-50'>11-50 employees</option>
              <option value='51-200'>51-200 employees</option>
              <option value='201-500'>201-500 employees</option>
              <option value='501+'>501+ employees</option>
            </FormSelect>

            <FormSelect
              name='industry'
              label='Industry'
              placeholder='Select industry'
              required
            >
              <option value='Technology And IT'>Technology And IT</option>
              <option value='Healthcare And Medicine'>
                Healthcare And Medicine
              </option>
              <option value='Engineering Construction'>
                Engineering Construction
              </option>
              <option value='Finance And Business'>Finance And Business</option>
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
            </FormSelect>

            <FormSelect
              name='organizationType'
              label='Organization Type'
              placeholder='Select organization type'
              required
              className='sm:col-span-2'
            >
              <option value='PLC'>Private Limited Company</option>
              <option value='SC'>Share Company</option>
              <option value='SP'>Sole Proprietorship</option>
              <option value='GP'>General Partnership</option>
              <option value='LP'>Limited Partnership</option>
              <option value='COOP'>Cooperative Society</option>
              <option value='BRANCH'>Branch of a Foreign Company</option>
              <option value='JV'>Joint Venture</option>
            </FormSelect>
          </div>

          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex'>
              <svg
                className='w-5 h-5 text-green-400 mr-3 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <h4 className='text-sm font-medium text-green-800 mb-1'>
                  Almost Done!
                </h4>
                <p className='text-sm text-green-700'>
                  Once you complete this step, your company will be registered
                  and you can start posting jobs and finding talent.
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <button
              type='button'
              onClick={prevStep}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium'
            >
              <svg
                className='w-5 h-5 mr-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 17l-5-5m0 0l5-5m-5 5h12'
                />
              </svg>
              Back to Legal Info
            </button>
            <button
              type='submit'
              className='px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg'
            >
              <svg
                className='w-5 h-5 mr-2 inline'
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
        <p className='text-gray-600 max-w-md mx-auto'>
          Quick registration using your existing ETrade business information
        </p>
      </div>

      <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
        <div className='flex'>
          <svg
            className='w-5 h-5 text-green-400 mr-3 flex-shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          <div>
            <h4 className='text-sm font-medium text-green-800 mb-1'>
              Fast Track Registration
            </h4>
            <p className='text-sm text-green-700'>
              We'll automatically fetch your company details from the ETrade
              system using your TIN and License number.
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <FormInput
          name='tin'
          label='TIN Number'
          placeholder='Enter your TIN number'
          required
          className='focus:ring-green-500 focus:border-green-500'
        />

        <FormInput
          name='licenseNumber'
          label='License Number'
          placeholder='Enter your license number'
          required
          className='focus:ring-green-500 focus:border-green-500'
        />
      </div>

      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => setIsCreating(false)}
          className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg'
        >
          <svg
            className='w-5 h-5 mr-2 inline'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
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
                : !Array.isArray(employers) || employers.length === 0
                  ? "You haven't registered your company yet. Let's get you started!"
                  : 'Please select your company to continue'}
            </p>
          </div>

          {!isCreating ? (
            <>
              <div className='flex justify-center items-center'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 place-items-center'>
                  {Array.isArray(employers) &&
                    employers.map((employer) => (
                      <div
                        key={employer?.id}
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
