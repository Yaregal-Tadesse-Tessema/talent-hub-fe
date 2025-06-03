import React from 'react';

const companies = [
  {
    name: 'Ethio Telecom',
    logo: (
      <div className='bg-green-600 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='20' height='20' fill='white' viewBox='0 0 24 24'>
          <path d='M12 2a10 10 0 100 20 10 10 0 000-20z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: true,
  },
  {
    name: 'Ethiopian Airlines',
    logo: (
      <div className='bg-yellow-500 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M2 12l20-6-6 20-4-8-8-4z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: true,
  },
  {
    name: 'Commercial Bank of Ethiopia',
    logo: (
      <div className='bg-blue-700 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M4 4h16v16H4z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: true,
  },
  {
    name: 'Metals and Engineering Corporation (METEC)',
    logo: (
      <div className='bg-gray-800 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: true,
  },
  {
    name: 'Ethiopian Shipping Lines',
    logo: (
      <div className='bg-indigo-600 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M3 12h18v2H3z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: true,
  },
  {
    name: 'Flintstone Homes',
    logo: (
      <div className='bg-orange-500 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M12 3l9 9h-6v9h-6v-9H3z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: false,
  },
  {
    name: 'Zergaw Cloud',
    logo: (
      <div className='bg-teal-500 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M6 19h12a4 4 0 00-4-4H10a4 4 0 00-4 4z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
    featured: false,
  },
  {
    name: 'Kifiya Financial Technology',
    logo: (
      <div className='bg-purple-600 rounded-lg w-12 h-12 flex items-center justify-center'>
        <svg width='28' height='28' fill='white' viewBox='0 0 24 24'>
          <path d='M4 4h16v16H4z' />
        </svg>
      </div>
    ),
    location: 'Addis Ababa, Ethiopia',
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
    <section className='py-12 sm:py-16 lg:py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
          <h2 className='text-3xl sm:text-4xl font-bold'>Top companies</h2>
          <div className='flex gap-2 w-full sm:w-auto justify-end'>
            <Arrow left />
            <Arrow />
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {companies.map((company, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 flex flex-col items-center transition hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 h-full'
            >
              <div className='flex-shrink-0'>{company.logo}</div>
              <div className='w-full mt-4 mb-1'>
                <div className='flex items-center gap-2 flex-wrap justify-center'>
                  <span className='font-semibold text-base sm:text-lg text-center line-clamp-1'>
                    {company.name}
                  </span>
                  {company.featured && (
                    <span className='bg-red-50 text-red-400 px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap'>
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-1 text-gray-400 text-sm mb-4 sm:mb-6'>
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
                <span className='line-clamp-1'>{company.location}</span>
              </div>
              <button className='w-full py-2 sm:py-3 rounded-lg font-semibold transition bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm sm:text-base mt-auto'>
                Open Position
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
