'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

const jobs = [
  {
    id: 1,
    title: 'Networking Engineer',
    company: 'Upwork',
    companyColor: 'bg-green-300',
    companyLogo: '/upwork.svg', // Placeholder, use initial if no logo
    location: 'Washington',
    salary: '$50k-80k/month',
    type: 'Remote',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Feb 2, 2019 19:28',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Dribbble',
    companyColor: 'bg-pink-200',
    companyLogo: '/dribbble.svg',
    location: 'Dhaka',
    salary: '$50k-80k/month',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Dec 7, 2019 23:26',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    company: 'Apple',
    companyColor: 'bg-black',
    companyLogo: '/apple.svg',
    location: 'Brazil',
    salary: '$50k-80k/month',
    type: 'Temporary',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Feb 2, 2019 19:28',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Visual Designer',
    company: 'Microsoft',
    companyColor: 'bg-[#F3F3F3]',
    companyLogo: '/microsoft.svg',
    location: 'Wisconsin',
    salary: '$50k-80k/month',
    type: 'Contract Base',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Dec 7, 2019 23:26',
    status: 'Active',
  },
  {
    id: 5,
    title: 'Marketing Officer',
    company: 'Twitter',
    companyColor: 'bg-blue-300',
    companyLogo: '/twitter.svg',
    location: 'United States',
    salary: '$50k-80k/month',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Dec 4, 2019 21:42',
    status: 'Active',
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Facebook',
    companyColor: 'bg-blue-600',
    companyLogo: '/facebook.svg',
    location: 'North Dakota',
    salary: '$50k-80k/month',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Dec 30, 2019 07:52',
    status: 'Active',
  },
  {
    id: 7,
    title: 'Software Engineer',
    company: 'Slack',
    companyColor: 'bg-gray-200',
    companyLogo: '/slack.svg',
    location: 'New York',
    salary: '$50k-80k/month',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Dec 30, 2019 05:18',
    status: 'Active',
  },
  {
    id: 8,
    title: 'Front End Developer',
    company: 'Reddit',
    companyColor: 'bg-orange-400',
    companyLogo: '/reddit.svg',
    location: 'Michigan',
    salary: '$50k-80k/month',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    date: 'Mar 20, 2019 23:14',
    status: 'Active',
  },
];

const totalJobs = 589;
const totalPages = 5;
const currentPage = 1;

export default function AppliedJobsTab() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(4); // Example: Visual Designer selected

  return (
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-6'>
        Applied Jobs{' '}
        <span className='text-gray-400 font-normal'>({totalJobs})</span>
      </h1>
      <div className='bg-white rounded-lg shadow p-0'>
        <div className='grid grid-cols-12 px-8 py-4 border-b text-xs text-gray-400 font-semibold'>
          <div className='col-span-5'>JOBS</div>
          <div className='col-span-3'>DATE APPLIED</div>
          <div className='col-span-2'>STATUS</div>
          <div className='col-span-2'>ACTION</div>
        </div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b mb-1 last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 bg-blue-50'
            onClick={() => setSelectedJobId(job.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <span
                className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg ${job.companyColor}`}
              >
                {/* If you have SVGs, use <img src={job.companyLogo} alt={job.company} className='w-6 h-6' /> */}
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className='w-6 h-6'
                  />
                ) : (
                  job.company[0]
                )}
              </span>
              <div>
                <div className='font-medium text-base'>{job.title}</div>
                <div className='text-gray-400 text-xs flex gap-2 items-center'>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                </div>
                <span
                  className={`inline-block ${job.typeColor} text-xs px-2 py-0.5 rounded mt-1`}
                >
                  {job.type}
                </span>
              </div>
            </div>
            {/* Date Applied */}
            <div className='col-span-3 text-sm'>{job.date}</div>
            {/* Status */}
            <div className='col-span-2 flex items-center gap-2 text-green-600 font-medium'>
              <FaCheckCircle className='text-green-500' />
              {job.status}
            </div>
            {/* Action */}
            <div className='col-span-2'>
              <button className='w-full px-4 py-2 rounded font-medium transition-all hover:bg-blue-600 hover:text-white bg-gray-100 text-blue-600 hover:bg-blue-100'>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className='flex justify-end mt-8'>
        <div className='flex items-center gap-2'>
          <button
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100'
            disabled
          >
            &lt;
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {page.toString().padStart(2, '0')}
            </button>
          ))}
          <button className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100'>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
