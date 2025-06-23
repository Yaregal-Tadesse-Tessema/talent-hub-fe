'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Bookmark, ArrowRight, User, MapPin, Briefcase } from 'lucide-react';
import FilterModal from '@/components/ui/FilterModal';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const [selectedPage, setSelectedPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    category: '',
  });
  const jobsPerPage = 12;
  const totalPages = 5;

  // Update searchFilters when searchParams change
  useEffect(() => {
    if (!searchParams) return;

    setSearchFilters({
      keyword: searchParams.get('title') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || '',
    });
  }, [searchParams]);

  // Combined effect for fetching jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let response;

        // If we have search params, use searchJobs
        if (
          searchParams?.get('title') ||
          searchParams?.get('location') ||
          searchParams?.get('category')
        ) {
          response = await jobService.searchJobs(
            searchParams.get('title') || '',
            searchParams.get('location') || '',
            searchParams.get('category') || '',
          );
        } else {
          // Otherwise, use getPublicJobs or getJobs based on user role
          response =
            !user || user?.role === 'employee'
              ? await jobService.getPublicJobs()
              : await jobService.getJobs();
        }

        setJobs(response.items);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, user]); // Dependencies include both searchParams and user

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchFilters.keyword) queryParams.set('title', searchFilters.keyword);
    if (searchFilters.location)
      queryParams.set('location', searchFilters.location);
    if (searchFilters.category)
      queryParams.set('category', searchFilters.category);
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
          {/* Location */}
          <div className='flex items-center gap-2 flex-1 border-b border-gray-200 dark:border-gray-600 lg:border-b-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-600 pb-4 lg:pb-0 pr-0 lg:pr-4'>
            <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0' />
            <input
              className='w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base'
              placeholder='Location'
              value={searchFilters.location}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
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

          {/* Find Job Button */}
          <div className='flex items-center pl-0 lg:pl-4 w-full lg:w-auto'>
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
            {jobs.length} jobs found
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
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm dark:shadow-gray-700/50 transition hover:shadow-md dark:hover:shadow-gray-600/50 relative hover:border-blue-600 dark:hover:border-blue-500'
              >
                <div className='flex items-center gap-3 mb-3'>
                  {job.companyLogo && (
                    <img
                      src={
                        job.companyLogo?.path ||
                        '/images/default-company-logo.png'
                      }
                      alt={job.companyName}
                      className='w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain'
                    />
                  )}
                  <div className='flex-1 min-w-0'>
                    <span className='font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate block'>
                      {job.companyName}
                    </span>
                    {job.isSaved && (
                      <span className='inline-block mt-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-2 py-0.5 rounded-full font-medium'>
                        Saved
                      </span>
                    )}
                  </div>
                </div>
                <div className='text-xs text-gray-400 dark:text-gray-500 mb-2'>
                  {job.location}
                </div>
                <Link
                  href={`/find-job/${job.id}`}
                  className='block text-blue-600 dark:text-blue-400 font-semibold text-base sm:text-lg mb-2 hover:underline line-clamp-2'
                >
                  {job.title}
                </Link>
                <div className='flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2 mb-3'>
                  <span>{job.employmentType}</span>
                  <span>•</span>
                  <span>
                    {job.salaryRange?.min || 'N/A'} -{' '}
                    {job.salaryRange?.max || 'N/A'}
                  </span>
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                  <div className='mb-1'>
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>
                <div className='flex items-center justify-between'>
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
                  <button
                    className='bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white flex items-center gap-1 sm:gap-2 transition border border-blue-200 dark:border-blue-700 text-xs sm:text-sm'
                    onClick={() => handleApplyClick(job.id)}
                  >
                    Apply
                    <ArrowRight className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                </div>
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
                    <button
                      className='bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white flex items-center gap-2 transition border border-blue-200 dark:border-blue-700 text-sm'
                      onClick={() => handleApplyClick(job.id)}
                    >
                      Apply Now
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
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
              onClick={() => {
                setSearchFilters({ keyword: '', location: '', category: '' });
                router.push('/find-job');
              }}
              className='px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className='flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10'>
            <button
              className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors'
              disabled={selectedPage === 1}
              onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
            >
              <span className='text-lg text-gray-700 dark:text-gray-300'>
                &larr;
              </span>
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium transition-colors text-sm ${
                  selectedPage === page
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors'
              disabled={selectedPage === totalPages}
              onClick={() =>
                setSelectedPage((p) => Math.min(totalPages, p + 1))
              }
            >
              <span className='text-lg text-gray-700 dark:text-gray-300'>
                &rarr;
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </main>
  );
}
