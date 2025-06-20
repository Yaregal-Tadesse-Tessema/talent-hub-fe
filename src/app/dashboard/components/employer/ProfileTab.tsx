'use client';
import EditCompanyForm from '@/app/dashboard/components/employer/EditCompanyForm';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import {
  employerService,
  UpdateTenantPayload,
} from '@/services/employerService';
import { Tenant } from '@/types/employer';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiBriefcase,
  FiHome,
  FiGlobe,
  FiEdit3,
  FiX,
  FiSave,
  FiCalendar,
  FiFileText,
  FiHash,
  FiAward,
  FiUpload,
  FiCamera,
} from 'react-icons/fi';

interface CompanyAddress {
  city: string;
  region: string;
  street: string;
  country: string;
  postalCode: string;
}

interface CompanyLogo {
  path: string;
  size: number;
  filename: string;
  mimetype: string;
  bucketName: string;
  originalname?: string;
}

interface CompanyData {
  id: string;
  name: string;
  tradeName: string;
  email: string;
  phoneNumber: string;
  address: CompanyAddress;
  companySize: string;
  industry: string;
  organizationType: string;
  type: string;
  logo: CompanyLogo;
  tin: string;
  code: string;
  isVerified: boolean;
  status: string;
  subscriptionType: string;
  prefix: string;
  schemaName: string;
  licenseNumber?: string | null;
  registrationNumber?: string | null;
  isActive: boolean;
  selectedCalender?: string | null;
  archiveReason?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export default function ProfileTab() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  useEmployerChange((employer) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.selectedEmployer?.tenant) {
        setCompanyData(parsedData.selectedEmployer.tenant);
      }
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.selectedEmployer?.tenant) {
        setCompanyData(parsedData.selectedEmployer.tenant);
      }
    }
  }, []);

  // Helper function to check if a value exists and is not empty
  const hasValue = (value: any): boolean => {
    return value && value.toString().trim() !== '';
  };

  // Helper function to check if address has any valid fields
  const hasAddress = (address: CompanyAddress): boolean => {
    return (
      hasValue(address?.street) ||
      hasValue(address?.city) ||
      hasValue(address?.country)
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdateSuccess = (updatedData: Tenant) => {
    // Update local storage with new data
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.selectedEmployer?.tenant) {
        parsedData.selectedEmployer.tenant = updatedData;
        localStorage.setItem('user', JSON.stringify(parsedData));
      }
    }

    setCompanyData(updatedData as CompanyData);
    setIsEditing(false);
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !companyData) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const response = await employerService.uploadLogo(companyData.id, file);

      // Update local storage with new logo data
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.selectedEmployer?.tenant) {
          parsedData.selectedEmployer.tenant.logo = response.logo;
          localStorage.setItem('user', JSON.stringify(parsedData));
        }
      }

      // Update component state
      setCompanyData((prev) =>
        prev
          ? {
              ...prev,
              logo: response.logo,
            }
          : null,
      );

      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
      // Reset file input
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !companyData) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB for banner)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploadingBanner(true);
    try {
      const response = await employerService.uploadBanner(companyData.id, file);

      // Update local storage with new banner data
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.selectedEmployer?.tenant) {
          parsedData.selectedEmployer.tenant.banner = response.banner;
          localStorage.setItem('user', JSON.stringify(parsedData));
        }
      }

      // Update component state
      setCompanyData((prev) =>
        prev
          ? {
              ...prev,
              banner: response.banner,
            }
          : null,
      );

      alert('Banner uploaded successfully!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Failed to upload banner. Please try again.');
    } finally {
      setIsUploadingBanner(false);
      // Reset file input
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = '';
      }
    }
  };

  const triggerLogoFileInput = () => {
    logoFileInputRef.current?.click();
  };

  const triggerBannerFileInput = () => {
    bannerFileInputRef.current?.click();
  };

  if (!companyData) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditCompanyForm
        companyData={companyData}
        onCancel={handleCancel}
        onSuccess={handleUpdateSuccess}
      />
    );
  }

  return (
    <div className=' w-full max-w-6xl '>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
        {/* Header with Logo and Basic Info */}
        <div className='p-8 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-800 text-white relative'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

          <div className='flex items-center justify-between relative z-10'>
            <div className='flex items-center gap-8'>
              <div className='relative group'>
                <div className='w-28 h-28 bg-white rounded-xl overflow-hidden shadow-lg border-4 border-white/20'>
                  <img
                    src={companyData?.logo?.path}
                    alt={companyData?.name}
                    className='w-full h-full object-contain'
                  />
                </div>
                {/* Upload overlay */}
                <div className='absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                  <button
                    onClick={triggerLogoFileInput}
                    disabled={isUploadingLogo}
                    className='text-white hover:text-blue-200 transition-colors'
                    title='Upload new logo'
                  >
                    {isUploadingLogo ? (
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                    ) : (
                      <FiCamera className='w-8 h-8' />
                    )}
                  </button>
                </div>
                {/* Hidden file input for logo */}
                <input
                  ref={logoFileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleLogoUpload}
                  className='hidden'
                />
              </div>
              <div>
                <h1 className='text-3xl font-bold mb-2'>
                  {companyData.tradeName}
                </h1>
                <div className='flex items-center gap-3'>
                  <span className='px-4 py-2 bg-blue-500/80 backdrop-blur-sm rounded-full text-sm font-medium'>
                    {companyData.status}
                  </span>
                  {companyData.isVerified && (
                    <span className='px-4 py-2 bg-green-500/80 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2'>
                      <FiAward className='w-4 h-4' />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={triggerBannerFileInput}
                disabled={isUploadingBanner}
                className='px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium backdrop-blur-sm'
                title='Upload banner'
              >
                {isUploadingBanner ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                ) : (
                  <FiUpload className='w-4 h-4' />
                )}
                {isUploadingBanner ? 'Uploading...' : 'Upload Banner'}
              </button>
              <button
                onClick={handleEdit}
                className='px-6 py-3 bg-white/90 hover:bg-white text-blue-700 rounded-xl flex items-center gap-3 transition-all duration-200 font-medium shadow-lg hover:shadow-xl'
              >
                <FiEdit3 className='w-5 h-5' />
                Edit Profile
              </button>
            </div>
          </div>
          {/* Hidden file input for banner */}
          <input
            ref={bannerFileInputRef}
            type='file'
            accept='image/*'
            onChange={handleBannerUpload}
            className='hidden'
          />
        </div>

        {/* Company Details */}
        <div className='p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Contact Information */}
            {(hasAddress(companyData.address) ||
              hasValue(companyData.phoneNumber) ||
              hasValue(companyData.email)) && (
              <div className='bg-gray-50 rounded-xl p-6'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <FiMail className='w-4 h-4 text-blue-600' />
                  </div>
                  Contact Information
                </h2>
                <div className='space-y-4'>
                  {hasAddress(companyData.address) && (
                    <div className='flex items-start gap-4 text-gray-700'>
                      <FiMapPin className='w-5 h-5 text-blue-600 mt-1 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Address</p>
                        <p className='text-gray-600'>{`${companyData.address.street || ''}, ${companyData.address.city || ''}, ${companyData.address.country || ''}`}</p>
                        {hasValue(companyData.address.region) && (
                          <p className='text-gray-500 text-sm'>
                            {companyData.address.region}
                          </p>
                        )}
                        {hasValue(companyData.address.postalCode) && (
                          <p className='text-gray-500 text-sm'>
                            {companyData.address.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.phoneNumber) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiPhone className='w-5 h-5 text-blue-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Phone</p>
                        <p className='text-gray-600'>
                          {companyData.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.email) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiMail className='w-5 h-5 text-blue-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Email</p>
                        <p className='text-gray-600'>{companyData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Information */}
            {(hasValue(companyData.companySize) ||
              hasValue(companyData.industry) ||
              hasValue(companyData.organizationType) ||
              hasValue(companyData.type)) && (
              <div className='bg-gray-50 rounded-xl p-6'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                    <FiBriefcase className='w-4 h-4 text-green-600' />
                  </div>
                  Company Information
                </h2>
                <div className='space-y-4'>
                  {hasValue(companyData.companySize) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiUsers className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Company Size</p>
                        <p className='text-gray-600'>
                          {companyData.companySize}
                        </p>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.industry) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiBriefcase className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Industry</p>
                        <p className='text-gray-600'>{companyData.industry}</p>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.organizationType) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiHome className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Organization Type</p>
                        <p className='text-gray-600'>
                          {companyData.organizationType}
                        </p>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.type) && (
                    <div className='flex items-center gap-4 text-gray-700'>
                      <FiGlobe className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Company Type</p>
                        <p className='text-gray-600'>{companyData.type}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {(hasValue(companyData.tin) ||
            hasValue(companyData.code) ||
            hasValue(companyData.subscriptionType) ||
            hasValue(companyData.licenseNumber) ||
            hasValue(companyData.registrationNumber) ||
            hasValue(companyData.selectedCalender)) && (
            <div className='mt-8 bg-gray-50 rounded-xl p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <FiFileText className='w-4 h-4 text-purple-600' />
                </div>
                Additional Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {hasValue(companyData.tin) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiHash className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        TIN Number
                      </p>
                      <p className='text-gray-800'>{companyData.tin}</p>
                    </div>
                  </div>
                )}
                {hasValue(companyData.code) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiHash className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        Company Code
                      </p>
                      <p className='text-gray-800'>{companyData.code}</p>
                    </div>
                  </div>
                )}
                {hasValue(companyData.subscriptionType) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiAward className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        Subscription Type
                      </p>
                      <p className='text-gray-800'>
                        {companyData.subscriptionType}
                      </p>
                    </div>
                  </div>
                )}
                {hasValue(companyData.licenseNumber) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiFileText className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        License Number
                      </p>
                      <p className='text-gray-800'>
                        {companyData.licenseNumber}
                      </p>
                    </div>
                  </div>
                )}
                {hasValue(companyData.registrationNumber) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiFileText className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        Registration Number
                      </p>
                      <p className='text-gray-800'>
                        {companyData.registrationNumber}
                      </p>
                    </div>
                  </div>
                )}
                {hasValue(companyData.selectedCalender) && (
                  <div className='flex items-center gap-3 text-gray-700'>
                    <FiCalendar className='w-5 h-5 text-purple-600 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-sm text-gray-500'>
                        Calendar
                      </p>
                      <p className='text-gray-800'>
                        {companyData.selectedCalender}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
