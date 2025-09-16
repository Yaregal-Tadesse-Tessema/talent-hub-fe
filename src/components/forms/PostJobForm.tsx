import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor, { RichTextEditorRef } from './RichTextEditor';
import { jobService, JobPosting } from '@/services/jobService';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { industries } from '@/constants/jobOptions';
import {
  jobDescriptionService,
  JobDescriptionRequest,
} from '@/services/jobDescriptionService';

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

interface PostJobFormProps {
  jobId?: string;
}

export default function PostJobForm({ jobId }: PostJobFormProps) {
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
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
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
  const [draftJobId, setDraftJobId] = useState<string | null>(jobId || null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isDraftEditing, setIsDraftEditing] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);
  const { showToast } = useToast();
  const router = useRouter();

  // Generate AI job description
  const generateJobDescription = async () => {
    console.log('🎯 Generate button clicked, current form data:', {
      title: formData.title,
      position: formData.position,
      industry: formData.industry,
      employmentType: formData.employmentType,
    });

    // Validate that we have the required information from step 1
    if (
      !formData.title ||
      !formData.position ||
      !formData.industry ||
      !formData.employmentType
    ) {
      console.log('❌ Validation failed in form');
      showToast({
        type: 'error',
        message:
          'Please complete the basic information (Job Title, Position, Industry, Employment Type) before generating a description.',
      });
      return;
    }

    console.log('✅ Form validation passed, starting generation...');
    setIsGeneratingDescription(true);

    try {
      const request: JobDescriptionRequest = {
        title: formData.title,
        position: formData.position,
        industry: formData.industry,
        employmentType: formData.employmentType,
      };

      console.log('📤 Sending request to jobDescriptionService:', request);
      const response =
        await jobDescriptionService.generateJobDescription(request);

      console.log('📥 Received response from jobDescriptionService:', response);

      if (response.success) {
        console.log('✅ Success! Updating form data with description');
        console.log('📝 Description to be set:', response.description);
        console.log('📝 Current form description:', formData.description);

        // Update form data immediately
        setFormData((prev) => {
          const updated = { ...prev, description: response.description };
          console.log('📝 Updated form data with AI content:', updated);
          return updated;
        });

        // Update editor content directly
        if (editorRef.current) {
          console.log('🎯 Calling direct content update to editor');
          editorRef.current.updateContent(response.description);
        }

        showToast({
          type: 'success',
          message:
            'Job description generated successfully! You can edit it as needed.',
        });
      } else {
        console.log(
          '⚠️ Generation failed, but might have fallback description',
        );
        // Even if AI failed, we might have a fallback description
        if (response.description) {
          // Update form data
          setFormData((prev) => ({
            ...prev,
            description: response.description,
          }));

          // Update editor content
          if (editorRef.current) {
            console.log('🎯 Calling direct content update for fallback');
            editorRef.current.updateContent(response.description);
          }

          showToast({
            type: 'error',
            message:
              response.error ||
              'Generated a template description. Please review and edit as needed.',
          });
        } else {
          showToast({
            type: 'error',
            message:
              response.error ||
              'Failed to generate job description. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Error generating job description:', error);
      showToast({
        type: 'error',
        message:
          'Failed to generate job description. Please try again or write your own description.',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const totalSteps = 6;

  // Load existing job data if jobId is provided
  useEffect(() => {
    const loadExistingJob = async () => {
      if (!jobId) return;

      try {
        setIsLoadingJob(true);
        const job = await jobService.getJobById(jobId);

        // Convert the job data to form data format
        setFormData({
          title: job.title || '',
          description: job.description || '',
          position: job.position || '',
          industry: job.industry || '',
          type: job.type || '',
          city: job.city || '',
          location: job.location || '',
          employmentType: job.employmentType || '',
          salaryRange: {
            min: job.salaryRange?.min?.toString() || '',
            max: job.salaryRange?.max?.toString() || '',
          },
          deadline: job.deadline
            ? new Date(job.deadline).toISOString().slice(0, 16)
            : '',
          requirementId: job.requirementId || '',
          skill: job.skill || [],
          benefits: job.benefits || [],
          responsibilities: job.responsibilities || [],
          status: job.status || 'Draft',
          gender: job.gender || '',
          minimumGPA: job.minimumGPA?.toString() || '',
          postedDate: job.postedDate || new Date().toISOString(),
          applicationURL: job.applicationURL || '',
          experienceLevel: job.experienceLevel || '',
          fieldOfStudy: job.fieldOfStudy || '',
          educationLevel: job.educationLevel || '',
          howToApply: job.howToApply || '',
          onHoldDate: job.onHoldDate || '',
          jobPostRequirement: job.jobPostRequirement || [],
          positionNumbers: job.positionNumbers?.toString() || '',
          paymentType: job.paymentType || '',
        });

        setDraftJobId(job.id);
        setIsDraftEditing(true); // Mark that we're editing a draft
        console.log('📝 Draft job loaded, marking as draft editing mode');
      } catch (error) {
        console.error('Error loading existing job:', error);
        showToast({
          type: 'error',
          message: 'Failed to load existing job data. Please try again.',
        });
      } finally {
        setIsLoadingJob(false);
      }
    };

    loadExistingJob();
  }, [jobId, showToast]);

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

  const saveDraft = async () => {
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
        status: 'Draft',
      };

      let response;
      if (draftJobId) {
        // Update existing draft
        response = await jobService.updateJobPosting({
          ...cleanedData,
          id: draftJobId,
        } as JobPosting);
      } else {
        // Create new draft
        response = await jobService.createJobPosting(cleanedData as JobPosting);
        setDraftJobId(response.id || response.jobPostId);
      }

      showToast({
        type: 'success',
        message: 'Draft saved successfully!',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save draft. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAsDraft = async () => {
    if (!validateCurrentStep()) {
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
        status: 'Draft',
      };

      let response;
      if (draftJobId) {
        // Update existing draft
        response = await jobService.updateJobPosting({
          ...cleanedData,
          id: draftJobId,
        } as JobPosting);
      } else {
        // Create new draft
        response = await jobService.createJobPosting(cleanedData as JobPosting);
        setDraftJobId(response.id || response.jobPostId);
      }

      showToast({
        type: 'success',
        message: 'Draft saved successfully!',
      });

      // Move to next step
      setCurrentStep(currentStep + 1);
      setValidationErrors({});
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save draft. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      // If it's the first step, save as draft first
      if (currentStep === 1) {
        saveAsDraft();
      } else {
        setCurrentStep(currentStep + 1);
        setValidationErrors({});
      }
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
    setShowPublishConfirmation(true);
  };

  const confirmPublish = async () => {
    setShowPublishConfirmation(false);
    setIsSubmitting(true);

    try {
      // Calculate new deadline: 30 days from current date
      const newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + 30);
      const newDeadlineISO = newDeadline.toISOString();

      // Filter out empty array items and ensure proper date formatting
      const cleanedData = {
        ...formData,
        skill: formData.skill.filter(Boolean),
        benefits: formData.benefits.filter(Boolean),
        responsibilities: formData.responsibilities.filter(Boolean),
        jobPostRequirement: formData.jobPostRequirement.filter(Boolean),
        postedDate: new Date(formData.postedDate).toISOString(),
        deadline: newDeadlineISO, // Use the new calculated deadline
        onHoldDate: formData.onHoldDate
          ? new Date(formData.onHoldDate).toISOString()
          : null,
        status: 'Posted',
      };

      if (draftJobId) {
        // Update existing draft to published status
        await jobService.updateJobPosting({
          ...cleanedData,
          id: draftJobId,
        } as JobPosting);
      } else {
        // Create new job posting as published
        await jobService.createJobPosting(cleanedData as JobPosting);
      }

      showToast({
        type: 'success',
        message:
          'Job posted successfully! The application deadline has been set to 30 days from today.',
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
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Step {currentStep} of {totalSteps}
          </span>
          {jobId && draftJobId && (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'>
              Editing Draft
            </span>
          )}
          {draftJobId && !jobId && (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'>
              Draft Saved
            </span>
          )}
          {currentStep === totalSteps && (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'>
              Ready to Publish
            </span>
          )}
        </div>
      </div>
      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
        <div
          className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className='flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400'>
        <span
          className={`${currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
        >
          Basic Info
        </span>
        <span
          className={`${currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
        >
          Description
        </span>
        <span
          className={`${currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
        >
          Location
        </span>
        <span
          className={`${currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
        >
          Requirements
        </span>
        <span
          className={`${currentStep >= 5 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
        >
          Benefits
        </span>
        <span
          className={`${currentStep >= 6 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}
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
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
          : currentStep > step
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
      }`}
    >
      <span className='text-lg'>{icon}</span>
      <span className='font-medium'>{title}</span>
    </div>
  );

  const renderBasicInfo = () => (
    <div className='space-y-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            1
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Basic Information
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Tell us about the job position
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Job Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Enter job title'
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 ${
              validationErrors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {validationErrors.title && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.title}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Position <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='position'
            value={formData.position}
            onChange={handleInputChange}
            placeholder='Enter position'
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 ${
              validationErrors.position
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {validationErrors.position && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.position}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Industry <span className='text-red-500'>*</span>
          </label>
          <select
            name='industry'
            value={formData.industry}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 ${
              validationErrors.industry
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value=''>Select Industry</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.name}
              </option>
            ))}
          </select>
          {validationErrors.industry && (
            <p className='text-red-500 text-sm mt-1'>
              {validationErrors.industry}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Employment Type <span className='text-red-500'>*</span>
          </label>
          <select
            name='employmentType'
            value={formData.employmentType}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 ${
              validationErrors.employmentType
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value=''>Select Employment Type</option>
            <option value='FullTime'>Full Time</option>
            <option value='PartTime'>Part Time</option>
            <option value='Contract'>Contract</option>
            <option value='Internship'>Internship</option>
            <option value='Freelance'>Freelance</option>
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
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            2
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Job Description
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Describe the role and responsibilities
          </p>
        </div>
      </div>

      {/* AI Generation Button */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
              <svg
                className='w-4 h-4 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                AI-Powered Description Generator
              </h3>
              <p className='text-xs text-gray-600 dark:text-gray-300'>
                Generate a professional job description based on your job
                details
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={generateJobDescription}
            disabled={isGeneratingDescription}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
              isGeneratingDescription
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isGeneratingDescription ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400'></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Detailed Description <span className='text-red-500'>*</span>
        </label>
        <div className='border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200'>
          <RichTextEditor
            ref={editorRef}
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
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            3
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Location & Salary
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Where is the job located and what's the compensation?
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            City <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='city'
            value={formData.city}
            onChange={handleInputChange}
            placeholder='e.g., Addis Ababa'
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Detailed Location <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={handleInputChange}
            placeholder='e.g., Bole Road, Addis Ababa, Ethiopia'
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>
      </div>

      <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Salary Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Minimum Salary <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-gray-400 dark:text-gray-500'>
                $
              </span>
              <input
                type='number'
                name='salaryRange.min'
                value={formData.salaryRange.min}
                onChange={handleInputChange}
                placeholder='50000'
                className='w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Maximum Salary <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-gray-400 dark:text-gray-500'>
                $
              </span>
              <input
                type='number'
                name='salaryRange.max'
                value={formData.salaryRange.max}
                onChange={handleInputChange}
                placeholder='80000'
                className='w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Payment Type <span className='text-red-500'>*</span>
            </label>
            <select
              name='paymentType'
              value={formData.paymentType}
              onChange={handleInputChange}
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
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
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            4
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Requirements & Qualifications
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            What skills and qualifications are needed?
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Experience Level <span className='text-red-500'>*</span>
          </label>
          <select
            name='experienceLevel'
            value={formData.experienceLevel}
            onChange={handleInputChange}
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          >
            <option value=''>Select Experience Level</option>
            <option value='Entry'>Entry Level</option>
            <option value='Mid'>Mid Level</option>
            <option value='Senior'>Senior Level</option>
            <option value='Executive'>Executive Level</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Education Level <span className='text-red-500'>*</span>
          </label>
          <select
            name='educationLevel'
            value={formData.educationLevel}
            onChange={handleInputChange}
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          >
            <option value=''>Select Education Level</option>
            <option value='HighSchool'>High School</option>
            <option value='Bachelor'>Bachelor's Degree</option>
            <option value='Master'>Master's Degree</option>
            <option value='PhD'>PhD</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Field of Study <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='fieldOfStudy'
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder='e.g., Computer Science'
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
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
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Required Skills <span className='text-red-500'>*</span>
          </label>
          <button
            type='button'
            onClick={() => addArrayField('skill')}
            className='inline-flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-all duration-200'
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
                className='flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
              />
              {formData.skill.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeArrayField(index, 'skill')}
                  className='p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all duration-200'
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
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            5
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Benefits & Responsibilities
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            What will the candidate get and do?
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Benefits & Perks
            </label>
            <button
              type='button'
              onClick={() => addArrayField('benefits')}
              className='inline-flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-all duration-200'
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
                  className='flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
                />
                {formData.benefits.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField(index, 'benefits')}
                    className='p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all duration-200'
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Key Responsibilities
            </label>
            <button
              type='button'
              onClick={() => addArrayField('responsibilities')}
              className='inline-flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-all duration-200'
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
                  className='flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeArrayField(index, 'responsibilities')}
                    className='p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all duration-200'
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
        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 dark:text-blue-400 font-semibold'>
            6
          </span>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Review & Submit
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Review your job posting before publishing
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Application URL
          </label>
          <input
            type='url'
            name='applicationURL'
            value={formData.applicationURL}
            onChange={handleInputChange}
            placeholder='https://company.com/careers'
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Number of Positions <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            name='positionNumbers'
            value={formData.positionNumbers}
            onChange={handleInputChange}
            placeholder='1'
            min='1'
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Application Deadline <span className='text-red-500'>*</span>
          </label>
          <input
            type='datetime-local'
            name='deadline'
            value={formData.deadline}
            onChange={handleInputChange}
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          />
          <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg'>
            <div className='flex items-start space-x-2'>
              <svg
                className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='text-sm text-blue-800 dark:text-blue-200'>
                <p className='font-medium'>
                  Deadline will be updated when published
                </p>
                <p className='mt-1'>
                  The application deadline will be automatically set to{' '}
                  <span className='font-semibold'>
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>{' '}
                  (30 days from today) when you publish this job posting.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Gender Preference
          </label>
          <select
            name='gender'
            value={formData.gender}
            onChange={handleInputChange}
            className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
          >
            <option value=''>Select Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Any'>Any</option>
          </select>
        </div>
      </div>
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          How to Apply <span className='text-red-500'>*</span>
        </label>
        <textarea
          name='howToApply'
          value={formData.howToApply}
          onChange={handleInputChange}
          placeholder='Enter detailed application instructions...'
          rows={4}
          className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700'
        />
      </div>

      {/* Job Preview */}
      <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Job Preview
        </h3>
        <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600'>
          <h4 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
            {formData.title}
          </h4>
          <p className='text-gray-600 dark:text-gray-300 mb-2'>
            {formData.position} • {formData.city}
          </p>
          <p className='text-gray-600 dark:text-gray-300 mb-3'>
            ${formData.salaryRange.min} - ${formData.salaryRange.max}{' '}
            {formData.paymentType}
          </p>
          <div className='flex flex-wrap gap-2 mb-3'>
            {formData.skill.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full'
              >
                {skill}
              </span>
            ))}
            {formData.skill.length > 3 && (
              <span className='px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full'>
                +{formData.skill.length - 3} more
              </span>
            )}
          </div>
          <div
            className='text-sm text-gray-700 dark:text-gray-300 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: formData.description }}
          />
        </div>
      </div>

      {/* Form Summary */}
      <div className='bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mt-6'>
        <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4'>
          Form Summary
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Basic Information
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              ✓ Job title, position, industry, and employment type
            </p>
          </div>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Description
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              ✓ Detailed job description added
            </p>
          </div>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Location & Salary
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              ✓ {formData.city}, ${formData.salaryRange.min}-$
              {formData.salaryRange.max} {formData.paymentType}
            </p>
          </div>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Requirements
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              ✓ {formData.skill.filter((s) => s.trim()).length} skills,{' '}
              {formData.experienceLevel} level
            </p>
          </div>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Benefits
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
              ✓ {formData.benefits.filter((b) => b.trim()).length} benefits
              added
            </p>
          </div>
          <div>
            <p className='text-blue-700 dark:text-blue-300 font-medium'>
              Responsibilities
            </p>
            <p className='text-gray-600 dark:text-gray-300'>
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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-5xl mx-auto px-4'>
        {renderProgressBar()}

        {isLoadingJob ? (
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='p-8 flex justify-center items-center h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
                <p className='text-gray-600 dark:text-gray-300'>
                  Loading job data...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='p-8'>{renderCurrentStep()}</div>

            <div className='bg-gray-50 dark:bg-gray-700 px-8 py-6 border-t border-gray-200 dark:border-gray-600'>
              <div className='flex justify-between items-center'>
                <button
                  type='button'
                  onClick={prevStep}
                  disabled={currentStep === 1 || isLoadingJob}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentStep === 1 || isLoadingJob
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>

                <div className='flex gap-3'>
                  {draftJobId && currentStep > 1 && (
                    <button
                      type='button'
                      onClick={saveDraft}
                      disabled={isSubmitting || isLoadingJob}
                      className='px-4 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200'
                    >
                      {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                  )}
                  {currentStep < totalSteps ? (
                    <button
                      type='button'
                      onClick={nextStep}
                      disabled={isSubmitting || isLoadingJob}
                      className='px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200'
                    >
                      {currentStep === 1 ? (
                        isSubmitting ? (
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
                            Saving Draft...
                          </span>
                        ) : (
                          'Save As Draft and Continue'
                        )
                      ) : (
                        'Next Step'
                      )}
                    </button>
                  ) : (
                    <button
                      type='button'
                      onClick={handleSubmit}
                      disabled={isSubmitting || isLoadingJob}
                      className={`px-8 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ${
                        isSubmitting || isLoadingJob
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
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
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showPublishConfirmation}
        onClose={() => setShowPublishConfirmation(false)}
        onConfirm={confirmPublish}
        title='Confirm Job Posting'
        message={`Are you sure you want to publish this job posting? This action cannot be undone.

Note: The application deadline will be automatically set to ${new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })} (30 days from today).`}
        confirmText='Publish Job'
        cancelText='Cancel'
        variant='info'
        isLoading={isSubmitting}
      />
    </div>
  );
}
