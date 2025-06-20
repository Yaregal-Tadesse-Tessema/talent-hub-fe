'use client';

import PostJobForm from '@/components/forms/PostJobForm';
import { Navbar } from '@/components/layout/Navbar';

export default function PostJobPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-blue-600 mb-2'>
            Post a New Job
          </h1>
          <p className='text-gray-600'>
            Fill out the form below to create a new job posting. Make sure to
            provide all the necessary details to attract the right candidates.
          </p>
        </div>
        <PostJobForm />
      </div>
    </div>
  );
}
