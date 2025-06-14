'use client';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import React, { useEffect, useState } from 'react';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiBriefcase,
  FiHome,
  FiGlobe,
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
}

interface CompanyData {
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
}

export default function ProfileTab() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

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

  if (!companyData) {
    return (
      <div className='flex items-center justify-center h-full'>Loading...</div>
    );
  }

  return (
    <div className='p-6 w-full'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Header with Logo and Basic Info */}
        <div className='p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
          <div className='flex items-center gap-6'>
            <div className='w-24 h-24 bg-white rounded-lg overflow-hidden'>
              <img
                src={companyData?.logo?.path}
                alt={companyData?.name}
                className='w-full h-full object-contain'
              />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>{companyData.tradeName}</h1>
              <p className='text-blue-100'>{companyData.name}</p>
              <div className='flex items-center gap-2 mt-2'>
                <span className='px-3 py-1 bg-blue-500 rounded-full text-sm'>
                  {companyData.status}
                </span>
                {companyData.isVerified && (
                  <span className='px-3 py-1 bg-green-500 rounded-full text-sm'>
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Contact Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                Contact Information
              </h2>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiMapPin className='w-5 h-5 text-blue-600' />
                <span>{`${companyData.address.street}, ${companyData.address.city}, ${companyData.address.country}`}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiPhone className='w-5 h-5 text-blue-600' />
                <span>{companyData.phoneNumber}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiMail className='w-5 h-5 text-blue-600' />
                <span>{companyData.email}</span>
              </div>
            </div>

            {/* Company Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                Company Information
              </h2>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiUsers className='w-5 h-5 text-blue-600' />
                <span>{companyData.companySize}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiBriefcase className='w-5 h-5 text-blue-600' />
                <span>{companyData.industry}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiHome className='w-5 h-5 text-blue-600' />
                <span>{companyData.organizationType}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <FiGlobe className='w-5 h-5 text-blue-600' />
                <span>{companyData.type}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='mt-8 pt-6 border-t'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Additional Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <p className='text-sm text-gray-500'>TIN Number</p>
                <p className='text-gray-800'>{companyData.tin}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Company Code</p>
                <p className='text-gray-800'>{companyData.code}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Subscription Type</p>
                <p className='text-gray-800'>{companyData.subscriptionType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
