import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';
import { applicationService } from '@/services/applicationService';
import type { Application } from '@/services/applicationService';

// Mock data for stats

export default function OverviewTab() {
  const router = useRouter();
  const [profileCompleteness, setProfileCompleteness] = useState<number>(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [stats, setStats] = useState<{
    appliedJobs: number;
    favoriteJobs: number;
    jobAlerts: number;
  }>({
    appliedJobs: 0,
    favoriteJobs: 0,
    jobAlerts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Set user name
          setUserName(`${userData.firstName} ${userData.lastName}`);

          // Fetch profile completeness
          const completenessData = await profileService.getProfileCompleteness(
            userData.id,
          );
          setProfileCompleteness(completenessData.percentage);

          // Fetch applications
          const applicationsData =
            await applicationService.getApplicationsByUserId(userData.id, 5);
          setApplications(applicationsData.items);
          setApplicationsCount(applicationsData.total);
          setStats({
            appliedJobs: applicationsData.total,
            favoriteJobs: 0,
            jobAlerts: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewAll = () => {
    router.push('/dashboard?tab=applied');
  };

  return (
    <div className='flex-1 p-4 sm:p-6 lg:p-4 bg-gray-50 dark:bg-gray-900'>
      {/* Header Section */}
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-gray-900 dark:text-white'>
          Hello, {userName}
        </h1>
        <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Here is your daily activities and job alerts
        </p>
      </div>

      {/* Stats Card */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-4 sm:p-6 mb-6 lg:mb-8 border border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8'>
          <div className='flex items-center gap-6 sm:gap-8'>
            <div className='text-center sm:text-left'>
              <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1'>
                {stats.appliedJobs}
              </div>
              <div className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium'>
                Applied Jobs
              </div>
            </div>
            <div className='w-px h-8 sm:h-12 bg-gray-300 dark:bg-gray-600'></div>
            <div className='text-center sm:text-left'>
              <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1'>
                {stats.favoriteJobs}
              </div>
              <div className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium'>
                Favorite Jobs
              </div>
            </div>
            <div className='w-px h-8 sm:h-12 bg-gray-300 dark:bg-gray-600'></div>
            <div className='text-center sm:text-left'>
              <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-1'>
                {stats.jobAlerts}
              </div>
              <div className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium'>
                Job Alerts
              </div>
            </div>
          </div>
          <div className='hidden sm:block'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Alert */}
      {profileCompleteness < 100 && (
        <div className='bg-red-400 dark:bg-red-500 text-white rounded-lg p-4 sm:p-6 mb-6 lg:mb-8 border border-red-300 dark:border-red-400'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex-1'>
              <div className='font-medium text-base sm:text-lg mb-1'>
                Your profile is {profileCompleteness}% complete
              </div>
              <div className='text-sm sm:text-base text-white/80 dark:text-white/90'>
                Complete your profile editing & build your custom Resume
              </div>
            </div>
            <Link href='/profile'>
              <button className='w-full sm:w-auto bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 px-4 sm:px-6 py-2 sm:py-3 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 border border-red-200 dark:border-red-300 transition-colors text-sm sm:text-base'>
                Edit Profile →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Recently Applied Jobs */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-4 sm:p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0'>
          <div className='font-semibold text-lg sm:text-xl text-gray-900 dark:text-white'>
            Recently Applied
          </div>
          <button
            onClick={handleViewAll}
            className='text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base transition-colors self-start sm:self-auto'
          >
            View all →
          </button>
        </div>

        {/* Mobile Cards View */}
        <div className='block sm:hidden space-y-4'>
          {applications.map((application) => (
            <div
              key={application.id}
              className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3'
            >
              <div className='space-y-1'>
                <div className='font-medium text-gray-900 dark:text-white text-sm'>
                  {application.jobPost?.title}
                </div>
                <div className='text-gray-400 dark:text-gray-500 text-xs flex flex-wrap gap-1 items-center'>
                  <span>{application.jobPost?.industry}</span>
                  <span>•</span>
                  <span>{application.jobPost?.position}</span>
                </div>
              </div>

              <div className='flex items-center justify-between text-xs'>
                <span className='text-gray-500 dark:text-gray-400'>
                  Applied:{' '}
                  {new Date(
                    application.jobPost?.createdAt,
                  ).toLocaleDateString()}
                </span>
                <span className='text-green-600 dark:text-green-400 font-medium'>
                  {application.status}
                </span>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard?tab=applied&applicationId=${application.id}`,
                  )
                }
                className='w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition-colors text-sm'
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className='hidden sm:block overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='text-gray-400 dark:text-gray-500 text-left'>
                <th className='py-2 px-4'>Job</th>
                <th className='py-2 px-4'>Date Applied</th>
                <th className='py-2 px-4'>Status</th>
                <th className='py-2 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className='border-t border-gray-200 dark:border-gray-700'
                >
                  <td className='py-3 px-4 flex items-center gap-3'>
                    <div>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {application.jobPost?.title}
                      </div>
                      <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-2 items-center'>
                        <span>{application.jobPost?.industry}</span>
                        <span>•</span>
                        <span>{application.jobPost?.position}</span>
                      </div>
                    </div>
                  </td>
                  <td className='py-3 px-4 text-gray-700 dark:text-gray-300'>
                    {new Date(
                      application.jobPost?.createdAt,
                    ).toLocaleDateString()}
                  </td>
                  <td className='py-3 px-4'>
                    <span className='text-green-600 dark:text-green-400 font-medium'>
                      {application.status}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard?tab=applied&applicationId=${application.id}`,
                        )
                      }
                      className='px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition-colors'
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className='text-center py-8'>
            <div className='text-gray-400 dark:text-gray-500 text-sm sm:text-base'>
              No applications yet. Start applying to jobs to see them here!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
