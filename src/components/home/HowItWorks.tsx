import React from 'react';

const steps = [
  {
    title: 'Create account',
    desc: 'Sign up for free and set up your profile in just a few minutes.',
    icon: (
      <svg
        width='48'
        height='48'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600 dark:text-blue-400 mx-auto'
      >
        <circle cx='12' cy='8' r='4' strokeWidth='2' />
        <path d='M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2' strokeWidth='2' />
        <path d='M16 3.13a4 4 0 0 1 0 7.75' strokeWidth='2' />
        <path d='M18 8l2 2' strokeWidth='2' />
      </svg>
    ),
  },
  {
    title: 'Upload CV/Resume',
    desc: 'Showcase your skills and experience to top employers by uploading your latest CV or resume.',
    icon: (
      <svg
        width='48'
        height='48'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-white mx-auto'
      >
        <circle cx='12' cy='12' r='10' fill='#2563eb' />
        <path d='M12 8v8m0 0l-3-3m3 3l3-3' strokeWidth='2' stroke='#fff' />
      </svg>
    ),
    highlight: true,
  },
  {
    title: 'Find suitable job',
    desc: 'Browse and search for jobs that match your interests, skills, and location.',
    icon: (
      <svg
        width='48'
        height='48'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600 dark:text-blue-400 mx-auto'
      >
        <circle cx='12' cy='12' r='10' strokeWidth='2' />
        <path d='M15 10l-4 4m0 0l-2-2m2 2V6' strokeWidth='2' />
      </svg>
    ),
  },
  {
    title: 'Apply job',
    desc: 'Submit your application and take the next step in your career journey.',
    icon: (
      <svg
        width='48'
        height='48'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600 dark:text-blue-400 mx-auto'
      >
        <circle cx='12' cy='12' r='10' strokeWidth='2' />
        <path d='M9 12l2 2 4-4' strokeWidth='2' />
      </svg>
    ),
  },
];

const Arrow = () => (
  <svg
    width='100'
    height='32'
    viewBox='0 0 100 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-2'
  >
    <path
      d='M2 16c30-16 66-16 96 0'
      stroke='#93C5FD'
      strokeWidth='2'
      strokeDasharray='6 6'
    />
    <path d='M98 16l-4-4m4 4l-4 4' stroke='#93C5FD' strokeWidth='2' />
  </svg>
);

export default function HowItWorks() {
  return (
    <section className='bg-[#F6F8FA] dark:bg-gray-900 py-12 sm:py-16 lg:py-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-900 dark:text-white'>
          How jobpilot work
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative'>
          {steps.map((step, i) => (
            <div
              key={i}
              className='flex flex-col items-center text-center relative z-10 px-2'
            >
              <div
                className={
                  step.highlight
                    ? 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20 rounded-2xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8 mb-4 border-2 border-blue-100 dark:border-blue-900/30 w-full max-w-[280px]'
                    : 'bg-white dark:bg-gray-800 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4 shadow dark:shadow-gray-900/20'
                }
              >
                {step.icon}
              </div>
              <div
                className={
                  step.highlight
                    ? 'font-semibold text-lg sm:text-xl mb-2 text-gray-900 dark:text-white'
                    : 'font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white'
                }
              >
                {step.title}
              </div>
              <div className='text-gray-400 dark:text-gray-300 max-w-xs mx-auto text-sm sm:text-base mb-2'>
                {step.desc}
              </div>
              {i < steps.length - 1 && (
                <span className='absolute right-0 lg:right-12 top-1/3 -translate-y-1/2'>
                  <Arrow />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
