import React from 'react';

const companies = [
  {
    name: 'Dribbble',
    logo: (
      <div className='bg-pink-500 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    location: 'United States',
    featured: true,
  },
  {
    name: 'Upwork',
    logo: (
      <div className='bg-green-400 rounded-lg w-12 h-12 flex items-center justify-center'>
        <span className='text-white font-bold text-xl'>Up</span>
      </div>
    ),
    location: 'United States',
    featured: false,
  },
  {
    name: 'Slack',
    logo: (
      <div className='bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center'>
        <img
          src='https://cdn-icons-png.flaticon.com/512/2111/2111615.png'
          alt='Slack'
          className='w-7 h-7'
        />
      </div>
    ),
    location: 'China',
    featured: false,
  },
  {
    name: 'Freepik',
    logo: (
      <div className='bg-blue-700 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    location: 'United States',
    featured: false,
  },
  // Duplicate for second row
  {
    name: 'Dribbble',
    logo: (
      <div className='bg-pink-500 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    location: 'United States',
    featured: true,
  },
  {
    name: 'Upwork',
    logo: (
      <div className='bg-green-400 rounded-lg w-12 h-12 flex items-center justify-center'>
        <span className='text-white font-bold text-xl'>Up</span>
      </div>
    ),
    location: 'United States',
    featured: false,
  },
  {
    name: 'Slack',
    logo: (
      <div className='bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center'>
        <img
          src='https://cdn-icons-png.flaticon.com/512/2111/2111615.png'
          alt='Slack'
          className='w-7 h-7'
        />
      </div>
    ),
    location: 'China',
    featured: false,
  },
  {
    name: 'Freepik',
    logo: (
      <div className='bg-blue-700 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    location: 'United States',
    featured: false,
  },
];

const Arrow = ({ left = false }: { left?: boolean }) => (
  <button
    className='w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition text-gray-400 hover:text-blue-600 shadow-sm'
    aria-label={left ? 'Previous' : 'Next'}
  >
    <svg
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      className={left ? 'rotate-180' : ''}
    >
      <path d='M9 5l7 7-7 7' strokeWidth='2' />
    </svg>
  </button>
);

export default function TopCompanies() {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='text-4xl font-bold'>Top companies</h2>
          <div className='flex gap-2'>
            <Arrow left />
            <Arrow />
          </div>
        </div>
        <div className='grid grid-cols-4 gap-8'>
          {companies.map((company, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center transition hover:shadow-lg hover:scale-105 hover:ring-2 hover:ring-blue-200'
            >
              {company.logo}
              <div className='flex items-center gap-2 mt-4 mb-1'>
                <span className='font-semibold text-lg'>{company.name}</span>
                {company.featured && (
                  <span className='bg-red-50 text-red-400 px-3 py-1 rounded-lg text-xs font-semibold'>
                    Featured
                  </span>
                )}
              </div>
              <div className='flex items-center gap-1 text-gray-400 text-sm mb-6'>
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
                </svg>
                {company.location}
              </div>
              <button className='w-full py-3 rounded-lg font-semibold transition bg-blue-50 text-blue-600 hover:bg-blue-100'>
                Open Position
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
