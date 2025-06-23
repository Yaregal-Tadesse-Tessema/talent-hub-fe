import React, { useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { FiEdit2 } from 'react-icons/fi';
import AlertConfigurationModal from '@/components/ui/AlertConfigurationModal';

const jobs = [
  {
    id: 1,
    title: 'Technical Support Specialist',
    company: 'Google',
    companyLogo: '/google.svg',
    companyColor: 'bg-blue-100 dark:bg-blue-900/30',
    location: 'Idaho, USA',
    salary: '$15K-$20K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'YouTube',
    companyLogo: '/youtube.svg',
    companyColor: 'bg-red-100 dark:bg-red-900/30',
    location: 'Minnesota, USA',
    salary: '$10K-$15K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 3,
    title: 'Front End Developer',
    company: 'Reddit',
    companyLogo: '/reddit.svg',
    companyColor: 'bg-orange-100 dark:bg-orange-900/30',
    location: 'Mymensingh, Bangladesh',
    salary: '$10K-$15K',
    type: 'Internship',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 4,
    title: 'Marketing Officer',
    company: 'Facebook',
    companyLogo: '/facebook.svg',
    companyColor: 'bg-blue-200 dark:bg-blue-800/30',
    location: 'Montana, USA',
    salary: '$50K-$60K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 5,
    title: 'Networking Engineer',
    company: 'Instagram',
    companyLogo: '/instagram.svg',
    companyColor: 'bg-pink-100 dark:bg-pink-900/30',
    location: 'Michigan, USA',
    salary: '$5K-$10K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 6,
    title: 'Senior UX Designer',
    company: 'Slack',
    companyLogo: '/slack.svg',
    companyColor: 'bg-gray-100 dark:bg-gray-700',
    location: 'United Kingdom of Great Britain',
    salary: '$30K-$35K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 7,
    title: 'Junior Graphic Designer',
    company: 'Facebook',
    companyLogo: '/facebook.svg',
    companyColor: 'bg-blue-600 dark:bg-blue-500',
    location: 'Mymensingh, Bangladesh',
    salary: '$40K-$50K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 8,
    title: 'Product Designer',
    company: 'Twitter',
    companyLogo: '/twitter.svg',
    companyColor: 'bg-blue-300 dark:bg-blue-600',
    location: 'Sivas, Turkey',
    salary: '$50K-$70K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 9,
    title: 'Project Manager',
    company: 'Upwork',
    companyLogo: '/upwork.svg',
    companyColor: 'bg-green-100 dark:bg-green-900/30',
    location: 'Ohio, USA',
    salary: '$50K-$80K',
    type: 'Full Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 10,
    title: 'Marketing Manager',
    company: 'Microsoft',
    companyLogo: '/microsoft.svg',
    companyColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    location: 'Konya, Turkey',
    salary: '$20K-$25K',
    type: 'Temporary',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 11,
    title: 'Visual Designer',
    company: 'Apple',
    companyLogo: '/apple.svg',
    companyColor: 'bg-black dark:bg-gray-800',
    location: 'Washington, USA',
    salary: '$10K-$15K',
    type: 'Part Time',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
  {
    id: 12,
    title: 'Interaction Designer',
    company: 'Figma',
    companyLogo: '/figma.svg',
    companyColor: 'bg-black dark:bg-gray-800',
    location: 'Penn, USA',
    salary: '$35K-$40K',
    type: 'Remote',
    typeColor:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    daysRemaining: 4,
  },
];

const totalJobs = 12;
const newJobs = 9;

export default function JobAlertsTab() {
  const [selectedJobId, setSelectedJobId] = useState(6); // Example: Senior UX Designer selected
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleAlertSuccess = () => {
    // You can add a toast notification here
    console.log('Alert configuration added successfully');
    // Optionally refresh the job alerts data
  };

  const handleAlertError = (error: string) => {
    // You can add a toast notification here
    console.error('Alert configuration error:', error);
  };

  return (
    <div className='flex-1 px-10 py-4 bg-gray-50 dark:bg-gray-900'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Job Alerts{' '}
          <span className='text-gray-400 dark:text-gray-500 font-normal'>
            ({newJobs} new jobs)
          </span>
        </h1>
        <button
          className='flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors'
          onClick={() => setShowAlertModal(true)}
        >
          <FiEdit2 className='text-base' /> Edit Job Alerts
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-0 border border-gray-200 dark:border-gray-700'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b border-gray-200 dark:border-gray-700 mb-1 last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
            onClick={() => setSelectedJobId(job.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <span
                className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg ${job.companyColor} text-gray-700 dark:text-gray-300`}
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
                <div className='font-medium text-base text-gray-900 dark:text-white'>
                  {job.title}
                </div>
                <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-2 items-center'>
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
              <span className='bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400'>
                {job.daysRemaining} Days Remaining
              </span>
            </div>
            {/* Bookmark */}
            <div className='col-span-1 flex justify-center'>
              <FaRegBookmark className='text-gray-500 dark:text-gray-400 text-xl' />
            </div>
            {/* Action */}
            <div className='col-span-3 flex justify-end'>
              <button className='px-4 py-2 rounded font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all border border-blue-200 dark:border-blue-700'>
                Apply Now <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Configuration Modal */}
      <AlertConfigurationModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onSuccess={handleAlertSuccess}
        onError={handleAlertError}
      />
    </div>
  );
}
