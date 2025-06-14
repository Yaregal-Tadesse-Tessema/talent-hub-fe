'use client';

import MyJobsTab from '../dashboard/components/employer/MyJobsTab';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function MyJobsPage() {
  const router = useRouter();

  return (
    <div className='flex-1'>
      <div className='flex items-center gap-2 mb-6 px-6'>
        <button
          onClick={() => router.push('/dashboard')}
          className='text-gray-500 hover:text-gray-700'
        >
          Dashboard
        </button>
        <span className='text-gray-400'>/</span>
        <span className='text-gray-700'>My Jobs</span>
      </div>
      <Suspense>
        <MyJobsTab />
      </Suspense>
    </div>
  );
}
