'use client';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import type { IconType } from 'react-icons';
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
        }
      } catch (error) {
        setError('Failed to fetch applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
    <div className='flex-1 p-10'>
      <h1 className='text-xl font-semibold mb-6'>
        Applied Jobs{' '}
        <span className='text-gray-400 font-normal'>
          ({applications.length})
        </span>
      </h1>
      <div className='bg-white rounded-lg shadow p-0'>
        <div className='grid grid-cols-12 px-8 py-4 border-b text-xs text-gray-400 font-semibold'>
          <div className='col-span-5'>JOBS</div>
          <div className='col-span-3'>DATE APPLIED</div>
          <div className='col-span-2'>STATUS</div>
          <div className='col-span-2'>ACTION</div>
        </div>
        {applications.map((application) => (
          <div
            key={application.id}
            className='grid grid-cols-12 items-center px-8 py-4 border-b mb-1 last:border-b-0 transition-all hover:ring-2 hover:ring-blue-400 bg-blue-50'
          >
            {/* Job Info */}
            <div className='col-span-5 flex items-center gap-4'>
              <div>
                <div className='font-medium text-base'>
                  {application.jobPost?.title}
                </div>
                <div className='text-gray-400 text-xs flex gap-2 items-center'>
                  <span>{application.jobPost?.industry}</span>
                  <span>•</span>
                  <span>{application.jobPost?.position}</span>
                </div>
              </div>
            </div>
            {/* Date Applied */}
            <div className='col-span-3 text-sm'>
              {new Date(application.jobPost?.createdAt).toLocaleDateString()}
            </div>
            {/* Status */}
            <div className='col-span-2 flex items-center gap-2 text-green-600 font-medium'>
              <span className='text-green-500'>
                <FaCheckCircle size={16} />
              </span>
              {application.status}
            </div>
            {/* Action */}
            <div className='col-span-2'>
              <button
                onClick={() => handleViewDetails(application)}
                className='w-full px-4 py-2 rounded font-medium transition-all hover:bg-blue-600 hover:text-white bg-gray-100 text-blue-600 hover:bg-blue-100'
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
