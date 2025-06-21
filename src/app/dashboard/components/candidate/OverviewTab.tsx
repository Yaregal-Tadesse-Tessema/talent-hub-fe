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
    <div className='flex-1 p-10 bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-xl font-semibold mb-1 text-gray-900 dark:text-white'>
        Hello, {userName}
      </h1>
      <p className='text-gray-500 dark:text-gray-400 mb-6'>
        Here is your daily activities and job alerts
      </p>

      {/* Stats Cards */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 flex flex-col items-start border border-gray-200 dark:border-gray-700'>
          <div className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
            {stats.appliedJobs}
          </div>
          <div className='text-gray-500 dark:text-gray-400'>Applied Jobs</div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 flex flex-col items-start border border-gray-200 dark:border-gray-700'>
          <div className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
            {stats.favoriteJobs}
          </div>
          <div className='text-gray-500 dark:text-gray-400'>Favorite Jobs</div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 flex flex-col items-start border border-gray-200 dark:border-gray-700'>
          <div className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
            {stats.jobAlerts}
          </div>
          <div className='text-gray-500 dark:text-gray-400'>Job Alerts</div>
        </div>
      </div>

      {/* Profile Alert */}
      {profileCompleteness < 100 && (
        <div className='bg-red-400 dark:bg-red-500 text-white rounded-lg p-6 flex items-center justify-between mb-8 border border-red-300 dark:border-red-400'>
          <div>
            <div className='font-medium text-lg mb-1'>
              Your profile is {profileCompleteness}% complete
            </div>
            <div className='text-white/80 dark:text-white/90'>
              Complete your profile editing & build your custom Resume
            </div>
          </div>
          <Link href='/profile'>
            <button className='bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 px-6 py-2 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 border border-red-200 dark:border-red-300 transition-colors'>
              Edit Profile →
            </button>
          </Link>
        </div>
      )}

      {/* Recently Applied Jobs */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div className='font-semibold text-lg text-gray-900 dark:text-white'>
            Recently Applied
          </div>
          <button
            onClick={handleViewAll}
            className='text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors'
          >
            View all →
          </button>
        </div>
        <div className='overflow-x-auto'>
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
                    <Link href={`/jobs/${application.JobPostId}`}>
                      <button className='px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition-colors'>
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
