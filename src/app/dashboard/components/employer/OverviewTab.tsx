import React, { useState, useRef, useEffect } from 'react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import JobDetailModal from './JobDetailModal';

// Mock data for stats and jobs
const stats = [
  { label: 'Open Jobs', value: 589, icon: '📁' },
  { label: 'Saved Candidates', value: 2517, icon: '🗂️' },
];

const jobs = [
  {
    id: 1,
    title: 'UI/UX Designer',
    type: 'Full Time',
    daysRemaining: 27,
    status: 'Active',
    applications: 798,
  },
  {
    id: 2,
    title: 'Senior UX Designer',
    type: 'Internship',
    daysRemaining: 8,
    status: 'Active',
    applications: 185,
  },
  {
    id: 3,
    title: 'Technical Support Specialist',
    type: 'Part Time',
    daysRemaining: 4,
    status: 'Active',
    applications: 556,
  },
  {
    id: 4,
    title: 'Junior Graphic Designer',
    type: 'Full Time',
    daysRemaining: 24,
    status: 'Active',
    applications: 583,
  },
  {
    id: 5,
    title: 'Front End Developer',
    type: 'Full Time',
    daysRemaining: 0,
    status: 'Expire',
    applications: 740,
  },
];

export default function OverviewTab() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { showToast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobs();
        setJobs(
          response.items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleViewDetail = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-500'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-6'>
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
      {/* Header */}
      <h1 className='text-2xl font-bold mb-1'>Hello, Instagram</h1>
      <p className='text-gray-500 mb-8'>
        Here is your daily activities and applications
      </p>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-6 mb-10'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center gap-4'>
          <span className='text-3xl'>📁</span>
          <div>
            <div className='text-2xl font-bold'>{jobs.length}</div>
            <div className='text-gray-500'>Open Jobs</div>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow p-6 flex items-center gap-4'>
          <span className='text-3xl'>🗂️</span>
          <div>
            <div className='text-2xl font-bold'>
              {jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0)}
            </div>
            <div className='text-gray-500'>Total Applications</div>
          </div>
        </div>
      </div>

      {/* Recently Posted Jobs Table */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='font-semibold text-lg'>Recently Posted Jobs</div>
          <button className='text-blue-600 hover:underline text-sm'>
            View all →
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='text-gray-400 text-left'>
                <th className='py-2 px-4'>Job</th>
                <th className='py-2 px-4'>Status</th>
                <th className='py-2 px-4'>Applications</th>
                <th className='py-2 px-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((job) => {
                const daysRemaining = Math.ceil(
                  (new Date(job.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const isExpired = daysRemaining <= 0;

                return (
                  <tr key={job.id} className='border-t'>
                    <td className='py-3 px-4'>
                      <div className='font-medium'>{job.title}</div>
                      <div className='text-gray-400 text-xs flex gap-2 items-center'>
                        <span>{job.employmentType}</span>
                        {!isExpired && (
                          <>
                            <span>•</span>
                            <span>{daysRemaining} days remaining</span>
                          </>
                        )}
                        {isExpired && (
                          <>
                            <span>•</span>
                            <span className='text-red-500'>Expired</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      {!isExpired ? (
                        <span className='text-green-600 font-medium'>
                          Active
                        </span>
                      ) : (
                        <span className='text-red-500 font-medium'>Expire</span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      {job.applicationCount || 0} Applications
                    </td>
                    <td className='py-3 px-4'>
                      <button
                        className='px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 mr-2'
                        onClick={() => handleViewDetail(job)}
                      >
                        View Detail
                      </button>
                      <div
                        className='inline-block relative'
                        ref={(el) => {
                          menuRefs.current[job.id] = el;
                        }}
                      >
                        <button
                          className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-200'
                          onClick={() =>
                            setOpenMenuId(openMenuId === job.id ? null : job.id)
                          }
                          aria-label='Open actions menu'
                          type='button'
                        >
                          <span className='text-xl'>⋮</span>
                        </button>
                        {openMenuId === job.id && (
                          <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10'>
                            <button
                              className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                              onClick={() => handleViewDetail(job)}
                            >
                              View Detail
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
