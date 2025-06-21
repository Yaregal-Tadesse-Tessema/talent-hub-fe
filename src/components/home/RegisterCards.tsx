import Link from 'next/link';
import React from 'react';

export default function RegisterCards() {
  return (
    <section className='py-20 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Candidate Card */}
          <div className='bg-gray-100 dark:bg-gray-800 rounded-2xl p-10 flex flex-col justify-center min-h-[260px]'>
            <h3 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Become a Candidate
            </h3>
            <p className='text-gray-500 dark:text-gray-300 mb-8'>
              Create your free account, upload your resume, and start applying
              to thousands of jobs that match your skills and interests. Take
              the next step in your career today!
            </p>
            <Link
              href='/signup'
              className='inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold rounded-lg shadow dark:shadow-gray-900/20 hover:bg-blue-50 dark:hover:bg-gray-600 transition w-max'
            >
              Register Now
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='#2563eb'
                className='dark:stroke-blue-400'
                strokeWidth='2'
              >
                <path d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
          {/* Employer Card */}
          <div className='bg-blue-800 dark:bg-blue-900 rounded-2xl p-10 flex flex-col justify-center min-h-[260px]'>
            <h3 className='text-3xl font-bold text-white mb-4'>
              Become an Employer
            </h3>
            <p className='text-blue-100 dark:text-blue-200 mb-8'>
              Post your job openings, review candidate profiles, and find the
              perfect talent for your company. Join our network of top employers
              and grow your team with ease.
            </p>
            <Link
              href='/signup'
              className='inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold rounded-lg shadow dark:shadow-gray-900/20 hover:bg-blue-50 dark:hover:bg-gray-600 transition w-max'
            >
              Register Now
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='#2563eb'
                className='dark:stroke-blue-400'
                strokeWidth='2'
              >
                <path d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
