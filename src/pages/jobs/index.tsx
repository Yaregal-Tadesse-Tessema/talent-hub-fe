'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import {
  Bookmark,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import '@/styles/globals.css';

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FullTime: 'Full-Time',
  PartTime: 'Part-Time',
  Contract: 'Contract',
  Internship: 'Internship',
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    category: '',
  });

  // Update searchFilters when router is ready and query changes
  useEffect(() => {
    if (!router.isReady) return;
    setSearchFilters({
      keyword: (router.query.title as string) || '',
      location: (router.query.location as string) || '',
      category: (router.query.category as string) || '',
    });
  }, [router.isReady, router.query]);

  // Fetch jobs when searchFilters change and router is ready
  useEffect(() => {
    if (!router.isReady) return;
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await jobService.searchJobs(
          searchFilters.keyword,
          searchFilters.location,
          searchFilters.category,
        );
        setJobs(response.items);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [searchFilters, router.isReady]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchFilters.keyword) queryParams.set('title', searchFilters.keyword);
    if (searchFilters.location)
      queryParams.set('location', searchFilters.location);
    if (searchFilters.category)
      queryParams.set('category', searchFilters.category);
    router.push(`/jobs?${queryParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Navbar page='find-job' />
      <main className='min-h-screen pb-16 bg-gray-50 px-16'>
        {/* Search Bar */}
        <div className='bg-white shadow rounded-xl max-w-7xl mx-auto mt-8 px-4 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-0 border border-gray-200'>
          {/* Keyword */}
          <div className='flex items-center flex-1 px-3 border-b md:border-b-0 md:border-r pb-2 md:pb-0 pr-0 md:pr-4'>
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
          <div className='flex items-center flex-1 px-3 border-b md:border-b-0 md:border-r pb-2 md:pb-0 pr-0 md:pr-4'>
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
          <div className='flex items-center flex-1 px-3 border-b md:border-b-0 md:border-r pb-2 md:pb-0 pr-0 md:pr-4'>
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

          {/* Find Job Button 
          <div className='flex items-center pl-0 md:pl-4 w-full md:w-auto'>
            <button
              className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition w-full md:w-auto'
              onClick={handleSearch}
            >
              Find Job
            </button>
          </div>
          */}
        </div>

        {/* Job List */}
        <div className='max-w-5xl mx-auto px-4 pt-8'>
          {isLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className='flex flex-col gap-6'>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className='flex items-center justify-between rounded-xl border bg-white px-6 py-5 transition border-gray-200 hover:border-blue-600 shadow-sm'
                >
                  {/* Logo */}
                  <div className='flex items-center gap-4 min-w-[56px]'>
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo.path}
                        alt={job.companyName}
                        className='w-12 h-12 object-contain rounded'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400'>
                        <Briefcase className='w-6 h-6' />
                      </div>
                    )}
                  </div>
                  {/* Main Info */}
                  <div className='flex-1 min-w-0 ml-4'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-lg text-gray-900 truncate'>
                        {job.title}
                      </span>
                      {job.employmentType && (
                        <span className='ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                          {EMPLOYMENT_TYPE_LABELS[job.employmentType] ||
                            job.employmentType}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-wrap items-center gap-4 text-gray-500 text-sm'>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4' /> {job.location}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Briefcase className='w-4 h-4' />
                        {job.salaryRange?.min || 'N/A'} -{' '}
                        {job.salaryRange?.max || 'N/A'}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        Deadline:{' '}
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className='flex flex-col items-end gap-2 min-w-[120px]'>
                    <button
                      className='flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition'
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      Apply Now <ArrowRight className='w-4 h-4' />
                    </button>
                    <button className='p-2 rounded-full hover:bg-blue-100 transition'>
                      <Bookmark className='w-5 h-5 text-blue-400' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
                No jobs found
              </h2>
              <p className='text-gray-500'>
                Try adjusting your search criteria or browse all available jobs.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
