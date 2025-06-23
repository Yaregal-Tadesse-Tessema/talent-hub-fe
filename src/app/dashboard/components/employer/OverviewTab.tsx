import React, { useState, useRef, useEffect } from 'react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import JobDetailModal from './JobDetailModal';
import { useRouter } from 'next/navigation';
import {
  BriefcaseIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function OverviewTab() {
  const [user, setUser] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    avgApplicationsPerJob: 0,
    jobsExpiringSoon: 0,
    jobsWithHighApplications: 0,
  });
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
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobs();
        const sortedJobs = response.items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setJobs(sortedJobs);

        // Calculate statistics
        const totalJobs = sortedJobs.length;
        const activeJobs = sortedJobs.filter(
          (job) => job.status === 'Posted',
        ).length;
        const totalApplications = sortedJobs.reduce(
          (acc, job) => acc + (job.applicationCount || 0),
          0,
        );
        const avgApplicationsPerJob =
          totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;

        // Jobs expiring in next 7 days
        const jobsExpiringSoon = sortedJobs.filter((job) => {
          const daysRemaining = Math.ceil(
            (new Date(job.deadline).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return daysRemaining <= 7 && daysRemaining > 0;
        }).length;

        // Jobs with high applications (more than 10)
        const jobsWithHighApplications = sortedJobs.filter(
          (job) => (job.applicationCount || 0) > 10,
        ).length;

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          avgApplicationsPerJob,
          jobsExpiringSoon,
          jobsWithHighApplications,
        });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Posted':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'Withdrawn':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'Draft':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Posted':
        return <CheckCircleIcon className='w-4 h-4' />;
      case 'Withdrawn':
        return <XCircleIcon className='w-4 h-4' />;
      case 'Draft':
        return <ExclamationTriangleIcon className='w-4 h-4' />;
      default:
        return <ClockIcon className='w-4 h-4' />;
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

  return (
    <div className='flex-1 px-10 py-4 space-y-8'>
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

      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold mb-1 text-gray-900 dark:text-white'>
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-lg'>
          Here's what's happening with your job postings today
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Total Jobs Card */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-blue-600 dark:text-blue-400 text-sm font-medium'>
                Total Jobs
              </p>
              <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                {stats.totalJobs}
              </p>
              <p className='text-blue-700 dark:text-blue-300 text-sm'>
                {stats.activeJobs} currently active
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'>
              <BriefcaseIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-green-600 dark:text-green-400 text-sm font-medium'>
                Total Applications
              </p>
              <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                {stats.totalApplications}
              </p>
              <p className='text-green-700 dark:text-green-300 text-sm'>
                Avg. {stats.avgApplicationsPerJob} per job
              </p>
            </div>
            <div className='w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center'>
              <UserGroupIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* Jobs Expiring Soon Card */}
        <div className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-orange-600 dark:text-orange-400 text-sm font-medium'>
                Expiring Soon
              </p>
              <p className='text-3xl font-bold text-orange-900 dark:text-orange-100'>
                {stats.jobsExpiringSoon}
              </p>
              <p className='text-orange-700 dark:text-orange-300 text-sm'>
                Within 7 days
              </p>
            </div>
            <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center'>
              <ClockIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* High Application Jobs Card */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-purple-600 dark:text-purple-400 text-sm font-medium'>
                Popular Jobs
              </p>
              <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                {stats.jobsWithHighApplications}
              </p>
              <p className='text-purple-700 dark:text-purple-300 text-sm'>
                10+ applications
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center'>
              <ChartBarIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* Active Jobs Card */}
        <div className='bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>
                Active Jobs
              </p>
              <p className='text-3xl font-bold text-emerald-900 dark:text-emerald-100'>
                {stats.activeJobs}
              </p>
              <p className='text-emerald-700 dark:text-emerald-300 text-sm'>
                Currently posted
              </p>
            </div>
            <div className='w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center'>
              <EyeIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='space-y-4'>
            <p className='text-gray-600 dark:text-gray-400 text-sm font-medium'>
              Quick Actions
            </p>
            <div className='space-y-3'>
              <button
                onClick={() => router.push('/post-job')}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Post New Job
              </button>
              <button
                onClick={() => router.push('/dashboard?tab=myjobs')}
                className='w-full bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Manage Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Posted Jobs Table */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='space-y-1'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Recently Posted Jobs
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Your latest job postings and their performance
            </p>
          </div>
          <button
            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors'
            onClick={() => router.push('/dashboard?tab=myjobs')}
          >
            View all →
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-gray-50 dark:bg-gray-700/50'>
              <tr>
                <th className='py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Job Details
                </th>
                <th className='py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Status
                </th>
                <th className='py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Applications
                </th>
                <th className='py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {jobs.slice(0, 5).map((job) => {
                const daysRemaining = Math.ceil(
                  (new Date(job.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <tr
                    key={job.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                  >
                    <td className='py-4 px-6'>
                      <div className='space-y-2'>
                        <div className='font-semibold text-gray-900 dark:text-white'>
                          {job.title}
                        </div>
                        <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center gap-1'>
                            <BriefcaseIcon className='w-4 h-4' />
                            <span>{job.employmentType}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MapPinIcon className='w-4 h-4' />
                            <span>{job.location}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <CalendarDaysIcon className='w-4 h-4' />
                            <span
                              className={
                                daysRemaining <= 7
                                  ? 'text-orange-600 dark:text-orange-400 font-medium'
                                  : ''
                              }
                            >
                              {daysRemaining} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status || 'Draft')}`}
                      >
                        {getStatusIcon(job.status || 'Draft')}
                        {job.status || 'Draft'}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='space-y-1'>
                        <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {job.applicationCount || 0}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          applications
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <button
                        className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors'
                        onClick={() => handleViewDetail(job)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {jobs.length === 0 && (
          <div className='text-center py-12'>
            <BriefcaseIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No jobs posted yet
            </h3>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              Start by posting your first job to attract candidates
            </p>
            <button
              onClick={() => router.push('/dashboard?tab=postjob')}
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
            >
              Post Your First Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
