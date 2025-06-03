import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { jobService, JobPosting } from '@/services/jobService';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  description: string;
  position: string;
  industry: string;
  type: string;
  city: string;
  location: string;
  employmentType: string;
  salaryRange: {
    min: string;
    max: string;
  };
  deadline: string;
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: string;
  gender: string;
  minimumGPA: string;
  postedDate: string;
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate: string;
  jobPostRequirement: string[];
  positionNumbers: string;
  paymentType: string;
}

export default function PostJobTab() {
  const [formData, setFormData] = useState<FormData>({
    title: 'Senior Software Engineer',
    description:
      '<p>We are looking for a Senior Software Engineer to join our team. The ideal candidate will have experience in building scalable web applications and working with modern technologies.</p><ul><li>Design and implement new features</li><li>Collaborate with cross-functional teams</li><li>Mentor junior developers</li></ul>',
    position: 'Software Engineer',
    industry: 'InformationTechnology',
    type: 'Full-time',
    city: 'Addis Ababa',
    location: 'Bole Road, Addis Ababa, Ethiopia',
    employmentType: 'FullTime',
    salaryRange: {
      min: '50000',
      max: '80000',
    },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    requirementId: 'req123',
    skill: ['React', 'TypeScript', 'Node.js', 'AWS'],
    benefits: [
      'Health Insurance',
      'Flexible Working Hours',
      'Remote Work Options',
      'Professional Development Budget',
    ],
    responsibilities: [
      'Lead technical design and implementation',
      'Code review and mentoring',
      'Performance optimization',
      'Technical documentation',
    ],
    status: 'active',
    gender: 'Any',
    minimumGPA: '3.0',
    postedDate: new Date().toISOString(),
    applicationURL: 'https://company.com/careers',
    experienceLevel: 'Senior',
    fieldOfStudy: 'Computer Science',
    educationLevel: 'Bachelor',
    howToApply:
      'Please submit your resume and cover letter through our application portal.',
    onHoldDate: '',
    jobPostRequirement: [
      '5+ years of experience',
      'Strong problem-solving skills',
      'Excellent communication abilities',
    ],
    positionNumbers: '2',
    paymentType: 'Monthly',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'salaryRange') {
        setFormData((prev) => ({
          ...prev,
          salaryRange: {
            ...prev.salaryRange,
            [child]: value,
          },
        }));
      }
    } else if (name === 'deadline') {
      // Ensure proper date formatting for deadline
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setFormData((prev) => ({
          ...prev,
          [name]: date.toISOString(),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    field: keyof Pick<
      FormData,
      'skill' | 'benefits' | 'responsibilities' | 'jobPostRequirement'
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) =>
        i === index ? value : item,
      ),
    }));
  };

  const addArrayField = (
    field: keyof Pick<
      FormData,
      'skill' | 'benefits' | 'responsibilities' | 'jobPostRequirement'
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty array items and ensure proper date formatting
      const cleanedData = {
        ...formData,
        skill: formData.skill.filter(Boolean),
        benefits: formData.benefits.filter(Boolean),
        responsibilities: formData.responsibilities.filter(Boolean),
        jobPostRequirement: formData.jobPostRequirement.filter(Boolean),
        postedDate: new Date(formData.postedDate).toISOString(),
        deadline: new Date(formData.deadline).toISOString(),
        onHoldDate: formData.onHoldDate
          ? new Date(formData.onHoldDate).toISOString()
          : null,
      };

      await jobService.createJobPosting(cleanedData as JobPosting);

      showToast({
        type: 'success',
        message: 'Job posted successfully!',
      });

      // Redirect to jobs list or dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to post job. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex-1 pb-10'>
      <form
        onSubmit={handleSubmit}
        className='max-w-5xl bg-white rounded-xl shadow p-4 space-y-10'
      >
        {/* Basic Information */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Basic Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Job Title</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Enter job title'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Position</label>
              <input
                type='text'
                name='position'
                value={formData.position}
                onChange={handleInputChange}
                placeholder='Enter position'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Industry</label>
              <select
                name='industry'
                value={formData.industry}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Industry</option>
                <option value='InformationTechnology'>
                  Information Technology
                </option>
                <option value='Healthcare'>Healthcare</option>
                <option value='Finance'>Finance</option>
                <option value='Education'>Education</option>
                <option value='Manufacturing'>Manufacturing</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Employment Type</label>
              <select
                name='employmentType'
                value={formData.employmentType}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Type</option>
                <option value='FullTime'>Full Time</option>
                <option value='PartTime'>Part Time</option>
                <option value='Contract'>Contract</option>
                <option value='Internship'>Internship</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Location</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>City</label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleInputChange}
                placeholder='Enter city'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Location</label>
              <input
                type='text'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                placeholder='Enter detailed location'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Salary Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Minimum Salary</label>
              <input
                type='number'
                name='salaryRange.min'
                value={formData.salaryRange.min}
                onChange={handleInputChange}
                placeholder='Enter minimum salary'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Maximum Salary</label>
              <input
                type='number'
                name='salaryRange.max'
                value={formData.salaryRange.max}
                onChange={handleInputChange}
                placeholder='Enter maximum salary'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Payment Type</label>
              <select
                name='paymentType'
                value={formData.paymentType}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Payment Type</option>
                <option value='Hourly'>Hourly</option>
                <option value='Monthly'>Monthly</option>
                <option value='Yearly'>Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requirements and Qualifications */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>
            Requirements and Qualifications
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Experience Level</label>
              <select
                name='experienceLevel'
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Experience Level</option>
                <option value='Entry'>Entry Level</option>
                <option value='Mid'>Mid Level</option>
                <option value='Senior'>Senior Level</option>
                <option value='Executive'>Executive Level</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Education Level</label>
              <select
                name='educationLevel'
                value={formData.educationLevel}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Education Level</option>
                <option value='HighSchool'>High School</option>
                <option value='Bachelor'>Bachelor's Degree</option>
                <option value='Master'>Master's Degree</option>
                <option value='PhD'>PhD</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Field of Study</label>
              <input
                type='text'
                name='fieldOfStudy'
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                placeholder='Enter field of study'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Minimum GPA</label>
              <input
                type='number'
                name='minimumGPA'
                value={formData.minimumGPA}
                onChange={handleInputChange}
                placeholder='Enter minimum GPA'
                step='0.1'
                min='0'
                max='4'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
          </div>
        </div>

        {/* Skills and Requirements */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Skills and Requirements</h2>
          <div className='space-y-4'>
            {formData.skill.map((skill, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={skill}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, 'skill')
                  }
                  placeholder='Enter skill'
                  className='flex-1 border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('skill')}
              className='text-blue-600 hover:text-blue-800'
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Benefits</h2>
          <div className='space-y-4'>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={benefit}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, 'benefits')
                  }
                  placeholder='Enter benefit'
                  className='flex-1 border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('benefits')}
              className='text-blue-600 hover:text-blue-800'
            >
              + Add Benefit
            </button>
          </div>
        </div>

        {/* Responsibilities */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Responsibilities</h2>
          <div className='space-y-4'>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  value={responsibility}
                  onChange={(e) =>
                    handleArrayInputChange(
                      index,
                      e.target.value,
                      'responsibilities',
                    )
                  }
                  placeholder='Enter responsibility'
                  className='flex-1 border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addArrayField('responsibilities')}
              className='text-blue-600 hover:text-blue-800'
            >
              + Add Responsibility
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Additional Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Application URL</label>
              <input
                type='url'
                name='applicationURL'
                value={formData.applicationURL}
                onChange={handleInputChange}
                placeholder='Enter application URL'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Number of Positions</label>
              <input
                type='number'
                name='positionNumbers'
                value={formData.positionNumbers}
                onChange={handleInputChange}
                placeholder='Enter number of positions'
                min='1'
                className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Deadline</label>
              <input
                type='datetime-local'
                name='deadline'
                value={formData.deadline}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium mb-2'>Gender</label>
              <select
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                className='border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
              >
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Any'>Any</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>Job Description</h2>
          <div className='flex flex-col'>
            <RichTextEditor
              content={formData.description}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, description: content }))
              }
              placeholder='Enter detailed job description...'
            />
          </div>
        </div>

        {/* How to Apply */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold'>How to Apply</h2>
          <div className='flex flex-col'>
            <textarea
              name='howToApply'
              value={formData.howToApply}
              onChange={handleInputChange}
              placeholder='Enter application instructions'
              rows={4}
              className='border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
