import React from 'react';

const BriefcaseIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-blue-600'
  >
    <rect x='3' y='7' width='18' height='13' rx='2' strokeWidth='2' />
    <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' strokeWidth='2' />
  </svg>
);
const BuildingIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-blue-600'
  >
    <rect x='3' y='3' width='18' height='18' rx='2' strokeWidth='2' />
    <path d='M9 21V9h6v12' strokeWidth='2' />
  </svg>
);
const UserGroupIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-blue-600'
  >
    <path d='M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' strokeWidth='2' />
    <circle cx='9' cy='7' r='4' strokeWidth='2' />
    <path d='M23 20v-2a4 4 0 0 0-3-3.87' strokeWidth='2' />
    <path d='M16 3.13a4 4 0 0 1 0 7.75' strokeWidth='2' />
  </svg>
);

const Illustration = () => (
  <svg
    width='320'
    height='220'
    viewBox='0 0 320 220'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width='320' height='220' rx='16' fill='#F3F6FB' />
    <circle cx='160' cy='110' r='60' fill='#2563eb' fillOpacity='0.1' />
    <rect
      x='100'
      y='80'
      width='120'
      height='60'
      rx='8'
      fill='#2563eb'
      fillOpacity='0.2'
    />
    <rect
      x='120'
      y='100'
      width='80'
      height='20'
      rx='4'
      fill='#2563eb'
      fillOpacity='0.3'
    />
    <rect
      x='140'
      y='110'
      width='40'
      height='8'
      rx='2'
      fill='#2563eb'
      fillOpacity='0.4'
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width='20'
    height='20'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-blue-600'
  >
    <path
      d='M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z'
      strokeWidth='2'
    />
    <circle cx='12' cy='13' r='4' strokeWidth='2' />
  </svg>
);

export default function HeroSection() {
  return (
    <section className='bg-[#F8F9FB] pt-16 pb-12'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4'>
        {/* Left: Text and Search */}
        <div className='flex-1 max-w-xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Find a job that suits your interest & skills.
          </h1>
          <p className='text-lg text-gray-500 mb-8'>
            Discover thousands of opportunities tailored to your expertise and
            passion. Start your journey to a brighter career with us—your dream
            job is just a search away.
          </p>
          <form className='flex flex-col md:flex-row items-center bg-white rounded-full shadow-md p-2 mb-3 gap-2 md:gap-0 border border-gray-200'>
            <div className='flex items-center flex-1 px-3'>
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='text-gray-400 mr-2'
              >
                <circle cx='11' cy='11' r='7' strokeWidth='2' />
                <path d='M21 21l-4.35-4.35' strokeWidth='2' />
              </svg>
              <input
                className='w-full bg-gray-50 rounded-full px-4 py-2 outline-none text-gray-700 border-none focus:ring-2 focus:ring-blue-100 transition'
                placeholder='Job title, Keyword...'
              />
            </div>
            <div className='h-6 w-px bg-gray-200 hidden md:block' />
            <div className='flex items-center flex-1 px-3'>
              <LocationIcon />
              <input
                className='w-full bg-gray-50 rounded-full px-4 py-2 outline-none text-gray-700 ml-2 border-none focus:ring-2 focus:ring-blue-100 transition'
                placeholder='Your Location'
              />
            </div>
            <button
              type='submit'
              className='ml-0 md:ml-4 mt-2 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow'
            >
              Find Job
            </button>
          </form>
          <div className='text-sm text-gray-400 mb-2'>
            Suggestion:{' '}
            <span className='text-gray-600'>Designer, Programming,</span>{' '}
            <span className='text-blue-600 font-medium cursor-pointer'>
              Digital Marketing
            </span>
            , <span className='text-gray-600'>Video, Animation.</span>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className='flex-1 flex justify-center'>
          <Illustration />
        </div>
      </div>
      {/* Stats Cards */}
      <div className='max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16'>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-4'>
          <BriefcaseIcon />
          <div>
            <div className='text-2xl font-bold text-gray-900'>1,75,324</div>
            <div className='text-gray-500 text-sm'>Live Job</div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-4'>
          <BuildingIcon />
          <div>
            <div className='text-2xl font-bold text-gray-900'>97,354</div>
            <div className='text-gray-500 text-sm'>Companies</div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-4'>
          <UserGroupIcon />
          <div>
            <div className='text-2xl font-bold text-gray-900'>38,47,154</div>
            <div className='text-gray-500 text-sm'>Candidates</div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-4'>
          <BriefcaseIcon />
          <div>
            <div className='text-2xl font-bold text-gray-900'>7,532</div>
            <div className='text-gray-500 text-sm'>New Jobs</div>
          </div>
        </div>
      </div>
    </section>
  );
}
