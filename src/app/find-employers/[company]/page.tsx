'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { employerService } from '@/services/employerService';
import { jobService } from '@/services/jobService';
import { Tenant } from '@/types/employer';
import { Job } from '@/types/job';

export default function EmployerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.company as string;

  const [company, setCompany] = useState<Tenant | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch company data
        const companyData = await employerService.getTenantById(companyId);
        setCompany(companyData);
        console.log('Company Data:', companyData);
        console.log('Logo:', companyData?.logo);
        console.log('Logo path:', companyData?.logo?.path);

        // Fetch jobs for this company
        const jobsData = await jobService.getJobsByTenant(companyId);
        setJobs(jobsData.items || []);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  // Debug effect to log company changes
  useEffect(() => {
    if (company) {
      console.log('Company state updated:', company);
      console.log('Logo in state:', company.logo);
      console.log('Logo path in state:', company.logo?.path);
    }
  }, [company]);

  // Helper function to format salary range
  const formatSalaryRange = (salaryRange: any): string => {
    if (!salaryRange) return 'Salary not specified';

    if (typeof salaryRange === 'string') {
      return salaryRange;
    }

    if (typeof salaryRange === 'object' && salaryRange.min && salaryRange.max) {
      return `${salaryRange.min}-${salaryRange.max}`;
    }

    if (typeof salaryRange === 'object' && salaryRange.min) {
      return `${salaryRange.min}+`;
    }

    return 'Salary not specified';
  };

  // Helper function to get image URL
  const getImageUrl = (path: string | undefined): string => {
    console.log('getImageUrl called with path:', path);

    if (!path) {
      console.log('No path provided, returning default logo');
      return '/images/default-company-logo.png';
    }

    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      console.log('Full URL detected, returning as is:', path);
      return path;
    }

    // If it's a relative path, prepend the API base URL
    if (path.startsWith('/')) {
      const fullUrl = `http://138.197.105.31:3010${path}`;
      console.log('Relative path detected, prepending API base URL:', fullUrl);
      return fullUrl;
    }

    // If it doesn't start with /, prepend the API base URL with /
    const fullUrl = `http://138.197.105.31:3010/${path}`;
    console.log('Path without /, prepending API base URL with /:', fullUrl);
    return fullUrl;
  };

  // Function to scroll to open positions section
  const scrollToOpenPositions = () => {
    const openPositionsSection = document.getElementById('open-positions');
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen pb-16 bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className='min-h-screen pb-16 bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-xl mb-2'>⚠️</div>
          <p className='text-gray-600'>{error || 'Company not found'}</p>
          <button
            onClick={() => window.history.back()}
            className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pb-16 bg-gray-50'>
      {/* Page title and breadcrumb */}
      <div className='flex justify-between bg-gray-100 items-center px-16 py-4'>
        <nav className='text-gray-400 text-sm flex items-center gap-1'>
          <button
            onClick={() => router.push('/find-employers')}
            className='hover:text-gray-600 cursor-pointer'
          >
            Employers
          </button>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 font-medium'>{company.name}</span>
        </nav>
      </div>

      {/* Top Banner */}
      <div
        className='w-full px-16 h-56 bg-cover bg-center'
        style={{
          backgroundImage: company.cover?.path
            ? `url(${getImageUrl(company.cover.path)})`
            : 'repeating-linear-gradient(90deg, #000 0 60px, #fff 60px 120px)',
        }}
      />

      {/* Card with logo, name, industry, button */}
      <div className='max-w-5xl mx-auto -mt-16'>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-6'>
          <div className='w-20 h-20 rounded-lg bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center overflow-hidden'>
            {(() => {
              const imageUrl = getImageUrl(company?.logo?.path);
              console.log('Setting image src to:', imageUrl);
              return (
                <img
                  src={imageUrl}
                  alt={company?.name}
                  className='w-full h-full object-contain'
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    console.error('Failed URL was:', e.currentTarget.src);
                    e.currentTarget.src = '/images/default-company-logo.png';
                  }}
                />
              );
            })()}
          </div>
          <div className='flex-1'>
            <div className='font-semibold text-xl'>{company.name}</div>
            <div className='text-gray-500 text-sm'>
              {company.industry || 'Information Technology (IT)'}
            </div>
          </div>
          <button
            onClick={scrollToOpenPositions}
            className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'
          >
            View Open Position
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-5xl mx-auto mt-8 flex gap-8'>
        {/* Left: Description, Benefits, Vision */}
        <div className='flex-1'>
          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Description</div>
            <div className='text-gray-600 text-sm leading-relaxed'>
              {company.tradeName ? (
                <>
                  <strong>Trade Name:</strong> {company.tradeName}
                  <br />
                  <br />
                </>
              ) : null}
              No description available for this company.
            </div>
          </div>

          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Company Benefits</div>
            <ul className='list-disc pl-6 text-gray-600 text-sm space-y-1'>
              <li>Competitive salary and benefits package</li>
              <li>Professional development opportunities</li>
              <li>Flexible work arrangements</li>
              <li>Health and wellness programs</li>
              <li>Team building activities</li>
            </ul>
          </div>

          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Company Vision</div>
            <div className='text-gray-600 text-sm leading-relaxed'>
              To be a leading organization in our industry, fostering innovation
              and growth while creating value for our stakeholders and
              contributing positively to society.
            </div>
          </div>

          <div className='flex gap-2 items-center mt-4'>
            <span className='text-gray-500 text-sm'>Share profile:</span>
            <button className='bg-blue-100 text-blue-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Facebook
            </button>
            <button className='bg-blue-100 text-blue-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Twitter
            </button>
            <button className='bg-red-100 text-red-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Pinterest
            </button>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className='w-96 flex flex-col gap-6'>
          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='flex justify-between mb-2'>
              <div>
                <div className='text-xs text-gray-400'>FOUNDED IN:</div>
                <div className='font-medium'>
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-400'>ORGANIZATION TYPE</div>
                <div className='font-medium'>
                  {company.organizationType || 'N/A'}
                </div>
              </div>
            </div>
            <div className='flex justify-between mt-4'>
              <div>
                <div className='text-xs text-gray-400'>TEAM SIZE</div>
                <div className='font-medium'>
                  {company.companySize || 'N/A'}
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-400'>INDUSTRY TYPES</div>
                <div className='font-medium'>{company.industry || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='font-semibold mb-2'>Contact Information</div>
            {company.address?.city && (
              <div className='mb-2'>
                <div className='text-xs text-gray-400'>LOCATION</div>
                <div className='font-medium'>
                  {company.address.city}
                  {company.address.region ? `, ${company.address.region}` : ''}
                  {company.address.country
                    ? `, ${company.address.country}`
                    : ''}
                </div>
              </div>
            )}
            <div className='mb-2'>
              <div className='text-xs text-gray-400'>PHONE</div>
              <div className='font-medium'>{company.phoneNumber || 'N/A'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400'>EMAIL ADDRESS</div>
              <div className='font-medium'>{company.email || 'N/A'}</div>
            </div>
          </div>

          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='font-semibold mb-2'>Company Details</div>
            {company.tin && (
              <div className='mb-2'>
                <div className='text-xs text-gray-400'>TIN</div>
                <div className='font-medium'>{company.tin}</div>
              </div>
            )}
            {company.code && (
              <div className='mb-2'>
                <div className='text-xs text-gray-400'>COMPANY CODE</div>
                <div className='font-medium'>{company.code}</div>
              </div>
            )}
            {company.tin && (
              <div className='mb-2'>
                <div className='text-xs text-gray-400'>TIN</div>
                <div className='font-medium'>{company.tin}</div>
              </div>
            )}
            {company.licenseNumber && (
              <div>
                <div className='text-xs text-gray-400'>LICENSE NUMBER</div>
                <div className='font-medium'>{company.licenseNumber}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Open Position Section */}
      <div className='max-w-5xl mx-auto mt-16' id='open-positions'>
        <h2 className='text-3xl font-semibold text-center mb-10'>
          Open Position ({jobs.length})
        </h2>
        {jobs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='rounded-xl border bg-white p-6 flex flex-col gap-2 shadow-sm relative'
              >
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      fill='white'
                      viewBox='0 0 24 24'
                    >
                      <path d='M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' />
                    </svg>
                  </div>
                  <div className='font-semibold text-base'>{company.name}</div>
                </div>
                <div className='flex items-center gap-1 text-gray-400 text-xs mb-2'>
                  <svg
                    width='16'
                    height='16'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                      strokeWidth='2'
                    />
                  </svg>
                  {job.location || job.city || 'Location not specified'}
                </div>
                <div className='font-semibold text-lg text-gray-800 mb-1'>
                  {job.title}
                </div>
                <div className='text-gray-500 text-sm flex gap-2'>
                  <span>{job.employmentType || 'Full Time'}</span>
                  <span className='mx-1'>•</span>
                  <span>{formatSalaryRange(job.salaryRange)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>📋</div>
            <p className='text-gray-600 text-lg'>
              No open positions at the moment
            </p>
            <p className='text-gray-500 text-sm mt-2'>
              Check back later for new opportunities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
