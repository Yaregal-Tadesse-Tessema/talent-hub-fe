import React, { useState } from 'react';
import { jobService } from '@/services/jobService';
import { useRouter } from 'next/router';

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

export default function SearchForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      await jobService.searchJobs(title, location);
      router.push({
        pathname: '/jobs',
        query: { title, location },
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className='flex flex-col md:flex-row md:items-center bg-white md:rounded-full shadow-md p-2 mb-3 gap-2 md:gap-0 border border-gray-200'
    >
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='h-6 w-px bg-gray-200 hidden md:block' />
      <div className='flex items-center flex-1 px-3'>
        <LocationIcon />
        <input
          className='w-full bg-gray-50 rounded-full px-4 py-2 outline-none text-gray-700 ml-2 border-none focus:ring-2 focus:ring-blue-100 transition'
          placeholder='Your Location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button
        type='submit'
        className='ml-0 md:ml-4 mt-2 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow'
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Find Job'}
      </button>
    </form>
  );
}
