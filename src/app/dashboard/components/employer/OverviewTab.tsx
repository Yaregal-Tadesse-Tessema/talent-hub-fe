import React, { useState, useRef, useEffect } from 'react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import JobDetailModal from './JobDetailModal';
import { useRouter } from 'next/navigation';

export default function OverviewTab() {
  const [user, setUser] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobs();
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

    fetchJobs();
  }, []);

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

  const handleViewDetail = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
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

  return (
    <div className='flex-1'>
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
      {/* Header */}
      <h1 className='text-2xl font-bold mb-1 text-gray-900 dark:text-white'>
        Hello, {user?.firstName}
      </h1>
      <p className='text-gray-500 dark:text-gray-400 mb-8'>
        Here is your daily activities and applications
      </p>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-6 mb-10'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700'>
          <span className='text-3xl'>📁</span>
          <div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {jobs.length}
            </div>
            <div className='text-gray-500 dark:text-gray-400'>Open Jobs</div>
          </div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700'>
          <span className='text-3xl'>🗂️</span>
          <div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0)}
            </div>
            <div className='text-gray-500 dark:text-gray-400'>
              Total Applications
            </div>
          </div>
        </div>
      </div>

      {/* Recently Posted Jobs Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div className='font-semibold text-lg text-gray-900 dark:text-white'>
            Recently Posted Jobs
          </div>
          <button
            className='text-blue-600 dark:text-blue-400 hover:underline text-sm'
            onClick={() => router.push('/my-jobs')}
          >
            View all →
          </button>
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
              {jobs.slice(0, 5).map((job) => {
                const daysRemaining = Math.ceil(
                  (new Date(job.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <tr
                    key={job.id}
                    className='border-t border-gray-200 dark:border-gray-700'
                  >
                    <td className='py-3 px-4'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {job.title}
                      </div>
                      <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-2 items-center'>
                        <span>{job.employmentType}</span>
                        <span>•</span>
                        <span>{daysRemaining} days remaining</span>
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
                      <button
                        className='px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 mr-2'
                        onClick={() => handleViewDetail(job)}
                      >
                        View Detail
                      </button>
                      <div
                        className='inline-block relative'
                        ref={(el) => {
                          menuRefs.current[job.id] = el;
                        }}
                      ></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
