import Link from 'next/link';
import React from 'react';

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
    location: 'Australia',
    salary: '$30K-$35K',
    days: '4 Days Remaining',
    featured: false,
  },
  {
    company: 'Apple',
    logo: (
      <div className='bg-gray-900 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm-2.07 3.6c2.07 0 3.6 1.53 3.6 3.6 0 2.07-1.53 3.6-3.6 3.6-2.07 0-3.6-1.53-3.6-3.6 0-2.07 1.53-3.6 3.6-3.6zm-6.93 7.2c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07zm2.07 3.6c2.07 0 3.6 1.53 3.6 3.6 0 2.07-1.53 3.6-3.6 3.6-2.07 0-3.6-1.53-3.6-3.6 0-2.07 1.53-3.6 3.6-3.6zm6.93 7.2c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07z' />
        </svg>
      </div>
    ),
    title: 'Software Engineer',
    tag: 'Full Time',
    location: 'China',
    salary: '$50K-$60K',
    days: '4 Days Remaining',
    featured: true,
  },
  {
    company: 'Figma',
    logo: (
      <div className='bg-black rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='24' height='24' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    title: 'Junior Graphic Designer',
    tag: 'Full Time',
    location: 'Canada',
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
    location: 'United States',
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
    <section className='py-20 bg-[#F8F9FB]'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='text-4xl font-bold'>Featured job</h2>
          <Link
            href='#'
            className='inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg text-blue-600 font-semibold bg-white hover:bg-blue-50 transition'
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
        <div className='space-y-6'>
          {jobs.map((job, i) => (
            <div
              key={job.title}
              className={
                job.featured
                  ? 'flex flex-col md:flex-row items-center justify-between bg-white border-2 border-blue-300 rounded-2xl shadow-lg p-6 scale-105'
                  : 'flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition'
              }
            >
              <div className='flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0'>
                {job.logo}
                <div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={
                        job.featured
                          ? 'text-blue-600 font-semibold text-lg'
                          : 'font-semibold text-lg'
                      }
                    >
                      {job.title}
                    </span>
                    <span
                      className={
                        job.featured
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-blue-50 text-blue-600'
                      }
                      px-3
                      py-1
                      rounded-lg
                      text-xs
                      font-semibold
                      ml-2
                    >
                      {job.tag}
                    </span>
                  </div>
                  <div className='flex flex-wrap items-center gap-4 text-gray-400 text-sm mt-2'>
                    <span>{job.location}</span>
                    <span className='flex items-center gap-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          d='M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z'
                          strokeWidth='2'
                        />
                        <circle cx='12' cy='13' r='4' strokeWidth='2' />
                      </svg>{' '}
                      {job.salary}
                    </span>
                    <span className='flex items-center gap-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          d='M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z'
                          strokeWidth='2'
                        />
                      </svg>{' '}
                      {job.days}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <button
                  className={
                    job.featured
                      ? 'bg-blue-50 p-2 rounded-lg'
                      : 'bg-blue-50 p-2 rounded-lg'
                  }
                >
                  <BookmarkIcon />
                </button>
                <button
                  className={
                    job.featured
                      ? 'px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition'
                      : 'px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-100 transition'
                  }
                >
                  Appley Now
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
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
