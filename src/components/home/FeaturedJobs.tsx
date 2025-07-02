import Link from 'next/link';
import React from 'react';
import { ShareButton } from '@/components/ui/ShareButton';

const jobs = [
  {
    company: 'Upwork',
    logo: (
      <div className='bg-green-400 rounded-lg w-12 h-12 flex items-center justify-center'>
        <span className='text-white font-bold text-xl'>Up</span>
      </div>
    ),
    title: 'Senior UX Designer',
    tag: 'Contract Base',
    location: 'Addis Ababa',
    salary: '$30K-$35K',
    days: '4 Days Remaining',
    featured: false,
  },
  {
    company: 'Apple',
    logo: (
      <div className='bg-gray-900 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm-2.07 3.6c2.07 0 3.6 1.53 3.6 3.6 0 2.07-1.53 3.6-3.6 3.6-2.07 0-3.6-1.53-3.6-3.6 0-2.07 1.53-3.6 3.6-3.6zm-6.93 7.2c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07zm2.07 3.6c2.07 0 3.6 1.53 3.6 3.6 0 2.07-1.53 3.6-3.6 3.6-2.07 0-3.6-1.53-3.6-3.6 0-2.07 1.53-3.6 3.6-3.6zm6.93 7.2c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07z' />
        </svg>
      </div>
    ),
    title: 'Software Engineer',
    tag: 'Full Time',
    location: 'Addis Ababa',
    salary: '$50K-$60K',
    days: '4 Days Remaining',
    featured: true,
  },
  {
    company: 'Figma',
    logo: (
      <div className='bg-black dark:bg-gray-800 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='24' height='24' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    title: 'Junior Graphic Designer',
    tag: 'Full Time',
    location: 'Addis Ababa',
    salary: '$50K-$70K',
    days: '4 Days Remaining',
    featured: false,
  },
  {
    company: 'Udemy',
    logo: (
      <div className='bg-red-400 rounded-lg w-12 h-12 flex items-center justify-center'>
        <span className='text-white font-bold text-xl'>U</span>
      </div>
    ),
    title: 'Product Designer',
    tag: 'Full Time',
    location: 'Addis Ababa',
    salary: '$35K-$40K',
    days: '4 Days Remaining',
    featured: false,
  },
];

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width='24'
    height='24'
    fill={filled ? '#2563eb' : 'none'}
    viewBox='0 0 24 24'
    stroke='#2563eb'
    strokeWidth='2'
  >
    <path d='M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-5-7 5V5z' />
  </svg>
);

export default function FeaturedJobs() {
  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-[#F8F9FB] dark:bg-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
            Featured job
          </h2>
          <Link
            href='#'
            className='inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition w-full sm:w-auto justify-center'
          >
            View All
            <svg
              width='20'
              height='20'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M9 5l7 7-7 7' strokeWidth='2' />
            </svg>
          </Link>
        </div>
        <div className='space-y-4 sm:space-y-6'>
          {jobs.map((job, i) => (
            <div
              key={job.title}
              className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-gray-900/20 hover:scale-[1.02] transition'
            >
              <div className='flex items-start sm:items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0'>
                {job.logo}
                <div className='flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-semibold text-base sm:text-lg text-gray-900 dark:text-white'>
                      {job.title}
                    </span>
                    <span className='bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold'>
                      {job.tag}
                    </span>
                  </div>
                  <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-gray-400 dark:text-gray-300 text-sm mt-2'>
                    <span className='flex items-center gap-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='flex-shrink-0'
                      >
                        <path
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                          strokeWidth='2'
                        />
                        <path
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                          strokeWidth='2'
                        />
                      </svg>
                      {job.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='flex-shrink-0'
                      >
                        <path
                          d='M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z'
                          strokeWidth='2'
                        />
                        <circle cx='12' cy='13' r='4' strokeWidth='2' />
                      </svg>
                      {job.salary}
                    </span>
                    <span className='flex items-center gap-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='flex-shrink-0'
                      >
                        <path
                          d='M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z'
                          strokeWidth='2'
                        />
                      </svg>
                      {job.days}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end'>
                <button className='bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition'>
                  <BookmarkIcon />
                </button>
                <ShareButton />
                <button className='flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition'>
                  Apply Now
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='flex-shrink-0'
                  >
                    <path d='M9 5l7 7-7 7' strokeWidth='2' />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
