'use client';
import {
  employerService,
  UpdateTenantPayload,
} from '@/services/employerService';
import { Tenant } from '@/types/employer';
import { useToast } from '@/contexts/ToastContext';
import React, { useState } from 'react';
import {
  FiX,
  FiSave,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiBriefcase,
  FiHome,
  FiGlobe,
  FiHash,
  FiFileText,
  FiCalendar,
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

interface EditCompanyFormProps {
  companyData: CompanyData;
  onCancel: () => void;
  onSuccess: (updatedData: Tenant) => void;
}

export default function EditCompanyForm({
  companyData,
  onCancel,
  onSuccess,
}: EditCompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyData>>({
    ...companyData,
    address: { ...companyData.address },
  });
  const { showToast } = useToast();
  console.log('companyData', companyData);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: UpdateTenantPayload = {
        id: companyData.id,
        prefix: formData.prefix || companyData.prefix,
        name: formData.name || companyData.name,
        schemaName: formData.schemaName || companyData.schemaName,
        type: formData.type || companyData.type,
        tradeName: formData.tradeName || companyData.tradeName,
        email: formData.email || companyData.email,
        code: formData.code || companyData.code,
        phoneNumber: formData.phoneNumber || companyData.phoneNumber,
        address: formData.address || companyData.address,
        subscriptionType:
          formData.subscriptionType || companyData.subscriptionType,
        isVerified: companyData.isVerified,
        tin: formData.tin || companyData.tin,
        licenseNumber:
          formData.licenseNumber || companyData.licenseNumber || '',
        registrationNumber:
          formData.registrationNumber || companyData.registrationNumber || '',
        isActive: companyData.isActive,
        status: formData.status || companyData.status,
        logo: {
          ...companyData.logo,
          originalname:
            companyData.logo.originalname || companyData.logo.filename,
        },
        companySize: formData.companySize || companyData.companySize,
        industry: formData.industry || companyData.industry,
        organizationType:
          formData.organizationType || companyData.organizationType,
        selectedCalender:
          formData.selectedCalender || companyData.selectedCalender || '',
        archiveReason:
          formData.archiveReason || companyData.archiveReason || '',
      };

      const updatedTenant = await employerService.updateTenant(payload);
      onSuccess(updatedTenant);
    } catch (error) {
      console.error('Error updating company:', error);
      showToast({
        type: 'error',
        message: 'Failed to update company information. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-6xl'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
        {/* Header */}
        <div className='p-8 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-800 text-white relative'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

          <div className='flex items-center justify-between relative z-10'>
            <h1 className='text-3xl font-bold'>Edit Company Profile</h1>
            <div className='flex gap-3'>
              <button
                onClick={onCancel}
                className='px-6 py-3 bg-white/20 hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-all duration-200 font-medium backdrop-blur-sm'
              >
                <FiX className='w-5 h-5' />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className='px-6 py-3 bg-green-600/80 hover:bg-green-600 disabled:bg-gray-500 rounded-xl flex items-center gap-3 transition-all duration-200 font-medium backdrop-blur-sm'
              >
                <FiSave className='w-5 h-5' />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className='p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Basic Information */}
            <div className='bg-gray-50 rounded-xl p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <FiMail className='w-4 h-4 text-blue-600' />
                </div>
                Basic Information
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Company Name
                  </label>
                  <input
                    type='text'
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter company name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Trade Name
                  </label>
                  <input
                    type='text'
                    value={formData.tradeName || ''}
                    onChange={(e) =>
                      handleInputChange('tradeName', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter trade name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter email address'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={formData.phoneNumber || ''}
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter phone number'
                  />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className='bg-gray-50 rounded-xl p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <FiBriefcase className='w-4 h-4 text-green-600' />
                </div>
                Company Details
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Company Size
                  </label>
                  <select
                    value={formData.companySize || ''}
                    onChange={(e) =>
                      handleInputChange('companySize', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  >
                    <option value=''>Select Company Size</option>
                    <option value='1-10'>1-10 employees</option>
                    <option value='11-50'>11-50 employees</option>
                    <option value='51-200'>51-200 employees</option>
                    <option value='201-500'>201-500 employees</option>
                    <option value='501-1000'>501-1000 employees</option>
                    <option value='1000+'>1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Industry
                  </label>
                  <input
                    type='text'
                    value={formData.industry || ''}
                    onChange={(e) =>
                      handleInputChange('industry', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter industry'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Organization Type
                  </label>
                  <input
                    type='text'
                    value={formData.organizationType || ''}
                    onChange={(e) =>
                      handleInputChange('organizationType', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter organization type'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Company Type
                  </label>
                  <input
                    type='text'
                    value={formData.type || ''}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder='Enter company type'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className='mt-8 bg-gray-50 rounded-xl p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
              <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
                <FiMapPin className='w-4 h-4 text-orange-600' />
              </div>
              Address Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Street Address
                </label>
                <input
                  type='text'
                  value={formData.address?.street || ''}
                  onChange={(e) =>
                    handleAddressChange('street', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter street address'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  value={formData.address?.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter city'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Region/State
                </label>
                <input
                  type='text'
                  value={formData.address?.region || ''}
                  onChange={(e) =>
                    handleAddressChange('region', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter region/state'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  value={formData.address?.country || ''}
                  onChange={(e) =>
                    handleAddressChange('country', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter country'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Postal Code
                </label>
                <input
                  type='text'
                  value={formData.address?.postalCode || ''}
                  onChange={(e) =>
                    handleAddressChange('postalCode', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter postal code'
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='mt-8 bg-gray-50 rounded-xl p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
              <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                <FiFileText className='w-4 h-4 text-purple-600' />
              </div>
              Additional Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  TIN Number
                </label>
                <input
                  type='text'
                  value={formData.tin || ''}
                  onChange={(e) => handleInputChange('tin', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter TIN number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Company Code
                </label>
                <input
                  type='text'
                  value={formData.code || ''}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter company code'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  License Number
                </label>
                <input
                  type='text'
                  value={formData.licenseNumber || ''}
                  onChange={(e) =>
                    handleInputChange('licenseNumber', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter license number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Registration Number
                </label>
                <input
                  type='text'
                  value={formData.registrationNumber || ''}
                  onChange={(e) =>
                    handleInputChange('registrationNumber', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  placeholder='Enter registration number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Calendar Type
                </label>
                <select
                  value={formData.selectedCalender || ''}
                  onChange={(e) =>
                    handleInputChange('selectedCalender', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                >
                  <option value=''>Select Calendar</option>
                  <option value='Gregorian'>Gregorian</option>
                  <option value='Ethiopian'>Ethiopian</option>
                  <option value='Islamic'>Islamic</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
