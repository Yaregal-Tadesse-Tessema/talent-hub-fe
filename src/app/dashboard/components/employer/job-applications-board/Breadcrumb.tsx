import React from 'react';
import { Job } from '@/types/job';

interface BreadcrumbProps {
  job: Job | null;
  onBack: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ job, onBack }) => {
  return (
    <nav className='text-sm text-gray-500 flex items-center gap-1'>
      <button onClick={onBack} className='hover:underline'>
        My Jobs
      </button>
      <span>/</span>
      <span className='text-gray-700 font-semibold'>{job?.title}</span>
      <span>/</span>
      <span className='text-gray-700 font-semibold'>Applications</span>
    </nav>
  );
};

export default Breadcrumb;
