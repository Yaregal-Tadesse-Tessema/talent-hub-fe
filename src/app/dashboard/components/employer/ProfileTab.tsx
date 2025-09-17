'use client';
import EditCompanyForm from '@/app/dashboard/components/employer/EditCompanyForm';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import {
  employerService,
  UpdateTenantPayload,
} from '@/services/employerService';
import { Tenant } from '@/types/employer';
import { useToast } from '@/contexts/ToastContext';
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
  FiCheck,
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
  cover?: CompanyLogo;
  banner?: CompanyLogo;
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
  const { showToast } = useToast();

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
      showToast({
        type: 'error',
        message: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showToast({ type: 'error', message: 'File size must be less than 5MB' });
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

      showToast({ type: 'success', message: 'Logo uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading logo:', error);
      showToast({
        type: 'error',
        message: 'Failed to upload logo. Please try again.',
      });
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
      showToast({
        type: 'error',
        message: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
      });
      return;
    }

    // Validate file size (max 10MB for banner)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast({ type: 'error', message: 'File size must be less than 10MB' });
      return;
    }

    setIsUploadingBanner(true);
    try {
      const response = await employerService.uploadBanner(companyData.id, file);
      console.log('response', response);

      // Update local storage with new banner data
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.selectedEmployer?.tenant) {
          parsedData.selectedEmployer.tenant.cover = response.cover;
          localStorage.setItem('user', JSON.stringify(parsedData));
        }
      }

      // Update component state
      setCompanyData((prev) =>
        prev
          ? {
              ...prev,
              cover: response.cover,
            }
          : null,
      );

      showToast({ type: 'success', message: 'Banner uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading banner:', error);
      showToast({
        type: 'error',
        message: 'Failed to upload banner. Please try again.',
      });
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
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
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
    <div className='w-full max-w-7xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50'>
        {/* Compact Header with Logo and Basic Info */}
        <div
          className={`relative overflow-hidden transition-all duration-700 ${companyData?.cover?.path ? 'h-[130px]' : 'h-[120px]'}`}
          style={{
            backgroundImage: companyData?.cover?.path
              ? `linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.4) 50%, rgba(30, 64, 175, 0.5) 100%), url(${companyData.cover.path})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Subtle background elements */}
          <div className='absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12'></div>
          <div className='absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10'></div>

          {/* Content container */}
          <div className='relative z-10 p-4'>
            <div className='flex items-center justify-between h-full'>
              {/* Company info section */}
              <div className='flex items-center gap-4'>
                {/* Compact logo container */}
                <div className='relative group'>
                  <div className='w-20 h-20 bg-white rounded-xl overflow-hidden shadow-lg border-2 border-white/30 backdrop-blur-sm transform transition-all duration-300 group-hover:scale-105'>
                    <img
                      src={companyData?.logo?.path}
                      alt={companyData?.name}
                      className='w-full h-full object-contain p-1'
                    />
                  </div>
                  {/* Upload overlay */}
                  <div className='absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center'>
                    <button
                      onClick={triggerLogoFileInput}
                      disabled={isUploadingLogo}
                      className='text-white hover:text-blue-200 transition-all duration-300'
                      title='Upload new logo'
                    >
                      {isUploadingLogo ? (
                        <div className='animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent'></div>
                      ) : (
                        <FiCamera className='w-6 h-6' />
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

                {/* Company details */}
                <div className='space-y-2'>
                  <div>
                    <h1 className='text-xl lg:text-2xl font-bold text-white drop-shadow-lg'>
                      {companyData.tradeName}
                    </h1>
                    {companyData.name !== companyData.tradeName &&
                      companyData.name && (
                        <p className='text-white/80 text-sm font-medium'>
                          {companyData.name}
                        </p>
                      )}
                  </div>

                  {/* Compact status badges */}
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='px-3 py-1 bg-gradient-to-r from-blue-500/90 to-blue-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md border border-white/20'>
                      {companyData.status}
                    </span>
                    {companyData.isVerified && (
                      <span className='px-3 py-1 bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-md border border-white/20'>
                        <FiAward className='w-3 h-3' />
                        Verified
                      </span>
                    )}
                    {companyData.subscriptionType && (
                      <span className='px-3 py-1 bg-gradient-to-r from-purple-500/90 to-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md border border-white/20'>
                        {companyData.subscriptionType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact action buttons */}
              <div className='flex gap-2'>
                <button
                  onClick={triggerBannerFileInput}
                  disabled={isUploadingBanner}
                  className='px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-all duration-300 font-medium backdrop-blur-md border border-white/30 text-white text-sm'
                  title={
                    companyData?.cover?.path ? 'Change banner' : 'Upload banner'
                  }
                >
                  {isUploadingBanner ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                  ) : companyData?.cover?.path ? (
                    <FiCheck className='w-4 h-4' />
                  ) : (
                    <FiUpload className='w-4 h-4' />
                  )}
                  <span className='hidden sm:inline'>
                    {isUploadingBanner
                      ? 'Uploading...'
                      : companyData?.cover?.path
                        ? 'Change'
                        : 'Upload'}
                  </span>
                </button>
                <button
                  onClick={handleEdit}
                  className='px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 rounded-lg flex items-center gap-2 transition-all duration-300 font-medium shadow-lg text-sm'
                >
                  <FiEdit3 className='w-4 h-4' />
                  <span className='hidden sm:inline'>Edit</span>
                </button>
              </div>
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

        {/* Enhanced Company Details Section */}
        <div className='p-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-900'>
          {/* Quick Stats Bar */}
          <div className='mb-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
            {hasValue(companyData.companySize) && (
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                    <FiUsers className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                      Team Size
                    </p>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>
                      {companyData.companySize}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {hasValue(companyData.industry) && (
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center'>
                    <FiBriefcase className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                      Industry
                    </p>
                    <p className='text-sm font-bold text-gray-900 dark:text-white truncate'>
                      {companyData.industry}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {hasValue(companyData.type) && (
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center'>
                    <FiGlobe className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                      Type
                    </p>
                    <p className='text-sm font-bold text-gray-900 dark:text-white truncate'>
                      {companyData.type}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {companyData.isVerified && (
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center'>
                    <FiAward className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                      Status
                    </p>
                    <p className='text-sm font-bold text-green-600 dark:text-green-400'>
                      Verified
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
            {/* Contact Information - Enhanced Card */}
            {(hasAddress(companyData.address) ||
              hasValue(companyData.phoneNumber) ||
              hasValue(companyData.email)) && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                    <FiMail className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                      Contact
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Get in touch with us
                    </p>
                  </div>
                </div>
                <div className='space-y-5'>
                  {hasAddress(companyData.address) && (
                    <div className='group'>
                      <div className='flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-200'>
                          <FiMapPin className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Address
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                            {[
                              companyData.address.street,
                              companyData.address.city,
                              companyData.address.country,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.phoneNumber) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-200'>
                          <FiPhone className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Phone
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm'>
                            {companyData.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.email) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-200'>
                          <FiMail className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Email
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm'>
                            {companyData.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Information - Enhanced Card */}
            {hasValue(companyData.organizationType) && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg'>
                    <FiBriefcase className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                      Organization
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Company structure & type
                    </p>
                  </div>
                </div>
                <div className='space-y-5'>
                  {hasValue(companyData.organizationType) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors duration-200'>
                          <FiHome className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Organization Type
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm'>
                            {companyData.organizationType}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration & Legal Info - New Consolidated Card */}
            {(hasValue(companyData.tin) ||
              hasValue(companyData.code) ||
              hasValue(companyData.licenseNumber) ||
              hasValue(companyData.registrationNumber)) && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                    <FiFileText className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                      Legal Info
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Registration & identification
                    </p>
                  </div>
                </div>
                <div className='space-y-5'>
                  {hasValue(companyData.tin) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200'>
                          <FiHash className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            TIN Number
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm font-mono'>
                            {companyData.tin}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.code) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200'>
                          <FiHash className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Company Code
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm font-mono'>
                            {companyData.code}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.licenseNumber) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200'>
                          <FiFileText className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            License Number
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm font-mono'>
                            {companyData.licenseNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {hasValue(companyData.registrationNumber) && (
                    <div className='group'>
                      <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200'>
                          <FiFileText className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-800 dark:text-white text-sm'>
                            Registration Number
                          </p>
                          <p className='text-gray-600 dark:text-gray-300 text-sm font-mono'>
                            {companyData.registrationNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Company Timeline & Additional Info Footer */}
          {hasValue(companyData.selectedCalender) && (
            <div className='mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-600'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <FiCalendar className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                    Calendar Integration
                  </h2>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Connected scheduling system
                  </p>
                </div>
              </div>
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700'>
                <p className='text-gray-600 dark:text-gray-300 font-medium'>
                  {companyData.selectedCalender}
                </p>
              </div>
            </div>
          )}

          {/* Company Timeline Footer */}
          <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between flex-col sm:flex-row gap-4 text-sm text-gray-500 dark:text-gray-400'>
              <div className='flex items-center gap-6'>
                {hasValue(companyData.createdAt) && (
                  <div className='flex items-center gap-2'>
                    <FiCalendar className='w-4 h-4' />
                    <span>
                      Founded:{' '}
                      {new Date(companyData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {hasValue(companyData.updatedAt) && (
                  <div className='flex items-center gap-2'>
                    <FiEdit3 className='w-4 h-4' />
                    <span>
                      Updated:{' '}
                      {new Date(companyData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2 text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                <span>Profile Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
