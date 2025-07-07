'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  employerService,
  Employer,
  EmployersResponse,
} from '@/services/employer.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import EmployerPageSidebar from '@/components/ui/EmployerPageSidebar';
import { isAuthError } from '@/utils/auth';

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

  // For mobile, show limited pages to prevent overflow
  const getVisiblePages = () => {
    if (total <= 5) return pages;

    if (current <= 3) {
      return [...pages.slice(0, 4), '...', pages[pages.length - 1]];
    }

    if (current >= total - 2) {
      return [pages[0], '...', ...pages.slice(-4)];
    }

    return [
      pages[0],
      '...',
      pages[current - 2],
      pages[current - 1],
      pages[current],
      '...',
      pages[pages.length - 1],
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8 md:mt-10 overflow-x-auto px-2'>
      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm flex-shrink-0 ${
          current === 1
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <svg
          width='14'
          height='14'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='sm:w-4 sm:h-4'
        >
          <path d='M15 19l-7-7 7-7' strokeWidth='2' />
        </svg>
      </button>

      {visiblePages.map((page, index) => (
        <div key={index} className='flex-shrink-0'>
          {page === '...' ? (
            <span className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm'>
              ...
            </span>
          ) : (
            <button
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-medium transition-colors text-sm ${
                current === page
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              }`}
              onClick={() => onChange(page as number)}
            >
              {page.toString().padStart(2, '0')}
            </button>
          )}
        </div>
      ))}

      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm flex-shrink-0 ${
          current === total
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <svg
          width='14'
          height='14'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='sm:w-4 sm:h-4'
        >
          <path d='M9 5l7 7-7 7' strokeWidth='2' />
        </svg>
      </button>
    </div>
  );
}

function FindEmployersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    organizationType: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 3,
  });
  const perPage = 3;

  // Update searchFilters when searchParams change
  useEffect(() => {
    if (!searchParams) return;

    setSearchFilters({
      keyword: searchParams.get('name') || '',
      location: searchParams.get('location') || '',
      organizationType: searchParams.get('organizationType') || '',
    });

    // Reset to page 1 when search params change
    setPage(1);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchParams]);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        let response;

        // If we have search params, use searchEmployers
        if (
          searchParams?.get('name') ||
          searchParams?.get('location') ||
          searchParams?.get('organizationType')
        ) {
          response = await employerService.searchEmployers(
            searchParams.get('name') || '',
            searchParams.get('location') || '',
            searchParams.get('organizationType') || '',
            page,
            perPage,
          );
        } else {
          // Otherwise, use getEmployers
          response = await employerService.getEmployers();
        }

        setEmployers(response.items || []);
        setPagination({
          total: response.total || response.items?.length || 0,
          totalPages: Math.ceil(
            (response.total || response.items?.length || 0) / perPage,
          ),
          currentPage: page,
          limit: perPage,
        });
      } catch (error: any) {
        console.error('Failed to fetch employers:', error);

        // Check if it's an authentication error
        if (isAuthError(error)) {
          // Authentication error - the API interceptor should handle logout
          // Just set empty state and let the auth context handle the redirect
          setEmployers([]);
          setPagination({
            total: 0,
            totalPages: 0,
            currentPage: page,
            limit: perPage,
          });
        } else {
          // Other errors - show empty state
          setEmployers([]);
          setPagination({
            total: 0,
            totalPages: 0,
            currentPage: page,
            limit: perPage,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, [searchParams, page, perPage]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchFilters.keyword) queryParams.set('name', searchFilters.keyword);
    if (searchFilters.location)
      queryParams.set('location', searchFilters.location);
    if (searchFilters.organizationType)
      queryParams.set('organizationType', searchFilters.organizationType);

    // Reset to page 1 when searching
    setPage(1);
    router.push(`/find-employers?${queryParams.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      keyword: '',
      location: '',
      organizationType: '',
    });
    setPage(1);
    router.push('/find-employers');
  };

  // Add keyboard event handler for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalPages = pagination.totalPages;
  const paginatedEmployers = employers;

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show non-logged in user view only after auth loading is complete and user is null
  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        {/* Hero Section */}
        <section className='bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl mx-auto text-center'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6'>
                Discover Top Employers
              </h1>
              <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8'>
                Explore companies, understand their culture, and find your
                perfect workplace match
              </p>
              <Link
                href='/signup?type=employee'
                className='inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base'
              >
                Join Now - It's Free
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-12 sm:py-16 md:py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 dark:text-white'>
              Why Use TalentHub to Find Employers?
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8'>
              <FeatureCard
                title='Comprehensive Company Profiles'
                description='Get detailed insights into company culture, benefits, work environment, and growth opportunities before applying.'
                icon='🏢'
              />
              <FeatureCard
                title='Smart Job Matching'
                description='Our AI-powered platform matches you with employers that align with your skills, experience, and career goals.'
                icon='🎯'
              />
              <FeatureCard
                title='Direct Application Process'
                description='Apply directly to companies through our platform with a streamlined process that saves you time and effort.'
                icon='📝'
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 dark:text-white'>
              How It Works
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8'>
              <StepCard
                number='1'
                title='Create Your Profile'
                description='Sign up and build your professional profile with skills and experience'
              />
              <StepCard
                number='2'
                title='Browse Employers'
                description='Explore companies and understand their culture and opportunities'
              />
              <StepCard
                number='3'
                title='Apply to Jobs'
                description='Submit applications directly to companies that interest you'
              />
              <StepCard
                number='4'
                title='Get Hired'
                description='Connect with employers and land your dream job'
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className='py-12 sm:py-16 md:py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 dark:text-white'>
              Benefits for Job Seekers
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
              <BenefitCard
                title='Company Insights'
                description='Learn about company culture, benefits, and work environment before applying'
                icon='🔍'
              />
              <BenefitCard
                title='Career Growth'
                description='Find employers that offer training, mentorship, and advancement opportunities'
                icon='📈'
              />
              <BenefitCard
                title='Work-Life Balance'
                description='Discover companies that prioritize employee well-being and flexible work arrangements'
                icon='⚖️'
              />
              <BenefitCard
                title='Competitive Salaries'
                description='Access information about compensation packages and benefits'
                icon='💰'
              />
              <BenefitCard
                title='Diverse Opportunities'
                description='Explore employers across different industries and company sizes'
                icon='🌍'
              />
              <BenefitCard
                title='Direct Communication'
                description='Connect directly with hiring managers and company representatives'
                icon='💬'
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-12 sm:py-16 md:py-20 bg-blue-600 text-white'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'>
              Ready to Find Your Dream Employer?
            </h2>
            <p className='text-lg sm:text-xl mb-6 sm:mb-8'>
              Join thousands of job seekers already using TalentHub
            </p>
            <Link
              href='/signup?type=employee'
              className='inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base'
            >
              Start Your Job Search Today
            </Link>
          </div>
        </section>
      </div>
    );
  }

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
      <div className='flex flex-col sm:flex-row justify-between bg-gray-100 dark:bg-gray-800 items-center px-3 sm:px-4 md:px-8 lg:px-16 pt-4 sm:pt-6 md:pt-8 gap-2 sm:gap-0'>
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
      <div className='bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 md:px-8 lg:px-16 py-3 sm:py-4 md:py-6 pb-4 sm:pb-6 md:pb-8 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center shadow dark:shadow-gray-700/50 rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          {/* Job title search */}
          <div className='flex items-center gap-2 flex-1 border-b border-gray-200 dark:border-gray-600 lg:border-b-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-600 pb-3 sm:pb-4 lg:pb-0 pr-0 lg:pr-4 w-full min-w-0'>
            <svg
              width='18'
              height='18'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
              className='mr-2 flex-shrink-0 sm:w-5 sm:h-5'
            >
              <circle cx='11' cy='11' r='7' strokeWidth='2' />
              <path d='M21 21l-4.35-4.35' strokeWidth='2' />
            </svg>
            <input
              className='flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base min-w-0 w-full'
              placeholder='Employer name, Keyword...'
              value={searchFilters.keyword}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, keyword: e.target.value })
              }
              onKeyDown={handleKeyPress}
            />
          </div>
          {/* Organization Type */}
          <div className='flex items-center gap-2 flex-1 border-b border-gray-200 dark:border-gray-600 lg:border-b-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-600 pb-3 sm:pb-4 lg:pb-0 pr-0 lg:pr-4 min-w-0'>
            <svg
              width='18'
              height='18'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
              className='mr-2 flex-shrink-0 sm:w-5 sm:h-5'
            >
              <rect x='3' y='7' width='18' height='13' rx='2' strokeWidth='2' />
            </svg>
            <select
              className='flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 text-sm sm:text-base cursor-pointer min-w-0 w-full'
              value={searchFilters.organizationType}
              onChange={(e) => {
                setSearchFilters({
                  ...searchFilters,
                  organizationType: e.target.value,
                });
                // Trigger search when organization type changes
                const newFilters = {
                  ...searchFilters,
                  organizationType: e.target.value,
                };
                const queryParams = new URLSearchParams();
                if (newFilters.keyword)
                  queryParams.set('name', newFilters.keyword);
                if (newFilters.location)
                  queryParams.set('location', newFilters.location);
                if (newFilters.organizationType)
                  queryParams.set(
                    'organizationType',
                    newFilters.organizationType,
                  );

                setPage(1);
                router.push(`/find-employers?${queryParams.toString()}`);
              }}
            >
              <option value=''>All Organization Types</option>
              {orgTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Find Employer button */}
          <div className='flex items-center gap-2 pl-0 lg:pl-4 w-full lg:w-auto'>
            <button
              className='bg-blue-600 dark:bg-blue-500 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition w-full lg:w-auto text-sm sm:text-base'
              onClick={handleSearch}
            >
              Find Employer
            </button>
            {(searchFilters.keyword ||
              searchFilters.location ||
              searchFilters.organizationType) && (
              <button
                className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm sm:text-base flex items-center gap-1 sm:gap-2'
                onClick={handleClearFilters}
                title='Clear all filters'
              >
                <svg
                  width='14'
                  height='14'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='sm:w-4 sm:h-4'
                >
                  <path d='M6 18L18 6M6 6l12 12' strokeWidth='2' />
                </svg>
                <span className='hidden sm:inline'>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter button */}

      <div className='flex flex-col lg:flex-row px-3 sm:px-4 md:px-8 lg:px-16 py-3 sm:py-4 md:py-8 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
        {/* Left Sidebar - Mobile Filter Panel */}
        <div
          className={`lg:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-700/50 transition-all duration-300 ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm'>
                Quick Filters
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M6 18L18 6M6 6l12 12' strokeWidth='2' />
                </svg>
              </button>
            </div>

            {/* Clear Filters Button */}
            {(searchFilters.keyword ||
              searchFilters.location ||
              searchFilters.organizationType) && (
              <div className='mb-4'>
                <button
                  onClick={handleClearFilters}
                  className='w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-3 rounded-md font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm flex items-center justify-center gap-2 border border-red-200 dark:border-red-800'
                >
                  <svg
                    width='14'
                    height='14'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M6 18L18 6M6 6l12 12' strokeWidth='2' />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            )}

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Organization Type
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={searchFilters.organizationType}
                  onChange={(e) => {
                    setSearchFilters({
                      ...searchFilters,
                      organizationType: e.target.value,
                    });
                    const newFilters = {
                      ...searchFilters,
                      organizationType: e.target.value,
                    };
                    const queryParams = new URLSearchParams();
                    if (newFilters.keyword)
                      queryParams.set('name', newFilters.keyword);
                    if (newFilters.location)
                      queryParams.set('location', newFilters.location);
                    if (newFilters.organizationType)
                      queryParams.set(
                        'organizationType',
                        newFilters.organizationType,
                      );

                    setPage(1);
                    router.push(`/find-employers?${queryParams.toString()}`);
                  }}
                >
                  <option value=''>All Organization Types</option>
                  {orgTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main content and Right Sidebar Container */}
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 flex-1'>
          {/* Main content */}
          <div className='flex-1 rounded-lg'>
            {/* Results count */}
            <div className='mb-3 sm:mb-4 md:mb-6'>
              <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                {pagination.total} employers found
              </p>
            </div>

            <div className='flex flex-col gap-3 sm:gap-4 md:gap-6'>
              {paginatedEmployers.map((employer, idx) => (
                <div
                  key={employer.name}
                  className='flex flex-col sm:flex-row sm:items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-700/50 p-3 sm:p-4 md:p-6 justify-between'
                >
                  <div className='flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0'>
                      <span className='text-base sm:text-lg md:text-2xl font-bold text-gray-400 dark:text-gray-500'>
                        {employer.tradeName[0]}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2'>
                        <Link
                          href={`/find-employers/${employer.id}`}
                          className='hover:underline text-blue-700 dark:text-blue-400 truncate block'
                        >
                          {employer.tradeName}
                        </Link>
                      </div>
                      <div className='flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-2 md:gap-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm'>
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
                          <span className='truncate'>
                            {employer.address.subcity}
                          </span>
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
                            <span className='truncate'>
                              {employer.industry}
                            </span>
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
                              <path
                                d='M16 3.13a4 4 0 010 7.75'
                                strokeWidth='2'
                              />
                            </svg>
                            <span className='truncate'>
                              {employer.companySize}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {pagination.total === 0 && (
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
            {pagination.total > 0 && (
              <Pagination
                current={pagination.currentPage}
                total={totalPages}
                onChange={setPage}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className='hidden lg:block lg:flex-shrink-0'>
            <EmployerPageSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

function FindEmployersPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-lg'>Loading employers...</p>
          </div>
        </div>
      }
    >
      <FindEmployersPage />
    </Suspense>
  );
}

// Component definitions for the marketing page
function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className='text-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700'>
      <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>{icon}</div>
      <h3 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white'>
        {title}
      </h3>
      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300'>
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className='text-center'>
      <div className='w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4'>
        {number}
      </div>
      <h3 className='text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
        {title}
      </h3>
      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300'>
        {description}
      </p>
    </div>
  );
}

function BenefitCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className='p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700'>
      <div className='text-2xl sm:text-3xl mb-2 sm:mb-3'>{icon}</div>
      <h3 className='text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white'>
        {title}
      </h3>
      <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
        {description}
      </p>
    </div>
  );
}

export default FindEmployersPageWrapper;
