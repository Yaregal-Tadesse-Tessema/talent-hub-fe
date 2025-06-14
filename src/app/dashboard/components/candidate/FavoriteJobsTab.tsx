import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowRight, Heart } from 'lucide-react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FavoriteJob {
  id: string;
  jobPostId: string;
  userId: string;
  remark: string;
  jobPost: Job;
}

export default function FavoriteJobsTab() {
  const [jobs, setJobs] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('User not logged in');
        }

        const userData = JSON.parse(storedUser);
        console.log(userData);
        const response = await jobService.getFavoriteJobs();
        const jobs = response?.items || [];
        setJobs(jobs);
        setTotalPages(response?.total || 0);
      } catch (err) {
        console.error('Error fetching favorite jobs:', err);
        setError('Failed to fetch favorite jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, []);

  const handleUnfavoriteJob = async (jobId: string) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }

      const userData = JSON.parse(storedUser);
      await jobService.unfavoriteJob(jobId, userData.id);
      setJobs(jobs.filter((job) => job.jobPostId !== jobId));
      showToast({ type: 'success', message: 'Job removed from favorites' });
    } catch (error) {
      console.error('Error unfavoriting job:', error);
      showToast({
        type: 'error',
        message: 'Failed to remove job from favorites',
      });
    }
  };

  const handleApplyClick = (jobId: string) => {
    router.push(`/find-job/${jobId}?apply=true`);
  };

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  return (
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-6'>
        Favorite Jobs{' '}
        <span className='text-gray-400 font-normal'>({jobs.length})</span>
      </h1>
      <div className='bg-white rounded-lg shadow p-0'>
        {currentJobs.length === 0 ? (
          <div className='text-center py-12'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
              No favorite jobs yet
            </h2>
            <p className='text-gray-500'>
              Start favoriting jobs to see them here.
            </p>
          </div>
        ) : (
          currentJobs.map((favoriteJob) => {
            const job = favoriteJob.jobPost;
            return (
              <div
                key={favoriteJob.id}
                className='grid grid-cols-12 items-center px-8 py-4 border-b last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 hover:bg-blue-50'
              >
                {/* Job Info */}
                <div className='col-span-5 flex items-center gap-4'>
                  <span className='w-10 h-10 rounded flex items-center justify-center font-bold text-lg bg-blue-100'>
                    {job?.companyLogo?.path ? (
                      <img
                        src={job.companyLogo.path}
                        alt={job.companyName}
                        className='w-6 h-6'
                      />
                    ) : (
                      job?.companyName[0]
                    )}
                  </span>
                  <div>
                    <Link
                      href={`/find-job/${job?.id}`}
                      className='font-medium text-base hover:text-blue-600'
                    >
                      {job?.title}
                    </Link>
                    <div className='text-gray-400 text-xs flex gap-2 items-center'>
                      <span>{job?.location}</span>
                      <span>•</span>
                      <span>
                        ${job?.salaryRange?.min || 'N/A'} - $
                        {job?.salaryRange?.max || 'N/A'}
                      </span>
                    </div>
                    <span className='inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded mt-1'>
                      {job?.employmentType}
                    </span>
                    {job?.status && (
                      <span className='ml-2 text-xs font-medium text-red-500'>
                        {job?.status}
                      </span>
                    )}
                  </div>
                </div>
                {/* Deadline/Days Remaining */}
                <div className='col-span-3 text-xs flex items-center gap-2'>
                  {job?.deadline && (
                    <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-500'>
                      {new Date(job?.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {/* Favorite */}
                <div className='col-span-1 flex justify-center'>
                  <button
                    onClick={() => handleUnfavoriteJob(job?.id)}
                    className='text-red-600 hover:text-red-700 transition-colors'
                  >
                    <Heart className='w-5 h-5 fill-current' />
                  </button>
                </div>
                {/* Action */}
                <div className='col-span-3 flex justify-end'>
                  {new Date(job?.deadline) < new Date() ? (
                    <button className='px-4 py-2 rounded font-medium bg-gray-100 text-gray-400 cursor-not-allowed'>
                      Deadline Expired
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(job?.id)}
                      className='px-4 py-2 rounded font-medium bg-blue-50 text-blue-600 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all'
                    >
                      Apply Now <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
