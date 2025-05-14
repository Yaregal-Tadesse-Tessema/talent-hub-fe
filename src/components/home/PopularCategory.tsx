import Link from 'next/link';
import React from 'react';

const categories = [
  {
    name: 'Graphics & Design',
    count: 357,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <path d='M12 19l7-7-7-7-7 7 7 7z' strokeWidth='2' />
        <path d='M12 3v16' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Code & Programing',
    count: 312,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <path d='M16 18l6-6-6-6' strokeWidth='2' />
        <path d='M8 6l-6 6 6 6' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Digital Marketing',
    count: 297,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <rect x='3' y='7' width='18' height='10' rx='2' strokeWidth='2' />
        <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Video & Animation',
    count: 247,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <rect x='3' y='5' width='18' height='14' rx='2' strokeWidth='2' />
        <path d='M10 9l5 3-5 3V9z' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Music & Audio',
    count: 204,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <path d='M9 19V6l12-2v13' strokeWidth='2' />
        <circle cx='6' cy='18' r='3' strokeWidth='2' />
        <circle cx='18' cy='16' r='3' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Account & Finance',
    count: 167,
    icon: (
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
    ),
  },
  {
    name: 'Health & Care',
    count: 125,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <rect x='3' y='3' width='18' height='18' rx='2' strokeWidth='2' />
        <path d='M12 8v8m-4-4h8' strokeWidth='2' />
      </svg>
    ),
  },
  {
    name: 'Data & Science',
    count: 57,
    icon: (
      <svg
        width='32'
        height='32'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        className='text-blue-600'
      >
        <path
          d='M9 17v-2m3 2v-4m3 4v-6m2-10H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z'
          strokeWidth='2'
        />
      </svg>
    ),
  },
];

export default function PopularCategory() {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='text-4xl font-bold'>Popular category</h2>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className='flex items-center gap-4 bg-blue-50 rounded-2xl p-6 text-gray-900 hover:shadow-lg transition group hover:bg-blue-600 hover:text-white hover:scale-105'
            >
              <div className='bg-white rounded-xl p-3 group-hover:bg-blue-500'>
                {cat.icon}
              </div>
              <div>
                <div className='font-semibold text-lg group-hover:text-white'>
                  {cat.name}
                </div>
                <div className='text-gray-400 group-hover:text-blue-100'>
                  {cat.count} Open position
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
