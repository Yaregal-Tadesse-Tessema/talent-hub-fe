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
        <div className='flex justify-center items-center min-h-[200px]'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
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
    <main className='min-h-screen pb-16'>
      {/* Page title and breadcrumb */}
      <div className='flex flex-col sm:flex-row justify-between bg-gray-100 items-center px-4 sm:px-16 pt-8 gap-2'>
        <h2 className='text-md text-gray-500'>Find Job</h2>
        <nav className='text-gray-400 text-sm flex items-center gap-1'>
          <span className='hover:text-gray-600 cursor-pointer'>Home</span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 font-medium'>Find Job</span>
        </nav>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className='flex justify-center items-center min-h-[200px]'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      )}

      {error && <div className='text-red-500 text-center py-4'>{error}</div>}

      {/* Top search/filter bar */}
      <div className='bg-gray-100 px-4 sm:px-16 py-4 pb-8 border-b'>
        <div className='flex flex-col lg:flex-row gap-4 items-center shadow rounded-xl px-4 sm:px-6 py-4 bg-white'>
          {/* Job title search */}
          <div className='flex items-center gap-2 flex-1 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 pr-0 lg:pr-4 w-full'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
              className='mr-2'
            >
              <circle cx='11' cy='11' r='7' strokeWidth='2' />
              <path d='M21 21l-4.35-4.35' strokeWidth='2' />
            </svg>
            <input
              className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400'
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
          <div className='flex items-center gap-2 flex-1 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 pr-0 lg:pr-4'>
            <MapPin className='w-5 h-5 text-blue-600 mr-2' />
            <input
              className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400'
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
          <div className='flex items-center gap-2 flex-1 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 pr-0 lg:pr-4'>
            <Briefcase className='w-5 h-5 text-blue-600 mr-2' />
            <select
              className='w-full bg-transparent border-none outline-none text-gray-700'
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
              className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition w-full lg:w-auto'
              onClick={handleSearch}
            >
              Find Job
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 pt-8'>
        {/* Card View */}
        {viewMode === 'card' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md relative hover:border-blue-600'
              >
                <div className='flex items-center gap-3 mb-2'>
                  {job.companyLogo && (
                    <img
                      src={job.companyLogo.path}
                      alt={job.companyName}
                      className='w-10 h-10 object-contain'
                    />
                  )}
                  <span className='font-semibold text-gray-800'>
                    {job.companyName}
                  </span>
                  {job.isSaved && (
                    <span className='ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                      Saved
                    </span>
                  )}
                </div>
                <div className='text-xs text-gray-400 mb-1'>{job.location}</div>
                <Link
                  href={`/find-job/${job.id}`}
                  className='block text-blue-600 font-semibold text-lg mb-1 hover:underline'
                >
                  {job.title}
                </Link>
                <div className='flex items-center text-xs text-gray-500 gap-2'>
                  <span>{job.employmentType}</span>
                  <span>•</span>
                  <span>
                    {job.salaryRange?.min || 'N/A'} -{' '}
                    {job.salaryRange?.max || 'N/A'}
                  </span>
                </div>
                <div className='mt-2 text-xs text-gray-500'>
                  <span>
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                  <span className='mx-2'>•</span>
                  <span>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className={`${job.isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                  onClick={() =>
                    job.isSaved
                      ? handleUnsaveJob(job.id)
                      : handleSaveJob(job.id)
                  }
                >
                  <Bookmark
                    className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`}
                  />
                </button>
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
                    flex items-center justify-between rounded-xl border bg-white px-6 py-5 transition
                    border-gray-200 hover:border-blue-600
                  `}
                  onMouseEnter={() => setHoveredJobId(job.id)}
                  onMouseLeave={() => setHoveredJobId(null)}
                >
                  {/* Logo */}
                  <div className='flex items-center gap-4 min-w-[56px]'>
                    {job.companyLogo && (
                      <img
                        src={job.companyLogo.path}
                        alt={job.companyName}
                        className='w-12 h-12 object-contain'
                      />
                    )}
                  </div>
                  {/* Main Info */}
                  <div className='flex-1 min-w-0 ml-4'>
                    <div className='flex items-center gap-2'>
                      <Link
                        href={`/find-job/${job.id}`}
                        className='font-semibold text-gray-800 text-base hover:underline text-blue-600'
                      >
                        {job.title}
                      </Link>
                      {job.isSaved && (
                        <span className='ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                          Saved
                        </span>
                      )}
                      {job.employmentType && (
                        <span className='ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                          {job.employmentType}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1'>
                      <span className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M12 21c-4.97-6.16-8-10.16-8-13A8 8 0 1 1 20 8c0 2.84-3.03 6.84-8 13z' />
                          <circle cx='12' cy='8' r='3' />
                        </svg>
                        {job.location}
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M12 21c-4.97-6.16-8-10.16-8-13A8 8 0 1 1 20 8c0 2.84-3.03 6.84-8 13z' />
                          <circle cx='12' cy='8' r='3' />
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
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
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
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Bookmark and Apply */}
                  <div className='flex items-center gap-4 ml-4'>
                    <button
                      className={`${job.isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                      onClick={() =>
                        job.isSaved
                          ? handleUnsaveJob(job.id)
                          : handleSaveJob(job.id)
                      }
                    >
                      <Bookmark
                        className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`}
                      />
                    </button>
                    <button
                      className='bg-blue-50 text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2 transition'
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
        {/* Pagination */}
        <div className='flex justify-center items-center gap-2 mt-10'>
          <button
            className='p-2 rounded-full hover:bg-gray-200 disabled:opacity-50'
            disabled={selectedPage === 1}
            onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
          >
            <span className='text-lg'>&larr;</span>
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${selectedPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setSelectedPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className='p-2 rounded-full hover:bg-gray-200 disabled:opacity-50'
            disabled={selectedPage === totalPages}
            onClick={() => setSelectedPage((p) => Math.min(totalPages, p + 1))}
          >
            <span className='text-lg'>&rarr;</span>
          </button>
        </div>
      </div>
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </main>
  );
}
