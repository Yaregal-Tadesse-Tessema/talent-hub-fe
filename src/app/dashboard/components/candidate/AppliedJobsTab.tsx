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
      <div className='flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
            <p className='text-gray-600 dark:text-gray-400'>
              Loading applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='text-red-500 dark:text-red-400 text-lg mb-2'>
              ⚠️
            </div>
            <div className='text-red-500 dark:text-red-400'>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-gray-900 dark:text-white'>
          Applied Jobs{' '}
          <span className='text-gray-400 dark:text-gray-500 font-normal text-lg sm:text-xl lg:text-2xl'>
            ({applications.length})
          </span>
        </h1>
        <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Track your job applications and their current status
        </p>
      </div>

      {/* Mobile Cards View */}
      <div className='block sm:hidden space-y-4'>
        {applications.map((application) => (
          <div
            key={application.id}
            className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-4 border border-gray-200 dark:border-gray-700 space-y-3'
          >
            {/* Job Title and Company */}
            <div className='space-y-1'>
              <div className='font-medium text-base text-gray-900 dark:text-white'>
                {application.jobPost?.title}
              </div>
              <div className='text-gray-400 dark:text-gray-500 text-xs flex flex-wrap gap-1 items-center'>
                <span>{application.jobPost?.industry}</span>
                <span>•</span>
                <span>{application.jobPost?.position}</span>
              </div>
            </div>

            {/* Date and Status */}
            <div className='flex items-center justify-between text-xs'>
              <span className='text-gray-500 dark:text-gray-400'>
                Applied:{' '}
                {new Date(application.jobPost?.createdAt).toLocaleDateString()}
              </span>
              <div className='flex items-center gap-1 text-green-600 dark:text-green-400 font-medium'>
                <FaCheckCircle size={14} />
                <span>{application.status}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleViewDetails(application)}
              className='w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition-colors text-sm'
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className='hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700'>
        {/* Table Header */}
        <div className='grid grid-cols-12 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 font-semibold'>
          <div className='col-span-5 sm:col-span-5 lg:col-span-5'>JOBS</div>
          <div className='col-span-3 sm:col-span-3 lg:col-span-3'>
            DATE APPLIED
          </div>
          <div className='col-span-2 sm:col-span-2 lg:col-span-2'>STATUS</div>
          <div className='col-span-2 sm:col-span-2 lg:col-span-2'>ACTION</div>
        </div>

        {/* Table Body */}
        {applications.map((application) => (
          <div
            key={application.id}
            className='grid grid-cols-12 items-center px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20'
          >
            {/* Job Info */}
            <div className='col-span-5 sm:col-span-5 lg:col-span-5 flex items-center gap-3 sm:gap-4'>
              <div className='min-w-0 flex-1'>
                <div className='font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate'>
                  {application.jobPost?.title}
                </div>
                <div className='text-gray-400 dark:text-gray-500 text-xs flex gap-1 sm:gap-2 items-center'>
                  <span className='truncate'>
                    {application.jobPost?.industry}
                  </span>
                  <span>•</span>
                  <span className='truncate'>
                    {application.jobPost?.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Applied */}
            <div className='col-span-3 sm:col-span-3 lg:col-span-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300'>
              {new Date(application.jobPost?.createdAt).toLocaleDateString()}
            </div>

            {/* Status */}
            <div className='col-span-2 sm:col-span-2 lg:col-span-2 flex items-center gap-1 sm:gap-2 text-green-600 dark:text-green-400 font-medium'>
              <FaCheckCircle size={14} className='sm:w-4 sm:h-4' />
              <span className='text-xs sm:text-sm'>{application.status}</span>
            </div>

            {/* Action */}
            <div className='col-span-2 sm:col-span-2 lg:col-span-2'>
              <button
                onClick={() => handleViewDetails(application)}
                className='w-full px-2 sm:px-3 lg:px-4 py-2 rounded font-medium transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-gray-200 dark:border-gray-600 text-xs sm:text-sm'
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='text-center'>
            <div className='text-gray-400 dark:text-gray-500 text-4xl mb-4'>
              📝
            </div>
            <h3 className='text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2'>
              No applications yet
            </h3>
            <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6'>
              Start applying to jobs to track your applications here
            </p>
            <button
              onClick={() => (window.location.href = '/jobs')}
              className='px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base'
            >
              Browse Jobs
            </button>
          </div>
        </div>
      )}

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
