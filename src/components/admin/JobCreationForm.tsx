'use client';

import { useState } from 'react';
import { JobPostingData } from '@/types/job';
import { adminJobService } from '@/services/adminJobService';

export default function JobCreationForm() {
  const [formData, setFormData] = useState<JobPostingData>({
    tenantName: '',
    tenantAddress: '',
    tenantPhone: '',
    jobType: '',
    worktype: '',
    jobTitle: '',
    experienceLevel: '',
    jobRequirement: [''],
    responsibilities: [''],
    howToApply: '',
    email: '',
    skills: [''],
    description: '',
    position: '',
    industry: '',
    deadline: '',
    gender: '',
    numberOfPosition: 1,
    requiredYearOfExperience: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
  ];
  const workTypes = ['Remote', 'On-site', 'Hybrid'];
  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive',
  ];
  const genders = ['Any', 'Male', 'Female'];
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Marketing',
    'Sales',
    'Customer Service',
    'Engineering',
    'Design',
    'Legal',
    'Consulting',
    'Non-profit',
    'Other',
  ];

  const handleInputChange = (field: keyof JobPostingData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (
    field: 'jobRequirement' | 'responsibilities' | 'skills',
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (
    field: 'jobRequirement' | 'responsibilities' | 'skills',
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (
    field: 'jobRequirement' | 'responsibilities' | 'skills',
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Filter out empty array items and validate data
      const cleanedData = {
        ...formData,
        jobRequirement: formData.jobRequirement.filter(
          (item) => item.trim() !== '',
        ),
        responsibilities: formData.responsibilities.filter(
          (item) => item.trim() !== '',
        ),
        skills: formData.skills.filter((item) => item.trim() !== ''),
      };

      // Ensure we have at least one item in each array
      if (cleanedData.jobRequirement.length === 0) {
        cleanedData.jobRequirement = ['General requirements'];
      }
      if (cleanedData.responsibilities.length === 0) {
        cleanedData.responsibilities = ['General responsibilities'];
      }
      if (cleanedData.skills.length === 0) {
        cleanedData.skills = ['General skills'];
      }

      // Ensure deadline is in the correct format
      if (cleanedData.deadline) {
        const deadlineDate = new Date(cleanedData.deadline);
        cleanedData.deadline = deadlineDate.toISOString();
      }

      console.log('Submitting job data:', cleanedData);

      const result = await adminJobService.createJobPosting(cleanedData);
      setMessage({
        type: 'success',
        text: 'Job posting created successfully!',
      });

      // Reset form
      setFormData({
        tenantName: '',
        tenantAddress: '',
        tenantPhone: '',
        jobType: '',
        worktype: '',
        jobTitle: '',
        experienceLevel: '',
        jobRequirement: [''],
        responsibilities: [''],
        howToApply: '',
        email: '',
        skills: [''],
        description: '',
        position: '',
        industry: '',
        deadline: '',
        gender: '',
        numberOfPosition: 1,
        requiredYearOfExperience: 0,
      });
    } catch (error) {
      console.error('Error creating job posting:', error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating the job posting',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockData: JobPostingData = {
      tenantName: 'TechCorp Solutions',
      tenantAddress: '123 Innovation Drive, San Francisco, CA 94105',
      tenantPhone: '+1-555-0123',
      jobType: 'Full-time',
      worktype: 'Hybrid',
      jobTitle: 'Senior Software Engineer',
      experienceLevel: 'Senior Level',
      jobRequirement: [
        "Bachelor's degree in Computer Science or related field",
        '5+ years of experience in software development',
        'Proficiency in JavaScript, React, and Node.js',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Strong problem-solving and analytical skills',
      ],
      responsibilities: [
        'Design and implement scalable software solutions',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions',
        'Contribute to architectural decisions',
      ],
      howToApply:
        'Please send your resume and cover letter to careers@techcorp.com',
      email: 'careers@techcorp.com',
      skills: [
        'JavaScript',
        'React',
        'Node.js',
        'TypeScript',
        'AWS',
        'Docker',
        'Git',
      ],
      description:
        'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions that meet business requirements.',
      position: 'Senior Software Engineer',
      industry: 'Technology',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16), // 30 days from now
      gender: 'Any',
      numberOfPosition: 2,
      requiredYearOfExperience: 5,
    };

    setFormData(mockData);
    setMessage({ type: 'success', text: 'Mock data loaded successfully!' });
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              Create New Job Posting
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Fill out the form below to create a new job posting
            </p>
          </div>
          <button
            type='button'
            onClick={loadMockData}
            className='px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
          >
            Load Mock Data
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
              : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Company Information */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Company Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Company Name *
              </label>
              <input
                type='text'
                required
                value={formData.tenantName}
                onChange={(e) =>
                  handleInputChange('tenantName', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter company name'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Company Address *
              </label>
              <input
                type='text'
                required
                value={formData.tenantAddress}
                onChange={(e) =>
                  handleInputChange('tenantAddress', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter company address'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Company Phone *
              </label>
              <input
                type='tel'
                required
                value={formData.tenantPhone}
                onChange={(e) =>
                  handleInputChange('tenantPhone', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter company phone'
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Job Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Job Title *
              </label>
              <input
                type='text'
                required
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter job title'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Job Type *
              </label>
              <select
                required
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select job type</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Work Type *
              </label>
              <select
                required
                value={formData.worktype}
                onChange={(e) => handleInputChange('worktype', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select work type</option>
                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Experience Level *
              </label>
              <select
                required
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleInputChange('experienceLevel', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select experience level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Industry *
              </label>
              <select
                required
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Position *
              </label>
              <input
                type='text'
                required
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter position'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Number of Positions *
              </label>
              <input
                type='number'
                required
                min='1'
                value={formData.numberOfPosition}
                onChange={(e) =>
                  handleInputChange(
                    'numberOfPosition',
                    parseInt(e.target.value),
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Required Years of Experience *
              </label>
              <input
                type='number'
                required
                min='0'
                value={formData.requiredYearOfExperience}
                onChange={(e) =>
                  handleInputChange(
                    'requiredYearOfExperience',
                    parseInt(e.target.value),
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Gender Preference
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select gender preference</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Application Deadline *
              </label>
              <input
                type='datetime-local'
                required
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Job Description
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Job Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter detailed job description'
              />
            </div>
          </div>
        </div>

        {/* Job Requirements */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Job Requirements
          </h3>
          <div className='space-y-4'>
            {formData.jobRequirement.map((requirement, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={requirement}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      'jobRequirement',
                      index,
                      e.target.value,
                    )
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                  placeholder={`Requirement ${index + 1}`}
                />
                {formData.jobRequirement.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField('jobRequirement', index)}
                    className='px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('jobRequirement')}
              className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            >
              + Add Requirement
            </button>
          </div>
        </div>

        {/* Responsibilities */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Responsibilities
          </h3>
          <div className='space-y-4'>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={responsibility}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      'responsibilities',
                      index,
                      e.target.value,
                    )
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                  placeholder={`Responsibility ${index + 1}`}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField('responsibilities', index)}
                    className='px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('responsibilities')}
              className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            >
              + Add Responsibility
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Required Skills
          </h3>
          <div className='space-y-4'>
            {formData.skills.map((skill, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={skill}
                  onChange={(e) =>
                    handleArrayFieldChange('skills', index, e.target.value)
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                  placeholder={`Skill ${index + 1}`}
                />
                {formData.skills.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField('skills', index)}
                    className='px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('skills')}
              className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Contact Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Contact Email *
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter contact email'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                How to Apply *
              </label>
              <textarea
                required
                rows={3}
                value={formData.howToApply}
                onChange={(e) =>
                  handleInputChange('howToApply', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
                placeholder='Enter application instructions'
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={loading}
            className='px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating...' : 'Create Job Posting'}
          </button>
        </div>
      </form>
    </div>
  );
}
