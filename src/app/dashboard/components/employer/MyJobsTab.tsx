'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobApplicationsBoard from './JobApplicationsBoard';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import JobDetailModal from './JobDetailModal';
import { useEmployerChange } from '@/hooks/useEmployerChange';

const PAGE_SIZE = 8;

export default function MyJobsTab() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    jobId: string;
    status: 'Withdrawn' | 'Posted';
  } | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const selectedJobParam = searchParams?.get('selectedJob');
    if (selectedJobParam) {
      setSelectedJobId(selectedJobParam);
    } else {
      // Clear selectedJobId when no job is selected in URL params
      setSelectedJobId(null);
    }
  }, [searchParams]);

  // Clear selectedJobId when component mounts and no job is selected
  useEffect(() => {
    if (!searchParams?.get('selectedJob')) {
      setSelectedJobId(null);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchJobs = async (
    filterType: 'all' | 'active' | 'expired' = filter,
    search: string = debouncedSearchQuery,
  ) => {
    try {
      setLoading(true);
      let queryParams = '';

      const conditions = [];

      // Add search condition (case-insensitive)
      if (search.trim()) {
        conditions.push(`title:ILIKE:${search.trim().toLowerCase()}`);
      }

      // Add filter conditions

      if (filterType !== 'all') {
        if (filterType === 'active') {
          conditions.push('status:=:Posted');
        } else if (filterType === 'expired') {
          conditions.push('status:=:Expired');
        } else if (filterType === 'Withdrawn') {
          conditions.push('status:=:Withdrawn');
        } else if (filterType === 'Draft') {
          conditions.push('status:=:Draft');
        }
      }

      if (conditions.length > 0) {
        queryParams = `q=w=${conditions.join(',')}`;
      }

      const response = await jobService.getJobs(queryParams);
      setJobs(
        response.items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEmployerChange((employer) => {
    fetchJobs();
  });

  useEffect(() => {
    fetchJobs();
  }, [filter, debouncedSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const paginatedJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (
    jobId: string,
    status: 'Withdrawn' | 'Posted',
  ) => {
    setPendingStatusChange({ jobId, status });
    setShowConfirmDialog(true);
    setOpenMenuId(null);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      await jobService.changeJobStatus(
        pendingStatusChange.jobId,
        pendingStatusChange.status,
      );
      setJobs(
        jobs.map((job) =>
          job.id === pendingStatusChange.jobId
            ? { ...job, status: pendingStatusChange.status }
            : job,
        ),
      );
      showToast({
        type: 'success',
        message: `Job status changed to ${pendingStatusChange.status.toLowerCase()} successfully`,
      });
    } catch (error) {
      console.error('Error changing job status:', error);
      showToast({
        type: 'error',
        message: 'Failed to change job status. Please try again.',
      });
    } finally {
      setShowConfirmDialog(false);
      setPendingStatusChange(null);
    }
  };

  const handleViewDetail = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  const handleContinuePublishing = (jobId: string) => {
    router.push(`/post-job?jobId=${jobId}`);
    setOpenMenuId(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast({
        type: 'error',
        message: 'Failed to delete job. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-500 dark:text-red-400'>{error}</div>
        </div>
      </div>
    );
  }

  if (selectedJobId) {
    return (
      <JobApplicationsBoard
        jobId={selectedJobId}
        onBack={() => {
          setSelectedJobId(null);
          // Clear the URL parameter when going back
          const newSearchParams = new URLSearchParams(
            searchParams?.toString() || '',
          );
          newSearchParams.delete('selectedJob');
          router.replace(
            `/dashboard?tab=myjobs${newSearchParams.toString() ? `&${newSearchParams.toString()}` : ''}`,
          );
        }}
      />
    );
  }

  return (
    <div className='flex-1'>
      {showConfirmDialog && pendingStatusChange && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
              Confirm Status Change
            </h3>
            <p className='mb-6 text-gray-600 dark:text-gray-300'>
              Are you sure you want to change this job's status to{' '}
              {pendingStatusChange.status.toLowerCase()}?
            </p>
            <div className='flex justify-end gap-4'>
              <button
                className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingStatusChange(null);
                }}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div className='font-semibold text-lg text-gray-900 dark:text-white'>
            Jobs ({jobs.length})
          </div>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search by job title...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when search changes
                }}
                className='border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 w-64 pr-8'
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                >
                  ✕
                </button>
              )}
            </div>
            <select
              className='border border-gray-300 dark:border-gray-600 w-24 rounded px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700'
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as 'all' | 'active' | 'expired');
                setPage(1); // Reset to first page when filter changes
              }}
            >
              <option value='all'>All Jobs</option>
              <option value='active'>Active</option>
              <option value='expired'>Expired</option>
              <option value='Withdrawn'>Withdrawn</option>
              <option value='Draft'>Draft</option>
            </select>
          </div>
        </div>
        {jobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-gray-400 dark:text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No jobs found
            </h3>
            <p className='text-gray-500 dark:text-gray-400 max-w-sm'>
              {filter === 'all'
                ? "You haven't created any jobs yet. Start by creating your first job posting."
                : `No ${filter} jobs found. Try changing the filter or create a new job.`}
            </p>
            <button
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700'
              onClick={() => router.push('/dashboard?tab=postjob')}
            >
              Create New Job
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='text-gray-400 dark:text-gray-500 text-left'>
                  <th className='py-2 px-4'>Job</th>
                  <th className='py-2 px-4'>Status</th>
                  <th className='py-2 px-4'>Applications</th>
                  <th className='py-2 px-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => {
                  return (
                    <tr
                      key={job.id}
                      className='border-t border-gray-200 dark:border-gray-700 transition-colors group hover:border-b hover:border-r hover:border-l hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-600 dark:hover:border-blue-400'
                    >
                      <td className='py-3 px-4'>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {job.title}
                        </div>
                        <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-2 items-center'>
                          <span>{job.employmentType}</span>
                          <span>•</span>
                          <span>
                            {Math.ceil(
                              (new Date().getTime() -
                                new Date(job.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}
                            d
                          </span>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className={`font-medium ${
                            job.status === 'Posted'
                              ? 'text-green-600 dark:text-green-400'
                              : job.status === 'Withdrawn'
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {job.status || 'Draft'}
                        </span>
                      </td>
                      <td className='py-3 px-4 text-gray-900 dark:text-white'>
                        {job.applicationCount || 0} Applications
                      </td>
                      <td className='py-3 px-4'>
                        {job.status !== 'Draft' && (
                          <button
                            className='px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 mr-2'
                            onClick={() => {
                              setSelectedJobId(job.id);
                              // Set the URL parameter when viewing applications
                              const newSearchParams = new URLSearchParams(
                                searchParams?.toString() || '',
                              );
                              newSearchParams.set('selectedJob', job.id);
                              router.replace(
                                `/dashboard?tab=myjobs&${newSearchParams.toString()}`,
                              );
                            }}
                          >
                            View Applications
                          </button>
                        )}
                        <div
                          className='inline-block relative'
                          ref={(el) => {
                            menuRefs.current[job.id] = el;
                          }}
                        >
                          <button
                            className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === job.id ? null : job.id,
                              )
                            }
                            aria-label='Open actions menu'
                            type='button'
                          >
                            <span className='text-xl text-gray-700 dark:text-gray-300'>
                              ⋮
                            </span>
                          </button>
                          {openMenuId === job.id && (
                            <div className='absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10 overflow-hidden'>
                              <button
                                className='flex items-center w-full px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-colors duration-150'
                                onClick={() => handleViewDetail(job)}
                              >
                                <svg
                                  className='w-4 h-4 mr-3 text-blue-600 dark:text-blue-400'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                                View Detail
                              </button>
                              {job.status === 'Draft' && (
                                <>
                                  <button
                                    className='flex items-center w-full px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 transition-colors duration-150'
                                    onClick={() =>
                                      handleContinuePublishing(job.id)
                                    }
                                  >
                                    <svg
                                      className='w-4 h-4 mr-3 text-green-600 dark:text-green-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                      />
                                    </svg>
                                    <span className='whitespace-nowrap'>
                                      Continue Publishing
                                    </span>
                                  </button>
                                  <button
                                    className='flex items-center w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 transition-colors duration-150'
                                    onClick={() => handleDeleteJob(job.id)}
                                  >
                                    <svg
                                      className='w-4 h-4 mr-3 text-red-600 dark:text-red-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                      />
                                    </svg>
                                    Delete Job
                                  </button>
                                </>
                              )}
                              {job.applicationCount === 0 && (
                                <button
                                  className='flex items-center w-full px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 transition-colors duration-150'
                                  onClick={() =>
                                    handleStatusChange(job.id, 'Withdrawn')
                                  }
                                >
                                  <svg
                                    className='w-4 h-4 mr-3 text-orange-600 dark:text-orange-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M6 18L18 6M6 6l12 12'
                                    />
                                  </svg>
                                  Withdraw Job
                                </button>
                              )}
                              {(!job.status || job.status === 'Draft') && (
                                <button
                                  className='flex items-center w-full px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 transition-colors duration-150'
                                  onClick={() =>
                                    handleStatusChange(job.id, 'Posted')
                                  }
                                >
                                  <svg
                                    className='w-4 h-4 mr-3 text-emerald-600 dark:text-emerald-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M5 13l4 4L19 7'
                                    />
                                  </svg>
                                  Post Job
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {jobs.length > 0 && (
          <div className='flex justify-center items-center gap-2 mt-8'>
            <button
              className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <span>&larr;</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setPage(i + 1)}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
            <button
              className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
