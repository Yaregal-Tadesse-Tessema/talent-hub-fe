'use client';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useSearchParams } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import type { Application } from '@/services/applicationService';
import ApplicationDetailModal from './ApplicationDetailModal';

export default function AppliedJobsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const applicationsData =
            await applicationService.getApplicationsByUserId(userData.id);
          setApplications(applicationsData.items);

          // Check if there's an applicationId in URL params to auto-open modal
          const applicationId = searchParams?.get('applicationId');
          if (applicationId) {
            const application = applicationsData.items.find(
              (app) => app.id === applicationId,
            );
            if (application) {
              setSelectedApplication(application);
              setIsModalOpen(true);
            }
          }
        }
      } catch (error) {
        setError('Failed to fetch applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchParams]);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  if (loading) {
    return (
      <div className='flex-1 p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-500 dark:text-red-400'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-10 bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-xl font-semibold mb-6 text-gray-900 dark:text-white'>
        Applied Jobs{' '}
        <span className='text-gray-400 dark:text-gray-500 font-normal'>
          ({applications.length})
        </span>
      </h1>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-0 border border-gray-200 dark:border-gray-700'>
        <div className='grid grid-cols-12 px-8 py-4 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 font-semibold'>
          <div className='col-span-5'>JOBS</div>
          <div className='col-span-3'>DATE APPLIED</div>
          <div className='col-span-2'>STATUS</div>
          <div className='col-span-2'>ACTION</div>
        </div>
        {applications.map((application) => (
          <div
            key={application.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b border-gray-200 dark:border-gray-700 mb-1 last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <div>
                <div className='font-medium text-base text-gray-900 dark:text-white'>
                  {application.jobPost?.title}
                </div>
                <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-2 items-center'>
                  <span>{application.jobPost?.industry}</span>
                  <span>•</span>
                  <span>{application.jobPost?.position}</span>
                </div>
              </div>
            </div>
            {/* Date Applied */}
            <div className='col-span-3 text-sm text-gray-700 dark:text-gray-300'>
              {new Date(application.jobPost?.createdAt).toLocaleDateString()}
            </div>
            {/* Status */}
            <div className='col-span-2 flex items-center gap-2 text-green-600 dark:text-green-400 font-medium'>
              <span className='text-green-500 dark:text-green-400'>
                <FaCheckCircle size={16} />
              </span>
              {application.status}
            </div>
            {/* Action */}
            <div className='col-span-2'>
              <button
                onClick={() => handleViewDetails(application)}
                className='w-full px-4 py-2 rounded font-medium transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-gray-200 dark:border-gray-600'
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          applicationId={selectedApplication.id}
          application={selectedApplication}
        />
      )}
    </div>
  );
}
