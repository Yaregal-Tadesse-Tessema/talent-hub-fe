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

export default function PostJobForm() {
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
    status: 'Draft',
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
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { showToast } = useToast();
  const router = useRouter();

  const totalSteps = 6;

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

  const removeArrayField = (
    index: number,
    field: keyof Pick<
      FormData,
      'skill' | 'benefits' | 'responsibilities' | 'jobPostRequirement'
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Validation function
  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) errors.title = 'Job title is required';
        if (!formData.position.trim()) errors.position = 'Position is required';
        if (!formData.industry) errors.industry = 'Industry is required';
        if (!formData.employmentType)
          errors.employmentType = 'Employment type is required';
        break;
      case 2:
        if (
          !formData.description.trim() ||
          formData.description === '<p></p>'
        ) {
          errors.description = 'Job description is required';
        }
        break;
      case 3:
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.location.trim()) errors.location = 'Location is required';
        if (!formData.salaryRange.min)
          errors.salaryMin = 'Minimum salary is required';
        if (!formData.salaryRange.max)
          errors.salaryMax = 'Maximum salary is required';
        if (!formData.paymentType)
          errors.paymentType = 'Payment type is required';
        break;
      case 4:
        if (!formData.experienceLevel)
          errors.experienceLevel = 'Experience level is required';
        if (!formData.educationLevel)
          errors.educationLevel = 'Education level is required';
        if (!formData.fieldOfStudy.trim())
          errors.fieldOfStudy = 'Field of study is required';
        if (formData.skill.filter((s) => s.trim()).length === 0) {
          errors.skills = 'At least one skill is required';
        }
        break;
      case 6:
        if (!formData.positionNumbers)
          errors.positionNumbers = 'Number of positions is required';
        if (!formData.deadline) errors.deadline = 'Deadline is required';
        if (!formData.howToApply.trim())
          errors.howToApply = 'Application instructions are required';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setValidationErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    // Validate the final step before submitting
    if (!validateCurrentStep()) {
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to publish this job posting? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

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

  const renderProgressBar = () => (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-500'>
            Step {currentStep} of {totalSteps}
          </span>
          {currentStep === totalSteps && (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              Ready to Publish
            </span>
          )}
        </div>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className='flex justify-between mt-2 text-xs text-gray-500'>
        <span
          className={`${currentStep >= 1 ? 'text-blue-600 font-medium' : ''}`}
        >
          Basic Info
        </span>
        <span
          className={`${currentStep >= 2 ? 'text-blue-600 font-medium' : ''}`}
        >
          Description
        </span>
        <span
          className={`${currentStep >= 3 ? 'text-blue-600 font-medium' : ''}`}
        >
          Location
        </span>
        <span
          className={`${currentStep >= 4 ? 'text-blue-600 font-medium' : ''}`}
        >
          Requirements
        </span>
        <span
          className={`${currentStep >= 5 ? 'text-blue-600 font-medium' : ''}`}
        >
          Benefits
        </span>
        <span
          className={`${currentStep >= 6 ? 'text-blue-600 font-medium' : ''}`}
        >
          Review
        </span>
      </div>
    </div>
  );

  const renderStepIndicator = (step: number, title: string, icon: string) => (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        currentStep === step
          ? 'bg-blue-50 text-blue-600 border border-blue-200'
          : currentStep > step
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-gray-50 text-gray-400 border border-gray-200'
      }`}
    >
      <span className='text-lg'>{icon}</span>
      <span className='font-medium'>{title}</span>
    </div>
  );

  const renderBasicInfo = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>1</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Basic Information
          </h2>
          <p className='text-gray-600'>Tell us about the job position</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Job Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Enter job title'
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
          {validationErrors.title && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.title}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Position <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='position'
            value={formData.position}
            onChange={handleInputChange}
            placeholder='Enter position'
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.position
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
          {validationErrors.position && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.position}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Industry <span className='text-red-500'>*</span>
          </label>
          <select
            name='industry'
            value={formData.industry}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.industry
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
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
          {validationErrors.industry && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.industry}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Employment Type <span className='text-red-500'>*</span>
          </label>
          <select
            name='employmentType'
            value={formData.employmentType}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.employmentType
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          >
            <option value=''>Select Type</option>
            <option value='FullTime'>Full Time</option>
            <option value='PartTime'>Part Time</option>
            <option value='Contract'>Contract</option>
            <option value='Internship'>Internship</option>
          </select>
          {validationErrors.employmentType && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.employmentType}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>2</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Job Description
          </h2>
          <p className='text-gray-600'>
            Describe the role and responsibilities
          </p>
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700'>
          Detailed Description <span className='text-red-500'>*</span>
        </label>
        <div className='border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200'>
          <RichTextEditor
            content={formData.description}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, description: content }))
            }
            placeholder='Enter detailed job description...'
          />
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>3</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Location & Salary
          </h2>
          <p className='text-gray-600'>
            Where is the job located and what's the compensation?
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            City <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='city'
            value={formData.city}
            onChange={handleInputChange}
            placeholder='e.g., Addis Ababa'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Detailed Location <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={handleInputChange}
            placeholder='e.g., Bole Road, Addis Ababa, Ethiopia'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>
      </div>

      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Salary Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Minimum Salary <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-gray-400'>$</span>
              <input
                type='number'
                name='salaryRange.min'
                value={formData.salaryRange.min}
                onChange={handleInputChange}
                placeholder='50000'
                className='w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Maximum Salary <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-gray-400'>$</span>
              <input
                type='number'
                name='salaryRange.max'
                value={formData.salaryRange.max}
                onChange={handleInputChange}
                placeholder='80000'
                className='w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Payment Type <span className='text-red-500'>*</span>
            </label>
            <select
              name='paymentType'
              value={formData.paymentType}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            >
              <option value=''>Select Payment Type</option>
              <option value='Hourly'>Hourly</option>
              <option value='Monthly'>Monthly</option>
              <option value='Yearly'>Yearly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>4</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Requirements & Qualifications
          </h2>
          <p className='text-gray-600'>
            What skills and qualifications are needed?
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Experience Level <span className='text-red-500'>*</span>
          </label>
          <select
            name='experienceLevel'
            value={formData.experienceLevel}
            onChange={handleInputChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          >
            <option value=''>Select Experience Level</option>
            <option value='Entry'>Entry Level</option>
            <option value='Mid'>Mid Level</option>
            <option value='Senior'>Senior Level</option>
            <option value='Executive'>Executive Level</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Education Level <span className='text-red-500'>*</span>
          </label>
          <select
            name='educationLevel'
            value={formData.educationLevel}
            onChange={handleInputChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          >
            <option value=''>Select Education Level</option>
            <option value='HighSchool'>High School</option>
            <option value='Bachelor'>Bachelor's Degree</option>
            <option value='Master'>Master's Degree</option>
            <option value='PhD'>PhD</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Field of Study <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='fieldOfStudy'
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder='e.g., Computer Science'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Minimum GPA
          </label>
          <input
            type='number'
            name='minimumGPA'
            value={formData.minimumGPA}
            onChange={handleInputChange}
            placeholder='3.0'
            step='0.1'
            min='0'
            max='4'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-gray-700'>
            Required Skills <span className='text-red-500'>*</span>
          </label>
          <button
            type='button'
            onClick={() => addArrayField('skill')}
            className='inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200'
          >
            <span className='mr-1'>+</span> Add Skill
          </button>
        </div>

        <div className='space-y-3'>
          {formData.skill.map((skill, index) => (
            <div key={index} className='flex gap-2 items-center'>
              <input
                type='text'
                value={skill}
                onChange={(e) =>
                  handleArrayInputChange(index, e.target.value, 'skill')
                }
                placeholder='e.g., React, TypeScript, Node.js'
                className='flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
              {formData.skill.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeArrayField(index, 'skill')}
                  className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200'
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>5</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Benefits & Responsibilities
          </h2>
          <p className='text-gray-600'>What will the candidate get and do?</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <label className='block text-sm font-medium text-gray-700'>
              Benefits & Perks
            </label>
            <button
              type='button'
              onClick={() => addArrayField('benefits')}
              className='inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200'
            >
              <span className='mr-1'>+</span> Add Benefit
            </button>
          </div>

          <div className='space-y-3'>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <input
                  type='text'
                  value={benefit}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, 'benefits')
                  }
                  placeholder='e.g., Health Insurance, Remote Work'
                  className='flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
                {formData.benefits.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField(index, 'benefits')}
                    className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200'
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <label className='block text-sm font-medium text-gray-700'>
              Key Responsibilities
            </label>
            <button
              type='button'
              onClick={() => addArrayField('responsibilities')}
              className='inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200'
            >
              <span className='mr-1'>+</span> Add Responsibility
            </button>
          </div>

          <div className='space-y-3'>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className='flex gap-2 items-center'>
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
                  placeholder='e.g., Lead technical design and implementation'
                  className='flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField(index, 'responsibilities')}
                    className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200'
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>6</span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Review & Submit
          </h2>
          <p className='text-gray-600'>
            Review your job posting before publishing
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Application URL
          </label>
          <input
            type='url'
            name='applicationURL'
            value={formData.applicationURL}
            onChange={handleInputChange}
            placeholder='https://company.com/careers'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Number of Positions <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            name='positionNumbers'
            value={formData.positionNumbers}
            onChange={handleInputChange}
            placeholder='1'
            min='1'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Application Deadline <span className='text-red-500'>*</span>
          </label>
          <input
            type='datetime-local'
            name='deadline'
            value={formData.deadline}
            onChange={handleInputChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Gender Preference
          </label>
          <select
            name='gender'
            value={formData.gender}
            onChange={handleInputChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          >
            <option value=''>Select Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700'>
          How to Apply <span className='text-red-500'>*</span>
        </label>
        <textarea
          name='howToApply'
          value={formData.howToApply}
          onChange={handleInputChange}
          placeholder='Enter detailed application instructions...'
          rows={4}
          className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
        />
      </div>

      {/* Job Preview */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Job Preview
        </h3>
        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <h4 className='text-xl font-bold text-gray-900 mb-2'>
            {formData.title}
          </h4>
          <p className='text-gray-600 mb-2'>
            {formData.position} • {formData.city}
          </p>
          <p className='text-gray-600 mb-3'>
            ${formData.salaryRange.min} - ${formData.salaryRange.max}{' '}
            {formData.paymentType}
          </p>
          <div className='flex flex-wrap gap-2 mb-3'>
            {formData.skill.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
              >
                {skill}
              </span>
            ))}
            {formData.skill.length > 3 && (
              <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                +{formData.skill.length - 3} more
              </span>
            )}
          </div>
          <div
            className='text-sm text-gray-700 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: formData.description }}
          />
        </div>
      </div>

      {/* Form Summary */}
      <div className='bg-blue-50 rounded-lg p-6 mt-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>
          Form Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-blue-700 font-medium'>Basic Information</p>
            <p className='text-gray-600'>
              ✓ Job title, position, industry, and employment type
            </p>
          </div>
          <div>
            <p className='text-blue-700 font-medium'>Description</p>
            <p className='text-gray-600'>✓ Detailed job description added</p>
          </div>
          <div>
            <p className='text-blue-700 font-medium'>Location & Salary</p>
            <p className='text-gray-600'>
              ✓ {formData.city}, ${formData.salaryRange.min}-$
              {formData.salaryRange.max} {formData.paymentType}
            </p>
          </div>
          <div>
            <p className='text-blue-700 font-medium'>Requirements</p>
            <p className='text-gray-600'>
              ✓ {formData.skill.filter((s) => s.trim()).length} skills,{' '}
              {formData.experienceLevel} level
            </p>
          </div>
          <div>
            <p className='text-blue-700 font-medium'>Benefits</p>
            <p className='text-gray-600'>
              ✓ {formData.benefits.filter((b) => b.trim()).length} benefits
              added
            </p>
          </div>
          <div>
            <p className='text-blue-700 font-medium'>Responsibilities</p>
            <p className='text-gray-600'>
              ✓ {formData.responsibilities.filter((r) => r.trim()).length}{' '}
              responsibilities defined
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderDescription();
      case 3:
        return renderLocation();
      case 4:
        return renderRequirements();
      case 5:
        return renderBenefits();
      case 6:
        return renderReview();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {renderProgressBar()}

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-8'>{renderCurrentStep()}</div>

          <div className='bg-gray-50 px-8 py-6 border-t border-gray-200'>
            <div className='flex justify-between items-center'>
              <button
                type='button'
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>

              <div className='flex gap-3'>
                {currentStep < totalSteps ? (
                  <button
                    type='button'
                    onClick={nextStep}
                    className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200'
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      'Publish Job'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
