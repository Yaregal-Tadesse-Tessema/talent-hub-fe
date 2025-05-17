import React, { useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const jobs = [
  {
    id: 1,
    title: 'Technical Support Specialist',
    company: 'Google',
    companyLogo: '/google.svg',
    companyColor: 'bg-blue-100',
    location: 'Idaho, USA',
    salary: '$15K-$20K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: 'Job Expire',
    statusColor: 'text-red-500',
    deadline: 'Expired',
    deadlineColor: 'bg-gray-100 text-gray-400',
    daysRemaining: null,
    isExpired: true,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'YouTube',
    companyLogo: '/youtube.svg',
    companyColor: 'bg-red-100',
    location: 'Minnesota, USA',
    salary: '$10K-$15K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 3,
    title: 'Senior UX Designer',
    company: 'Slack',
    companyLogo: '/slack.svg',
    companyColor: 'bg-gray-100',
    location: 'United Kingdom of Great Britain',
    salary: '$30K-$35K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 4,
    title: 'Junior Graphic Designer',
    company: 'Apple',
    companyLogo: '/apple.svg',
    companyColor: 'bg-black',
    location: 'Mymensingh, Bangladesh',
    salary: '$40K-$50K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 5,
    title: 'Technical Support Specialist',
    company: 'Google',
    companyLogo: '/google.svg',
    companyColor: 'bg-blue-100',
    location: 'Idaho, USA',
    salary: '$15K-$20K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: 'Job Expire',
    statusColor: 'text-red-500',
    deadline: 'Expired',
    deadlineColor: 'bg-gray-100 text-gray-400',
    daysRemaining: null,
    isExpired: true,
  },
  {
    id: 6,
    title: 'Product Designer',
    company: 'Google',
    companyLogo: '/google.svg',
    companyColor: 'bg-blue-100',
    location: 'Sivas, Turkey',
    salary: '$50K-$70K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 7,
    title: 'Project Manager',
    company: 'Upwork',
    companyLogo: '/upwork.svg',
    companyColor: 'bg-green-100',
    location: 'Ohio, USA',
    salary: '$50K-$80K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 8,
    title: 'Technical Support Specialist',
    company: 'Google',
    companyLogo: '/google.svg',
    companyColor: 'bg-blue-100',
    location: 'Idaho, USA',
    salary: '$15K-$20K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: 'Job Expire',
    statusColor: 'text-red-500',
    deadline: 'Expired',
    deadlineColor: 'bg-gray-100 text-gray-400',
    daysRemaining: null,
    isExpired: true,
  },
  {
    id: 9,
    title: 'Marketing Manager',
    company: 'Microsoft',
    companyLogo: '/microsoft.svg',
    companyColor: 'bg-yellow-100',
    location: 'Konya, Turkey',
    salary: '$20K-$25K',
    type: 'Temporary',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 10,
    title: 'Visual Designer',
    company: 'Apple',
    companyLogo: '/apple.svg',
    companyColor: 'bg-black',
    location: 'Washington, USA',
    salary: '$10K-$15K',
    type: 'Part Time',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 11,
    title: 'Interaction Designer',
    company: 'Figma',
    companyLogo: '/figma.svg',
    companyColor: 'bg-black',
    location: 'Penn, USA',
    salary: '$35K-$40K',
    type: 'Remote',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
  {
    id: 12,
    title: 'Senior UX Designer',
    company: 'Upwork',
    companyLogo: '/upwork.svg',
    companyColor: 'bg-green-100',
    location: 'Sylhet, Bangladesh',
    salary: '$30K-$35K',
    type: 'Contract Base',
    typeColor: 'bg-blue-100 text-blue-600',
    status: null,
    statusColor: '',
    deadline: '4 Days Remaining',
    deadlineColor: 'bg-white text-gray-500',
    daysRemaining: 4,
    isExpired: false,
  },
];

const totalJobs = 17;
const totalPages = 5;
const currentPage = 1;

export default function FavoriteJobsTab() {
  const [selectedJobId, setSelectedJobId] = useState(3); // Example: Senior UX Designer selected

  return (
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-6'>
        Favorite Jobs{' '}
        <span className='text-gray-400 font-normal'>({totalJobs})</span>
      </h1>
      <div className='bg-white rounded-lg shadow p-0'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b last:border-b-0 transition-all hover:ring-2 hhover:hover:over:ring-blue-400 hover:bg-blue-50'
            onClick={() => setSelectedJobId(job.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <span
                className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg ${job.companyColor}`}
              >
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
                {job.status && (
                  <span
                    className={`ml-2 text-xs font-medium ${job.statusColor}`}
                  >
                    {job.status}
                  </span>
                )}
              </div>
            </div>
            {/* Deadline/Days Remaining */}
            <div className='col-span-3 text-xs flex items-center gap-2'>
              {job.daysRemaining && (
                <>
                  <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-500'>
                    {job.daysRemaining} Days Remaining
                  </span>
                </>
              )}
            </div>
            {/* Bookmark */}
            <div className='col-span-1 flex justify-center'>
              <FaRegBookmark className='text-gray-500 text-xl' />
            </div>
            {/* Action */}
            <div className='col-span-3 flex justify-end'>
              {job.isExpired ? (
                <button className='px-4 py-2 rounded font-medium bg-gray-100 text-gray-400 cursor-not-allowed'>
                  Deadline Expired
                </button>
              ) : (
                <button className='px-4 py-2 rounded font-medium bg-blue-50 text-blue-600 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all'>
                  Apply Now <FiArrowRight />
                </button>
              )}
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
