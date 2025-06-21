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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    jobId: string;
    status: 'Withdrawn' | 'Posted';
  } | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const selectedJobParam = searchParams?.get('selectedJob');
    if (selectedJobParam) {
      setSelectedJobId(selectedJobParam);
    }
  }, [searchParams]);

  const fetchJobs = async (
    filterType: 'all' | 'active' | 'expired' = filter,
  ) => {
    try {
      setLoading(true);
      let queryParams = '';

      if (filterType !== 'all') {
        const conditions = [];
        if (filterType === 'active') {
          conditions.push('status:=:Posted');
        } else if (filterType === 'expired') {
          conditions.push('status:=:Expired');
        } else if (filterType === 'Withdrawn') {
          conditions.push('status:=:Withdrawn');
        } else if (filterType === 'Draft') {
          conditions.push('status:=:Draft');
        }
        if (conditions.length > 0) {
          queryParams = `q=w=${conditions.join(',')}`;
        }
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
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filter]);

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
        onBack={() => setSelectedJobId(null)}
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
                const daysRemaining = Math.ceil(
                  (new Date(job.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );

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
                          onClick={() => setSelectedJobId(job.id)}
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
                            setOpenMenuId(openMenuId === job.id ? null : job.id)
                          }
                          aria-label='Open actions menu'
                          type='button'
                        >
                          <span className='text-xl text-gray-700 dark:text-gray-300'>
                            ⋮
                          </span>
                        </button>
                        {openMenuId === job.id && (
                          <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-10'>
                            <button
                              className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              onClick={() => handleViewDetail(job)}
                            >
                              View Detail
                            </button>
                            {job.status === 'Draft' && (
                              <button
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                Delete Job
                              </button>
                            )}
                            {job.applicationCount === 0 && (
                              <button
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                onClick={() =>
                                  handleStatusChange(job.id, 'Withdrawn')
                                }
                              >
                                Withdraw Job
                              </button>
                            )}
                            {(!job.status || job.status === 'Draft') && (
                              <button
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                onClick={() =>
                                  handleStatusChange(job.id, 'Posted')
                                }
                              >
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
        {/* Pagination */}
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
      </div>
    </div>
  );
}
