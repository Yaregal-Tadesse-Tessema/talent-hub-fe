import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';

export default function FavoriteJobsTab() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getPublicJobs();
        console.log(response);
        // Filter jobs that are saved by the user
        const savedJobs = response.items.filter((job) => job.isSaved);
        setJobs(response.items);
        setTotalPages(Math.ceil(response.items.length / 10)); // Assuming 10 items per page
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className='flex-1 p-10'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-10'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-500'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-6'>
        Favorite Jobs{' '}
        <span className='text-gray-400 font-normal'>({jobs.length})</span>
      </h1>
      <div className='bg-white rounded-lg shadow p-0'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 hover:bg-blue-50'
            onClick={() => setSelectedJobId(job.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <span className='w-10 h-10 rounded flex items-center justify-center font-bold text-lg bg-blue-100'>
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo.path}
                    alt={job.companyName}
                    className='w-6 h-6'
                  />
                ) : (
                  job.companyName[0]
                )}
              </span>
              <div>
                <div className='font-medium text-base'>{job.title}</div>
                <div className='text-gray-400 text-xs flex gap-2 items-center'>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>
                    ${job.salaryRange.min}-${job.salaryRange.max}
                  </span>
                </div>
                <span className='inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded mt-1'>
                  {job.employmentType}
                </span>
                {job.status && (
                  <span className='ml-2 text-xs font-medium text-red-500'>
                    {job.status}
                  </span>
                )}
              </div>
            </div>
            {/* Deadline/Days Remaining */}
            <div className='col-span-3 text-xs flex items-center gap-2'>
              {job.deadline && (
                <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-500'>
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
            {/* Bookmark */}
            <div className='col-span-1 flex justify-center'>
              <Bookmark className='text-gray-500 text-xl' size={20} />
            </div>
            {/* Action */}
            <div className='col-span-3 flex justify-end'>
              {new Date(job.deadline) < new Date() ? (
                <button className='px-4 py-2 rounded font-medium bg-gray-100 text-gray-400 cursor-not-allowed'>
                  Deadline Expired
                </button>
              ) : (
                <button className='px-4 py-2 rounded font-medium bg-blue-50 text-blue-600 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all'>
                  Apply Now <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className='flex justify-end mt-8'>
        <div className='flex items-center gap-2'>
          <button
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page.toString().padStart(2, '0')}
            </button>
          ))}
          <button
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100'
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
