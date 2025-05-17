import React, { useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { FiEdit2 } from 'react-icons/fi';

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
    daysRemaining: 4,
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
    daysRemaining: 4,
  },
  {
    id: 3,
    title: 'Front End Developer',
    company: 'Reddit',
    companyLogo: '/reddit.svg',
    companyColor: 'bg-orange-100',
    location: 'Mymensingh, Bangladesh',
    salary: '$10K-$15K',
    type: 'Internship',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 4,
    title: 'Marketing Officer',
    company: 'Facebook',
    companyLogo: '/facebook.svg',
    companyColor: 'bg-blue-200',
    location: 'Montana, USA',
    salary: '$50K-$60K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 5,
    title: 'Networking Engineer',
    company: 'Instagram',
    companyLogo: '/instagram.svg',
    companyColor: 'bg-pink-100',
    location: 'Michigan, USA',
    salary: '$5K-$10K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 6,
    title: 'Senior UX Designer',
    company: 'Slack',
    companyLogo: '/slack.svg',
    companyColor: 'bg-gray-100',
    location: 'United Kingdom of Great Britain',
    salary: '$30K-$35K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 7,
    title: 'Junior Graphic Designer',
    company: 'Facebook',
    companyLogo: '/facebook.svg',
    companyColor: 'bg-blue-600',
    location: 'Mymensingh, Bangladesh',
    salary: '$40K-$50K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 8,
    title: 'Product Designer',
    company: 'Twitter',
    companyLogo: '/twitter.svg',
    companyColor: 'bg-blue-300',
    location: 'Sivas, Turkey',
    salary: '$50K-$70K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 9,
    title: 'Project Manager',
    company: 'Upwork',
    companyLogo: '/upwork.svg',
    companyColor: 'bg-green-100',
    location: 'Ohio, USA',
    salary: '$50K-$80K',
    type: 'Full Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 10,
    title: 'Marketing Manager',
    company: 'Microsoft',
    companyLogo: '/microsoft.svg',
    companyColor: 'bg-yellow-100',
    location: 'Konya, Turkey',
    salary: '$20K-$25K',
    type: 'Temporary',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 11,
    title: 'Visual Designer',
    company: 'Apple',
    companyLogo: '/apple.svg',
    companyColor: 'bg-black',
    location: 'Washington, USA',
    salary: '$10K-$15K',
    type: 'Part Time',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
  {
    id: 12,
    title: 'Interaction Designer',
    company: 'Figma',
    companyLogo: '/figma.svg',
    companyColor: 'bg-black',
    location: 'Penn, USA',
    salary: '$35K-$40K',
    type: 'Remote',
    typeColor: 'bg-blue-100 text-blue-600',
    daysRemaining: 4,
  },
];

const totalJobs = 12;
const newJobs = 9;

export default function JobAlertsTab() {
  const [selectedJobId, setSelectedJobId] = useState(6); // Example: Senior UX Designer selected

  return (
    <div className='flex-1 p-10'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-xl font-semibold'>
          Job Alerts{' '}
          <span className='text-gray-400 font-normal'>
            ({newJobs} new jobs)
          </span>
        </h1>
        <button className='flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium'>
          <FiEdit2 className='text-base' /> Edit Job Alerts
        </button>
      </div>
      <div className='bg-white rounded-lg shadow p-0'>
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
            {/* Days Remaining */}
            <div className='col-span-3 text-xs flex items-center gap-2'>
              <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-500'>
                {job.daysRemaining} Days Remaining
              </span>
            </div>
            {/* Bookmark */}
            <div className='col-span-1 flex justify-center'>
              <FaRegBookmark className='text-gray-500 text-xl' />
            </div>
            {/* Action */}
            <div className='col-span-3 flex justify-end'>
              <button className='px-4 py-2 rounded font-medium bg-blue-50 text-blue-600 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-allhover:bg-blue-600 hover:text-white'>
                Apply Now <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
