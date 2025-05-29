import React from 'react';
import { Job } from '@/types/job';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JobDetailModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
}: JobDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl'>
          <h2 className='text-2xl font-bold text-gray-900'>{job.title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto flex-1 p-6'>
          <div className='space-y-8'>
            {/* Basic Information */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Basic Information
              </h3>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Position</p>
                  <p className='font-medium text-gray-900'>{job.position}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Industry</p>
                  <p className='font-medium text-gray-900'>{job.industry}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Employment Type</p>
                  <p className='font-medium text-gray-900'>
                    {job.employmentType}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Location</p>
                  <p className='font-medium text-gray-900'>{job.location}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Salary Range</p>
                  <p className='font-medium text-gray-900'>
                    {job.salaryRange.min} - {job.salaryRange.max}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Status</p>
                  <p className='font-medium text-gray-900'>{job.status}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Description
              </h3>
              <div className='prose max-w-none text-gray-700 bg-white rounded-lg p-6 border border-gray-200'>
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Requirements
              </h3>
              <div className='bg-white rounded-lg p-6 border border-gray-200'>
                <ul className='space-y-3'>
                  {job.jobPostRequirement.map((req, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-blue-600 mr-2'>•</span>
                      <span className='text-gray-700'>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Required Skills
              </h3>
              <div className='flex flex-wrap gap-2 bg-white rounded-lg p-6 border border-gray-200'>
                {job.skill.map((skill, index) => (
                  <span
                    key={index}
                    className='px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Benefits
              </h3>
              <div className='bg-white rounded-lg p-6 border border-gray-200'>
                <ul className='space-y-3'>
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-green-600 mr-2'>•</span>
                      <span className='text-gray-700'>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Responsibilities
              </h3>
              <div className='bg-white rounded-lg p-6 border border-gray-200'>
                <ul className='space-y-3'>
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-purple-600 mr-2'>•</span>
                      <span className='text-gray-700'>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Additional Information
              </h3>
              <div className='bg-white rounded-lg p-6 border border-gray-200'>
                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Experience Level
                    </p>
                    <p className='font-medium text-gray-900'>
                      {job.experienceLevel}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Education Level
                    </p>
                    <p className='font-medium text-gray-900'>
                      {job.educationLevel}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Field of Study</p>
                    <p className='font-medium text-gray-900'>
                      {job.fieldOfStudy}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Minimum GPA</p>
                    <p className='font-medium text-gray-900'>
                      {job.minimumGPA}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Posted Date</p>
                    <p className='font-medium text-gray-900'>
                      {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Deadline</p>
                    <p className='font-medium text-gray-900'>
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
