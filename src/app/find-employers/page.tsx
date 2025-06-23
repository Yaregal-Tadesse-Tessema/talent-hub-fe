'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  employerService,
  Employer,
  EmployersResponse,
} from '@/services/employer.service';
import router from 'next/router';

const orgTypes = [
  'Government',
  'Semi Government',
  'NGO',
  'Private Company',
  'International Agencies',
  'Others',
];

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className='flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10'>
      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm ${
          current === 1
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <svg
          width='16'
          height='16'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M15 19l-7-7 7-7' strokeWidth='2' />
        </svg>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-medium transition-colors text-sm ${
            current === page
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          }`}
          onClick={() => onChange(page)}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}
      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm ${
          current === total
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <svg
          width='16'
          height='16'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M9 5l7 7-7 7' strokeWidth='2' />
        </svg>
      </button>
    </div>
  );
}

export default function FindEmployersPage() {
  const [radius, setRadius] = useState(32);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showRadius, setShowRadius] = useState(true);
  const [showOrgType, setShowOrgType] = useState(true);
  const [page, setPage] = useState(1);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const perPage = 3;

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await employerService.getEmployers();
        setEmployers(response.items || []);
      } catch (error) {
        console.error('Failed to fetch employers:', error);
        setEmployers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const totalPages = Math.ceil(employers.length / perPage);
  const paginatedEmployers = employers.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading employers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Page title and breadcrumb */}
      <div className='flex flex-col sm:flex-row justify-between bg-gray-100 dark:bg-gray-800 items-center px-4 sm:px-8 lg:px-16 pt-6 sm:pt-8 gap-2 sm:gap-0'>
        <h2 className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Find Employers
        </h2>
        <nav className='text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex items-center gap-1'>
          <span
            onClick={() => router.push('/')}
            className='hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
          >
            Home
          </span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 dark:text-gray-300 font-medium'>
            Find Employers
          </span>
        </nav>
      </div>

      {/* Top search/filter bar */}
      <div className='bg-gray-100 dark:bg-gray-800 px-4 sm:px-8 lg:px-16 py-4 sm:py-6 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col lg:flex-row gap-4 items-stretch lg:items-center shadow dark:shadow-gray-700/50 rounded-xl px-4 sm:px-6 py-4 sm:py-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          {/* Job title search */}
          <div className='flex items-center gap-2 flex-1 border-b border-gray-200 dark:border-gray-600 lg:border-b-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-600 pb-4 lg:pb-0 pr-0 lg:pr-4 w-full'>
            <svg
              width='20'
              height='20'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
              className='mr-2 flex-shrink-0'
            >
              <circle cx='11' cy='11' r='7' strokeWidth='2' />
              <path d='M21 21l-4.35-4.35' strokeWidth='2' />
            </svg>
            <input
              className='flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base'
              placeholder='Employer name, Keyword...'
            />
          </div>
          {/* Find Employer button */}
          <div className='flex items-center pl-0 lg:pl-4 w-full lg:w-auto'>
            <button className='bg-blue-600 dark:bg-blue-500 text-white px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition w-full lg:w-auto text-sm sm:text-base'>
              Find Employer
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <div className='lg:hidden px-4 sm:px-8 py-4'>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition text-sm sm:text-base'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M20 21V16'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M17 16H23'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4 21V14'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M1 14H7'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 21V12'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 8H15'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M20 12V3'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 8V3'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4 10V3'
              stroke='#ffffff'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className='flex flex-col lg:flex-row px-4 sm:px-8 lg:px-16 py-4 sm:py-8 gap-4 sm:gap-6 lg:gap-8'>
        {/* Sidebar filter */}
        <div
          className={`lg:w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm dark:shadow-gray-700/50 h-fit transition-all duration-300 ${
            sidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Desktop filter button */}
          <div className='hidden lg:block'>
            <button className='w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded mb-6 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition text-sm'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20 21V16'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M17 16H23'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4 21V14'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M1 14H7'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 21V12'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M9 8H15'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M20 12V3'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 8V3'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4 10V3'
                  stroke='#ffffff'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Filter
            </button>
          </div>

          {/* Organization Type */}
          <div>
            <div
              className='flex justify-between items-center mb-3 cursor-pointer select-none'
              onClick={() => setShowOrgType((v) => !v)}
            >
              <span className='font-medium text-gray-900 dark:text-white text-sm sm:text-base'>
                Organization Type
              </span>
              <svg
                width='16'
                height='16'
                fill='none'
                viewBox='0 0 20 20'
                stroke='currentColor'
                className={`transition-transform text-gray-600 dark:text-gray-400 ${showOrgType ? '' : 'rotate-180'}`}
              >
                <path d='M6 8l4 4 4-4' strokeWidth='2' />
              </svg>
            </div>
            {showOrgType && (
              <div className='space-y-2'>
                {orgTypes.map((type) => (
                  <div key={type} className='flex items-center'>
                    <input
                      type='radio'
                      id={type}
                      name='orgType'
                      value={type}
                      checked={selectedOrg === type}
                      onChange={() => setSelectedOrg(type)}
                      className='mr-3 accent-blue-600 dark:accent-blue-400'
                    />
                    <label
                      htmlFor={type}
                      className='text-gray-900 dark:text-white text-sm sm:text-base cursor-pointer'
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 rounded-lg'>
          {/* Results count */}
          <div className='mb-4 sm:mb-6'>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
              {employers.length} employers found
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:gap-6'>
            {paginatedEmployers.map((employer, idx) => (
              <div
                key={employer.name}
                className='flex flex-col sm:flex-row sm:items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-700/50 p-4 sm:p-6 justify-between'
              >
                <div className='flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                  <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0'>
                    <span className='text-lg sm:text-2xl font-bold text-gray-400 dark:text-gray-500'>
                      {employer.tradeName[0]}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-base sm:text-lg mb-2'>
                      <Link
                        href={`/find-employers/${employer.id}`}
                        className='hover:underline text-blue-700 dark:text-blue-400 truncate block'
                      >
                        {employer.tradeName}
                      </Link>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm'>
                      <div className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          className='w-3 h-3 sm:w-4 sm:h-4'
                        >
                          <path
                            d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                            strokeWidth='2'
                          />
                        </svg>
                        {employer.address.subcity}
                      </div>
                      {employer.industry && (
                        <div className='flex items-center gap-1'>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-3 h-3 sm:w-4 sm:h-4'
                          >
                            <rect
                              x='3'
                              y='7'
                              width='18'
                              height='13'
                              rx='2'
                              strokeWidth='2'
                            />
                          </svg>
                          {employer.industry}
                        </div>
                      )}
                      {employer.companySize && (
                        <div className='flex items-center gap-1'>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-3 h-3 sm:w-4 sm:h-4'
                          >
                            <path
                              d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'
                              strokeWidth='2'
                            />
                            <circle cx='9' cy='7' r='4' strokeWidth='2' />
                            <path
                              d='M23 21v-2a4 4 0 00-3-3.87'
                              strokeWidth='2'
                            />
                            <path d='M16 3.13a4 4 0 010 7.75' strokeWidth='2' />
                          </svg>
                          {employer.companySize}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {employers.length === 0 && (
            <div className='text-center py-12'>
              <div className='text-gray-400 dark:text-gray-500 text-4xl mb-4'>
                🏢
              </div>
              <h3 className='text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2'>
                No employers found
              </h3>
              <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6'>
                Try adjusting your search criteria or check back later for new
                opportunities
              </p>
            </div>
          )}

          {/* Pagination */}
          {employers.length > 0 && (
            <Pagination current={page} total={totalPages} onChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
