'use client';

import PostJobForm from '@/components/forms/PostJobForm';
import { Navbar } from '@/components/layout/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PostJobPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-4'>
        <div>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
              {jobId ? 'Continue Publishing Job' : 'Post a New Job'}
            </h1>
            <button
              type='button'
              onClick={() => router.push('/dashboard')}
              className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200'
            >
              Cancel
            </button>
          </div>
          <p className='text-gray-600 dark:text-gray-300'>
            {jobId
              ? 'Continue editing your draft job posting. Complete the remaining steps to publish your job.'
              : 'Fill out the form below to create a new job posting. Make sure to provide all the necessary details to attract the right candidates.'}
          </p>
        </div>
        <PostJobForm jobId={jobId || undefined} />
      </div>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense>
      <PostJobPageContent />
    </Suspense>
  );
}
