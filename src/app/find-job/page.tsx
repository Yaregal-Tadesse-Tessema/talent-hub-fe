'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Bookmark,
  ArrowRight,
  User,
  MapPin,
  Briefcase,
  Filter,
  X,
} from 'lucide-react';
import FilterModal from '@/components/ui/FilterModal';
import AdvancedFilterModal, {
  AdvancedFilters,
} from '@/components/ui/AdvancedFilterModal';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShareButton } from '@/components/ui/ShareButton';

// Helper function to check if a job is expired
const isJobExpired = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  return deadlineDate < currentDate;
};

// Pagination component
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  // Show only a limited number of pages for better UX
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10'>
      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm ${
          current === 1
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400 cursor-not-allowed'
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

      {visiblePages.map((page, index) => (
        <button
          key={index}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-medium transition-colors text-sm ${
            page === current
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : page === '...'
                ? 'text-gray-400 dark:text-gray-500 cursor-default'
                : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          }`}
          onClick={() => typeof page === 'number' && onChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors text-sm ${
          current === total
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-400 cursor-not-allowed'
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

export default function FindJobPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-gray-900'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
            <p className='text-gray-600 dark:text-gray-400'>Loading jobs...</p>
          </div>
        </div>
      }
    >
      <FindJobContent />
    </Suspense>
  );
}

function FindJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [user, setUser] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    category: '',
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    experienceLevel: '',
    salaryRange: { min: 0, max: 0 },
    employmentType: [],
    educationLevel: '',
    industry: '',
    location: '',
    skills: [],
    gender: '',
    minimumGPA: 0,
    fieldOfStudy: '',
    positionNumbers: 0,
    paymentType: '',
  });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  });

  // Update searchFilters when searchParams change
  useEffect(() => {
    if (!searchParams) return;

    setSearchFilters({
      keyword: searchParams.get('title') || '',
      category: searchParams.get('category') || '',
    });

    // Reset to page 1 when search params change
    setCurrentPage(1);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchParams]);

  // Function to count active filters
  const countActiveFilters = (filters: AdvancedFilters): number => {
    let count = 0;
    if (filters.experienceLevel) count++;
    if (filters.salaryRange.min > 0 || filters.salaryRange.max > 0) count++;
    if (filters.employmentType.length > 0) count++;
    if (filters.educationLevel) count++;
    if (filters.industry) count++;
    if (filters.location) count++;
    if (filters.skills.length > 0) count++;
    if (filters.gender && filters.gender !== 'Any') count++;
    if (filters.minimumGPA > 0) count++;
    if (filters.fieldOfStudy) count++;
    if (filters.positionNumbers > 0) count++;
    if (filters.paymentType) count++;
    return count;
  };

  // Update active filters count when advanced filters change
  useEffect(() => {
    setActiveFiltersCount(countActiveFilters(advancedFilters));
  }, [advancedFilters]);

  // Combined effect for fetching jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let response;

        // Check if we have advanced filters
        const hasAdvancedFilters = countActiveFilters(advancedFilters) > 0;
        const hasBasicFilters =
          searchParams?.get('title') || searchParams?.get('category');

        if (hasAdvancedFilters || hasBasicFilters) {
          // Use advanced search with filters
          const searchTitle =
            searchParams?.get('title') || searchFilters.keyword;
          const searchCategory =
            searchParams?.get('category') || searchFilters.category;

          response = await jobService.searchJobsWithAdvancedFilters(
            {
              title: searchTitle,
              category: searchCategory,
              ...advancedFilters,
            },
            currentPage,
            pagination.limit,
          );
        } else {
          // Use different endpoints based on user login status
          if (user) {
            // User is logged in - use the new endpoint
            const queryParams = `q=status:=:Posted&t=${pagination.limit}&sk=${(currentPage - 1) * pagination.limit}`;
            response = await jobService.getJobs(queryParams);
          } else {
            // User is not logged in - use public jobs endpoint
            response = await jobService.getPublicJobs(
              currentPage,
              pagination.limit,
            );
          }
        }

        setJobs(response.items);
        setPagination({
          total: response.total,
          totalPages: Math.ceil(response.total / pagination.limit),
          currentPage: currentPage,
          limit: pagination.limit,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [
    searchParams,
    user,
    currentPage,
    pagination.limit,
    advancedFilters,
    searchFilters.keyword,
    searchFilters.category,
  ]); // Dependencies include pagination

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchFilters.keyword) queryParams.set('title', searchFilters.keyword);
    // if (searchFilters.location)
    //   queryParams.set('location', searchFilters.location);
    if (searchFilters.category)
      queryParams.set('category', searchFilters.category);

    // Reset to page 1 when searching
    setCurrentPage(1);
    router.push(`/find-job?${queryParams.toString()}`);
  };

  // Add keyboard event handler for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    getUser();
  }, []); // Empty dependency array since we only want to run this once on mount

  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please login to save jobs' });
      return;
    }

    try {
      await jobService.saveJob(jobId, user.id);
      setJobs(
        jobs.map((job) => (job.id === jobId ? { ...job, isSaved: true } : job)),
      );
      showToast({ type: 'success', message: 'Job saved successfully' });
    } catch (error) {
      console.error('Error saving job:', error);
      showToast({ type: 'error', message: 'Failed to save job' });
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please login to unsave jobs' });
      return;
    }

    try {
      await jobService.unsaveJob(jobId, user.id);
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, isSaved: false } : job,
        ),
      );
      showToast({ type: 'success', message: 'Job unsaved successfully' });
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  const handleApplyClick = (jobId: string) => {
    // Find the job to check if it's expired
    const job = jobs.find((j) => j.id === jobId);
    if (job && isJobExpired(job.deadline)) {
      showToast({
        type: 'error',
        message: 'This job has expired and is no longer accepting applications',
      });
      return;
    }

    // Check if user is logged in
    if (!user) {
      // Store the job ID in localStorage to redirect after login
      localStorage.setItem('returnToJob', jobId);
      router.push('/login');
      return;
    }

    // Check if user is an employee
    if (user.role !== 'employee') {
      showToast({
        type: 'error',
        message: 'Only employees can apply for jobs',
      });
      router.push('/dashboard');
      return;
    }

    router.push(`/find-job/${jobId}?apply=true`);
  };

  const handleAdvancedFiltersApply = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
    showToast({
      type: 'success',
      message: `Applied ${countActiveFilters(filters)} filter(s)`,
    });
  };

  const handleClearAllFilters = () => {
    setAdvancedFilters({
      experienceLevel: '',
      salaryRange: { min: 0, max: 0 },
      employmentType: [],
      educationLevel: '',
      industry: '',
      location: '',
      skills: [],
      gender: '',
      minimumGPA: 0,
      fieldOfStudy: '',
      positionNumbers: 0,
      paymentType: '',
    });
    setCurrentPage(1);
    showToast({
      type: 'success',
      message: 'All filters cleared',
    });
  };

  return (
    <main className='min-h-screen pb-16 bg-gray-50 dark:bg-gray-900'>
      {/* Page title and breadcrumb */}
      <div className='flex flex-col sm:flex-row justify-between bg-gray-100 dark:bg-gray-800 items-center px-4 sm:px-8 lg:px-16 pt-6 sm:pt-8 gap-2 sm:gap-0'>
        <h2 className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Find Job
        </h2>
        <nav className='text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex items-center gap-1'>
          <span className='hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'>
            Home
          </span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 dark:text-gray-300 font-medium'>
            Find Job
          </span>
        </nav>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className='flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-gray-900'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
            <p className='text-gray-600 dark:text-gray-400'>Loading jobs...</p>
          </div>
        </div>
      )}

      {error && (
        <div className='text-center py-8'>
          <div className='text-red-500 dark:text-red-400 text-lg mb-2'>⚠️</div>
          <div className='text-red-500 dark:text-red-400'>{error}</div>
        </div>
      )}

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
              className='w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base'
              placeholder='Job title, Keyword...'
              value={searchFilters.keyword}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  keyword: e.target.value,
                }))
              }
              onKeyPress={handleKeyPress}
            />
          </div>
          {/* Category */}
          <div className='flex items-center gap-2 flex-1 border-b border-gray-200 dark:border-gray-600 lg:border-b-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-600 pb-4 lg:pb-0 pr-0 lg:pr-4'>
            <Briefcase className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0' />
            <select
              className='w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 text-sm sm:text-base'
              value={searchFilters.category}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value=''>Select Category</option>
              <option value='FullTime'>Full Time</option>
              <option value='PartTime'>Part Time</option>
              <option value='Contract'>Contract</option>
              <option value='Internship'>Internship</option>
            </select>
          </div>

          {/* Advanced Filter Button */}
          <div className='flex items-center gap-2 pl-0 lg:pl-4 w-full lg:w-auto'>
            <button
              onClick={() => setIsAdvancedFilterOpen(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors text-sm sm:text-base border ${
                activeFiltersCount > 0
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className='w-4 h-4' />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className='bg-blue-600 dark:bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Find Job Button */}
            <button
              className='bg-blue-600 dark:bg-blue-500 text-white px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition w-full lg:w-auto text-sm sm:text-base'
              onClick={handleSearch}
            >
              Find Job
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'>
        {/* View Mode Toggle */}
        <div className='flex justify-between items-center mb-6'>
          <div className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            {pagination.total} jobs found
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'card'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <rect x='3' y='3' width='7' height='7' strokeWidth='2' />
                <rect x='14' y='3' width='7' height='7' strokeWidth='2' />
                <rect x='3' y='14' width='7' height='7' strokeWidth='2' />
                <rect x='14' y='14' width='7' height='7' strokeWidth='2' />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <line x1='8' y1='6' x2='21' y2='6' strokeWidth='2' />
                <line x1='8' y1='12' x2='21' y2='12' strokeWidth='2' />
                <line x1='8' y1='18' x2='21' y2='18' strokeWidth='2' />
                <line x1='3' y1='6' x2='3.01' y2='6' strokeWidth='2' />
                <line x1='3' y1='12' x2='3.01' y2='12' strokeWidth='2' />
                <line x1='3' y1='18' x2='3.01' y2='18' strokeWidth='2' />
              </svg>
            </button>
          </div>
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='group relative z-0 hover:z-30 focus-within:z-30 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1'
              >
                {/* Header with company info */}
                <div className='p-6 pb-4'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-700 overflow-hidden'>
                        {job.companyLogo ? (
                          <img
                            src={
                              job.companyLogo.path ||
                              '/images/default-company-logo.png'
                            }
                            alt={job.companyName}
                            className='w-8 h-8 object-contain'
                          />
                        ) : (
                          <Briefcase className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
                          {job.companyName}
                        </h3>
                        <div className='flex items-center gap-1 mt-1'>
                          <MapPin className='w-3 h-3 text-gray-400 dark:text-gray-500' />
                          <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className='flex flex-col gap-1'>
                      {job.isSaved && (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'>
                          <Bookmark className='w-3 h-3 mr-1' />
                          Saved
                        </span>
                      )}
                      {isJobExpired(job.deadline) && (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'>
                          Expired
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job title */}
                  <Link
                    href={`/find-job/${job.id}`}
                    className='block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                  >
                    <h2 className='font-bold text-gray-900 dark:text-white text-lg leading-tight mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400'>
                      {job.title}
                    </h2>
                  </Link>

                  {/* Job details */}
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'>
                        {job.employmentType}
                      </span>
                      <div className='text-right'>
                        <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                          ${job.salaryRange?.min || 'N/A'} - $
                          {job.salaryRange?.max || 'N/A'}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          per year
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with dates and actions */}
                <div className='px-6 pb-6'>
                  {/* Date info */}
                  <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4'>
                    <div className='flex items-center gap-1'>
                      <svg
                        className='w-3 h-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <rect
                          x='3'
                          y='3'
                          width='18'
                          height='7'
                          strokeWidth='2'
                        />
                        <rect
                          x='3'
                          y='14'
                          width='18'
                          height='7'
                          strokeWidth='2'
                        />
                      </svg>
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${isJobExpired(job.deadline) ? 'text-red-500 dark:text-red-400 font-medium' : ''}`}
                    >
                      <svg
                        className='w-3 h-3'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <circle cx='12' cy='12' r='10' strokeWidth='2' />
                        <polyline points='12,6 12,12 16,14' strokeWidth='2' />
                      </svg>
                      {isJobExpired(job.deadline) ? 'Expired' : 'Deadline'}{' '}
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className='flex items-center gap-3'>
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isJobExpired(job.deadline)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg'
                      }`}
                      onClick={() => handleApplyClick(job.id)}
                      disabled={isJobExpired(job.deadline)}
                    >
                      {isJobExpired(job.deadline) ? (
                        'Expired'
                      ) : (
                        <>
                          Apply Now
                          <ArrowRight className='w-4 h-4' />
                        </>
                      )}
                    </button>

                    <div className='flex items-center gap-2'>
                      <button
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          job.isSaved
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                            : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() =>
                          job.isSaved
                            ? handleUnsaveJob(job.id)
                            : handleSaveJob(job.id)
                        }
                      >
                        <Bookmark
                          className={`w-4 h-4 ${job.isSaved ? 'fill-current' : ''}`}
                        />
                      </button>

                      <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative'>
                        <ShareButton />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay effect */}
                <div className='absolute inset-0 bg-gradient-to-t from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/5 group-hover:via-blue-50/3 group-hover:to-blue-50/10 dark:group-hover:from-blue-900/5 dark:group-hover:via-blue-900/3 dark:group-hover:to-blue-900/10 transition-all duration-300 pointer-events-none rounded-2xl' />
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className='flex flex-col gap-4'>
            {jobs.map((job) => {
              const isHovered = hoveredJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`
                    flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 sm:py-5 transition
                    border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500
                  `}
                  onMouseEnter={() => setHoveredJobId(job.id)}
                  onMouseLeave={() => setHoveredJobId(null)}
                >
                  {/* Logo and Main Info */}
                  <div className='flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                    {/* Logo */}
                    <div className='flex-shrink-0'>
                      {job.companyLogo && (
                        <img
                          src={
                            job.companyLogo?.path ||
                            '/images/default-company-logo.png'
                          }
                          alt={job.companyName}
                          className='w-12 h-12 object-contain'
                        />
                      )}
                    </div>

                    {/* Main Info */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-2'>
                        <Link
                          href={`/find-job/${job.id}`}
                          className='font-semibold text-gray-800 dark:text-white text-base hover:underline text-blue-600 dark:text-blue-400 truncate'
                        >
                          {job.title}
                        </Link>
                        <div className='flex items-center gap-2'>
                          {job.isSaved && (
                            <span className='bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-2 py-0.5 rounded-full font-medium'>
                              Saved
                            </span>
                          )}
                          {isJobExpired(job.deadline) && (
                            <span className='bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-medium'>
                              Expired
                            </span>
                          )}
                          {job.employmentType && (
                            <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium'>
                              {job.employmentType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        {job.companyName}
                      </div>

                      <div className='flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <MapPin className='w-3 h-3 sm:w-4 sm:h-4' />
                          {job.location}
                        </span>
                        <span className='flex items-center gap-1'>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-3 h-3 sm:w-4 sm:h-4'
                          >
                            <path d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                          </svg>
                          {job.salaryRange?.min || 'N/A'} -{' '}
                          {job.salaryRange?.max || 'N/A'}
                        </span>
                        <span className='flex items-center gap-1'>
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
                              y='3'
                              width='18'
                              height='7'
                              strokeWidth='2'
                            />
                            <rect
                              x='3'
                              y='14'
                              width='18'
                              height='7'
                              strokeWidth='2'
                            />
                          </svg>
                          Posted:{' '}
                          {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            isJobExpired(job.deadline)
                              ? 'text-red-500 dark:text-red-400 font-semibold'
                              : ''
                          }`}
                        >
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-3 h-3 sm:w-4 sm:h-4'
                          >
                            <circle cx='12' cy='12' r='10' strokeWidth='2' />
                            <polyline
                              points='12,6 12,12 16,14'
                              strokeWidth='2'
                            />
                          </svg>
                          {isJobExpired(job.deadline)
                            ? 'Expired: '
                            : 'Deadline: '}
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark and Apply */}
                  <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-4 sm:mt-0'>
                    <button
                      className={`${job.isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'}`}
                      onClick={() =>
                        job.isSaved
                          ? handleUnsaveJob(job.id)
                          : handleSaveJob(job.id)
                      }
                    >
                      <Bookmark
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${job.isSaved ? 'fill-current' : ''}`}
                      />
                    </button>
                    <div
                      className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'} relative`}
                    >
                      <ShareButton />
                    </div>
                    <button
                      className={`${
                        isJobExpired(job.deadline)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-600'
                          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white border border-blue-200 dark:border-blue-700'
                      } font-semibold px-4 sm:px-5 py-2 rounded-lg flex items-center gap-2 transition text-sm`}
                      onClick={() => handleApplyClick(job.id)}
                      disabled={isJobExpired(job.deadline)}
                    >
                      {isJobExpired(job.deadline) ? 'Expired' : 'Apply Now'}
                      {!isJobExpired(job.deadline) && (
                        <ArrowRight className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && pagination.total === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 dark:text-gray-500 text-4xl mb-4'>
              🔍
            </div>
            <h3 className='text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2'>
              No jobs found
            </h3>
            <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6'>
              Try adjusting your search criteria or check back later for new
              opportunities
            </p>
            <button
              onClick={handleClearAllFilters}
              className='px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base'
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='font-medium text-blue-900 dark:text-blue-100'>
                Active Filters ({activeFiltersCount})
              </h3>
              <button
                onClick={handleClearAllFilters}
                className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium'
              >
                Clear All
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {advancedFilters.experienceLevel && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Experience: {advancedFilters.experienceLevel}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        experienceLevel: '',
                      }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {(advancedFilters.salaryRange.min > 0 ||
                advancedFilters.salaryRange.max > 0) && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Salary: ${advancedFilters.salaryRange.min || 0} - $
                  {advancedFilters.salaryRange.max || '∞'}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        salaryRange: { min: 0, max: 0 },
                      }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {advancedFilters.employmentType.length > 0 && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Type: {advancedFilters.employmentType.join(', ')}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        employmentType: [],
                      }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {advancedFilters.educationLevel && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Education: {advancedFilters.educationLevel}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        educationLevel: '',
                      }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {advancedFilters.industry && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Industry: {advancedFilters.industry}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({ ...prev, industry: '' }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {advancedFilters.location && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Location: {advancedFilters.location}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({ ...prev, location: '' }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
              {advancedFilters.skills.length > 0 && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                  Skills: {advancedFilters.skills.slice(0, 3).join(', ')}
                  {advancedFilters.skills.length > 3 && '...'}
                  <button
                    onClick={() =>
                      setAdvancedFilters((prev) => ({ ...prev, skills: [] }))
                    }
                    className='ml-1 hover:text-blue-600 dark:hover:text-blue-300'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <Pagination
            current={currentPage}
            total={pagination.totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onApplyFilters={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
      />
    </main>
  );
}
