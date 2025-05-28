import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { profileService } from '@/services/profileService';

// Mock data for stats and jobs
const stats = [
  { label: 'Applied jobs', value: 589 },
  { label: 'Favorite jobs', value: 238 },
  { label: 'Job Alerts', value: 574 },
];

const jobs = [
  {
    id: 1,
    title: 'Networking Engineer',
    company: 'Upwork',
    location: 'Washington',
    salary: '$50k-80k/month',
    type: 'Remote',
    date: 'Feb 2, 2019 19:28',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Dribbble',
    location: 'Dhaka',
    salary: '$50k-80k/month',
    type: 'Full Time',
    date: 'Dec 7, 2019 23:26',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    company: 'Apple',
    location: 'Brazil',
    salary: '$50k-80k/month',
    type: 'Temporary',
    date: 'Feb 2, 2019 19:28',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Visual Designer',
    company: 'Microsoft',
    location: 'Wisconsin',
    salary: '$50k-80k/month',
    type: 'Contract Base',
    date: 'Dec 7, 2019 23:26',
    status: 'Active',
  },
];

export default function OverviewTab() {
  const [profileCompleteness, setProfileCompleteness] = useState<number>(0);

  useEffect(() => {
    const fetchProfileCompleteness = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const completenessData = await profileService.getProfileCompleteness(
            userData.id,
          );
          setProfileCompleteness(completenessData.percentage);
        }
      } catch (error) {
        console.error('Error fetching profile completeness:', error);
      }
    };

    fetchProfileCompleteness();
  }, []);

  return (
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-1'>Hello, Esther Howard</h1>
      <p className='text-gray-500 mb-6'>
        Here is your daily activities and job alerts
      </p>

      {/* Stats Cards */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='bg-white rounded-lg shadow p-6 flex flex-col items-start'
          >
            <div className='text-2xl font-bold mb-2'>{stat.value}</div>
            <div className='text-gray-500'>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Alert */}
      {profileCompleteness < 100 && (
        <div className='bg-red-400 text-white rounded-lg p-6 flex items-center justify-between mb-8'>
          <div>
            <div className='font-medium text-lg mb-1'>
              Your profile is {profileCompleteness}% complete
            </div>
            <div className='text-white/80'>
              Complete your profile editing & build your custom Resume
            </div>
          </div>
          <Link href='/profile'>
            <button className='bg-white text-red-500 px-6 py-2 rounded font-semibold hover:bg-gray-100'>
              Edit Profile →
            </button>
          </Link>
        </div>
      )}

      {/* Recently Applied Jobs */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='font-semibold text-lg'>Recently Applied</div>
          <Link href='#' className='text-blue-600 hover:underline text-sm'>
            View all →
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='text-gray-400 text-left'>
                <th className='py-2 px-4'>Job</th>
                <th className='py-2 px-4'>Date Applied</th>
                <th className='py-2 px-4'>Status</th>
                <th className='py-2 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className='border-t'>
                  <td className='py-3 px-4 flex items-center gap-3'>
                    <span className='w-10 h-10 rounded bg-gray-100 flex items-center justify-center font-bold text-lg'>
                      {job.company[0]}
                    </span>
                    <div>
                      <div className='font-medium'>{job.title}</div>
                      <div className='text-gray-400 text-xs flex gap-2 items-center'>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </div>
                      <span className='inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded mt-1'>
                        {job.type}
                      </span>
                    </div>
                  </td>
                  <td className='py-3 px-4'>{job.date}</td>
                  <td className='py-3 px-4'>
                    <span className='text-green-600 font-medium'>
                      {job.status}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <Link href='#'>
                      <button className='px-4 py-2 bg-blue-50 text-blue-600 rounded font-medium hover:bg-blue-100'>
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
