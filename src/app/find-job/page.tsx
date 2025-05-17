'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Bookmark, ArrowRight } from 'lucide-react';
import FilterModal from '@/components/ui/FilterModal';

// Mock job data
const jobs = [
  {
    id: 1,
    company: 'Reddit',
    logo: '🟧',
    featured: true,
    location: 'United Kingdom of Great Britain',
    title: 'Marketing Officer',
    type: 'Full Time',
    salary: '$30K-$35K',
  },
  {
    id: 2,
    company: 'Dribbble',
    logo: '🟣',
    featured: true,
    location: 'California',
    title: 'Senior UX Designer',
    type: 'Full-Time',
    salary: '$50K-80K/month',
  },
  {
    id: 3,
    company: 'Freepik',
    logo: '🟦',
    featured: true,
    location: 'China',
    title: 'Visual Designer',
    type: 'Full Time',
    salary: '$10K-$15K',
  },
  {
    id: 4,
    company: 'Figma',
    logo: '⬛',
    featured: true,
    location: 'Canada',
    title: 'UI/UX Designer',
    type: 'Full Time',
    salary: '$50K-$70K',
  },
  {
    id: 5,
    company: 'Dribbble',
    logo: '🟣',
    featured: false,
    location: 'United States',
    title: 'Junior Graphic Designer',
    type: 'Temporary',
    salary: '$35K-$40K',
  },
  {
    id: 6,
    company: 'Twitter',
    logo: '🟦',
    featured: false,
    location: 'Canada',
    title: 'Senior UX Designer',
    type: 'Internship',
    salary: '$50K-$60K',
  },
  {
    id: 7,
    company: 'Microsoft',
    logo: '🟩',
    featured: false,
    location: 'Australia',
    title: 'Product Designer',
    type: 'Full Time',
    salary: '$40K-$50K',
  },
  {
    id: 8,
    company: 'Upwork',
    logo: '🟩',
    featured: false,
    location: 'France',
    title: 'Technical Support Specialist',
    type: 'Full Time',
    salary: '$35K-$40K',
  },
  {
    id: 9,
    company: 'Slack',
    logo: '🟨',
    featured: false,
    location: 'Germany',
    title: 'Networking Engineer',
    type: 'Remote',
    salary: '$50K-$90K',
  },
  {
    id: 10,
    company: 'Instagram',
    logo: '🟪',
    featured: false,
    location: 'Australia',
    title: 'Front End Developer',
    type: 'Contract Base',
    salary: '$50K-$80K',
  },
  {
    id: 11,
    company: 'Facebook',
    logo: '🟦',
    featured: false,
    location: 'United Kingdom of Great Britain',
    title: 'Software Engineer',
    type: 'Part Time',
    salary: '$15K-$20K',
  },
  {
    id: 12,
    company: 'Youtube',
    logo: '🟥',
    featured: false,
    location: 'Germany',
    title: 'Interaction Designer',
    type: 'Full Time',
    salary: '$20K-$25K',
  },
];

const filters = [{ label: 'Design' }, { label: 'New York' }];

export default function FindJobPage() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [hoveredJobId, setHoveredJobId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const jobsPerPage = 12;
  const totalPages = 5;

  return (
    <main className='min-h-screen pb-16'>
      {/* Page title and breadcrumb */}
      <div className='flex justify-between bg-gray-100 items-center px-16 pt-8'>
        <h2 className='text-md text-gray-500'>Find Job</h2>
        <nav className='text-gray-400 text-sm flex items-center gap-1'>
          <span className='hover:text-gray-600 cursor-pointer'>Home</span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 font-medium'>Find Job</span>
        </nav>
      </div>
      {/* Top search/filter bar */}
      <div className='bg-gray-100 px-16 py-4 pb-8 border-b'>
        <div className='flex gap-4 items-center shadow rounded-xl px-6 py-2 bg-white'>
          {/* Job title search */}
          <div className='flex items-center gap-2 flex-1 border-r pr-4'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <circle cx='11' cy='11' r='7' strokeWidth='2' />
              <path d='M21 21l-4.35-4.35' strokeWidth='2' />
            </svg>
            <input
              className='flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400'
              placeholder='Job title, Keyword...'
            />
          </div>
          {/* Location */}
          <div className='flex items-center gap-2 border-r px-4 min-w-[200px]'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <path
                d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                strokeWidth='2'
              />
              <circle cx='12' cy='9' r='2.5' strokeWidth='2' />
            </svg>
            <input
              className='bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 w-full'
              placeholder='Location'
            />
          </div>
          {/* Category */}
          <div className='flex items-center gap-2 border-r px-4 min-w-[200px]'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <g strokeWidth='2'>
                <rect x='3' y='3' width='18' height='6' rx='2' />
                <rect x='3' y='9' width='18' height='6' rx='2' />
                <rect x='3' y='15' width='18' height='6' rx='2' />
              </g>
            </svg>
            <select className='bg-transparent border-none outline-none text-gray-700 w-full'>
              <option>Select Category</option>
            </select>
          </div>

          {/* Advanced filter */}
          <div className='flex items-center gap-2 border-r px-4 min-w-[200px]'>
            <div
              className='flex items-center cursor-pointer'
              onClick={() => setIsFilterOpen(true)}
            >
              <span className='text-gray-500 mr-2'>Advance Filter</span>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>
          {/* Chevron and Find Job button */}
          <div className='flex items-center gap-2 pl-2'>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
              Find Job
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 pt-8'>
        {/* Card View */}
        {viewMode === 'card' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md relative hover:border-blue-600'
              >
                <div className='flex items-center gap-3 mb-2'>
                  <span className='text-2xl'>{job.logo}</span>
                  <span className='font-semibold text-gray-800'>
                    {job.company}
                  </span>
                  {job.featured && (
                    <span className='ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                      Featured
                    </span>
                  )}
                </div>
                <div className='text-xs text-gray-400 mb-1'>{job.location}</div>
                <Link
                  href={`/find-job/${job.id}`}
                  className='block text-blue-600 font-semibold text-lg mb-1 hover:underline'
                >
                  {job.title}
                </Link>
                <div className='flex items-center text-xs text-gray-500 gap-2'>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* List View */}
        {viewMode === 'list' && (
          <div className='flex flex-col gap-4'>
            {jobs.map((job) => {
              const isJuniorGraphicDesigner =
                job.title === 'Junior Graphic Designer';
              const isHovered = hoveredJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`
                    flex items-center justify-between rounded-xl border bg-white px-6 py-5 transition
                    border-gray-200 hover:border-blue-600
                  `}
                  onMouseEnter={() => setHoveredJobId(job.id)}
                  onMouseLeave={() => setHoveredJobId(null)}
                >
                  {/* Logo */}
                  <div className='flex items-center gap-4 min-w-[56px]'>
                    <span className='text-3xl'>{job.logo}</span>
                  </div>
                  {/* Main Info */}
                  <div className='flex-1 min-w-0 ml-4'>
                    <div className='flex items-center gap-2'>
                      <Link
                        href={`/find-job/${job.id}`}
                        className='font-semibold text-gray-800 text-base hover:underline text-blue-600'
                      >
                        {job.title}
                      </Link>
                      {job.featured && (
                        <span className='ml-2 bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                          Featured
                        </span>
                      )}
                      {job.type && (
                        <span className='ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium'>
                          {job.type}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1'>
                      <span className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M12 21c-4.97-6.16-8-10.16-8-13A8 8 0 1 1 20 8c0 2.84-3.03 6.84-8 13z' />
                          <circle cx='12' cy='8' r='3' />
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
                        >
                          <path d='M12 21c-4.97-6.16-8-10.16-8-13A8 8 0 1 1 20 8c0 2.84-3.03 6.84-8 13z' />
                          <circle cx='12' cy='8' r='3' />
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
                        >
                          <rect
                            x='3'
                            y='3'
                            width='18'
                            height='7'
                            strokeWidth='2'
                          />
                          <rect
                            x='3'
                            y='14'
                            width='18'
                            height='7'
                            strokeWidth='2'
                          />
                        </svg>
                        4 Days Remaining
                      </span>
                    </div>
                  </div>
                  {/* Bookmark and Apply */}
                  <div className='flex items-center gap-4 ml-4'>
                    <button className='text-gray-400 hover:text-blue-600'>
                      <svg
                        width='22'
                        height='22'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path d='M6 4a2 2 0 0 0-2 2v14l8-5.333L20 20V6a2 2 0 0 0-2-2H6z' />
                      </svg>
                    </button>
                    <button className='bg-blue-50 text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2 transition'>
                      Apply Now
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        <div className='flex justify-center items-center gap-2 mt-10'>
          <button
            className='p-2 rounded-full hover:bg-gray-200 disabled:opacity-50'
            disabled={selectedPage === 1}
            onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
          >
            <span className='text-lg'>&larr;</span>
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${selectedPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setSelectedPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className='p-2 rounded-full hover:bg-gray-200 disabled:opacity-50'
            disabled={selectedPage === totalPages}
            onClick={() => setSelectedPage((p) => Math.min(totalPages, p + 1))}
          >
            <span className='text-lg'>&rarr;</span>
          </button>
        </div>
      </div>
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </main>
  );
}
