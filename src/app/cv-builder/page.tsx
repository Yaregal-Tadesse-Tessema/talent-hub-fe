'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalInfoStep from '@/components/cv-builder/steps/PersonalInfoStep';
import ProfessionalSummaryStep from '@/components/cv-builder/steps/ProfessionalSummaryStep';
import ExperienceStep from '@/components/cv-builder/steps/ExperienceStep';
import EducationStep from '@/components/cv-builder/steps/EducationStep';
import SkillsStep from '@/components/cv-builder/steps/SkillsStep';
import AdditionalInfoStep from '@/components/cv-builder/steps/AdditionalInfoStep';
import { cvService } from '@/services/cv.service';
import { frontendCVService } from '@/services/frontendCV.service';
import { useToast } from '@/contexts/ToastContext';
import { ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export type Profile = {
  fullName: string;
  title: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  profilePicture: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  skills: string[];
  experience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    location?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    location?: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  publications: Array<{
    title: string;
    publisher: string;
    date: string;
    url?: string;
    description?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    url?: string;
    technologies?: string[];
  }>;
  awards: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  interests: string[];
  volunteer: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email?: string;
    phone?: string;
    relationship?: string;
  }>;
};

const initialProfile: Profile = {
  fullName: '',
  title: '',
  slogan: '',
  email: '',
  phone: '',
  address: '',
  profilePicture: '',
  linkedin: '',
  github: '',
  twitter: '',
  website: '',
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  publications: [],
  projects: [],
  awards: [],
  interests: [],
  volunteer: [],
  references: [],
};

const sampleProfile: Profile = {
  fullName: 'John Doe',
  title: 'Senior Software Engineer',
  slogan:
    'Experienced software engineer with a passion for building scalable applications and leading development teams. Specialized in full-stack development with React, Node.js, and cloud technologies.',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: 'San Francisco, CA',
  profilePicture: '',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  website: 'https://johndoe.dev',
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'MongoDB',
    'PostgreSQL',
  ],
  experience: [
    {
      position: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: '2020-01',
      endDate: '2023-12',
      current: false,
      description:
        'Led development of microservices architecture. Improved system performance by 40%. Mentored junior developers and implemented CI/CD pipelines.',
      location: 'San Francisco, CA',
    },
    {
      position: 'Software Engineer',
      company: 'StartUp Inc',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description:
        'Developed and maintained web applications using React and Node.js. Implemented automated testing and deployment processes.',
      location: 'San Francisco, CA',
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2018-05',
      current: false,
      description:
        'Specialized in Artificial Intelligence and Machine Learning. Graduated with honors.',
      location: 'Stanford, CA',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      current: false,
      description: "Dean's List. Computer Science Club President.",
      location: 'Berkeley, CA',
    },
  ],
  certificates: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-06',
      description:
        'Professional level certification for AWS cloud architecture',
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google',
      date: '2021-03',
      description: 'Professional level certification for Google Cloud Platform',
    },
  ],
  publications: [
    {
      title: 'Building Scalable Microservices',
      publisher: 'Tech Journal',
      date: '2022-09',
      url: 'https://example.com/publication1',
      description:
        'A comprehensive guide to building and scaling microservices architecture',
    },
  ],
  projects: [
    {
      name: 'Open Source Task Manager',
      description:
        'A full-stack task management application built with React and Node.js',
      startDate: '2021-01',
      endDate: '2022-12',
      current: false,
      url: 'https://github.com/johndoe/task-manager',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    },
  ],
  awards: [
    {
      title: 'Best Developer Award',
      issuer: 'Tech Corp',
      date: '2022-12',
      description:
        "Recognized for outstanding contributions to the company's technical initiatives",
    },
  ],
  interests: [
    'Open Source Contribution',
    'Machine Learning',
    'Cloud Architecture',
    'Hiking',
    'Photography',
  ],
  volunteer: [
    {
      organization: 'Code.org',
      role: 'Mentor',
      startDate: '2021-01',
      endDate: '2023-12',
      current: false,
      description: 'Teaching programming to underprivileged youth',
    },
  ],
  references: [
    {
      name: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Corp',
      email: 'jane.smith@techcorp.com',
      phone: '+1 (555) 987-6543',
      relationship: 'Former Manager',
    },
  ],
};

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'summary', title: 'Professional Summary' },
  { id: 'experience', title: 'Work Experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'additional', title: 'Additional Information' },
];

export default function CVBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [resumeGenerationProgress, setResumeGenerationProgress] = useState(0);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isSavingAsDefault, setIsSavingAsDefault] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [generationType, setGenerationType] = useState<'backend' | 'frontend'>(
    'backend',
  );
  const { showToast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmationDialog(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateProfile = (data: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const handleFillSampleData = () => {
    setProfile(sampleProfile);
  };

  const handleGenerateResume = async () => {
    // Ensure this code only runs on the client
    if (typeof window !== 'undefined') {
      try {
        setIsGeneratingResume(true);
        setResumeGenerationProgress(0);
        setShowConfirmationDialog(false);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setResumeGenerationProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        // Generate resume using the service
        const pdfBlob = await cvService.generateResume(profile);

        clearInterval(progressInterval);
        setResumeGenerationProgress(100);

        // Create a download link for the PDF
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${profile.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Show success message
        showToast({
          type: 'success',
          message: 'Resume generated and downloaded successfully!',
        });
      } catch (error) {
        console.error('Error generating resume:', error);
        showToast({
          type: 'error',
          message: 'Failed to generate resume. Please try again.',
        });
      } finally {
        setIsGeneratingResume(false);
        setResumeGenerationProgress(0);
      }
    }
  };

  const handleSaveAsDefaultResume = async () => {
    // Ensure this code only runs on the client
    if (typeof window !== 'undefined') {
      try {
        setIsGeneratingResume(true);
        setIsSavingAsDefault(true);
        setResumeGenerationProgress(0);
        setShowConfirmationDialog(false);

        // Get user ID from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          showToast({
            type: 'error',
            message: 'User not found. Please log in again.',
          });
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.id;

        if (!userId) {
          showToast({
            type: 'error',
            message: 'User ID not found. Please log in again.',
          });
          return;
        }

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setResumeGenerationProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        // Save the generated resume as default
        const result = await cvService.saveGeneratedResumeAsDefault(
          userId,
          profile,
        );

        clearInterval(progressInterval);
        setResumeGenerationProgress(100);

        // Update localStorage with the new resume info
        const updatedUserData = {
          ...userData,
          resume: result.resume,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        // Also download the file
        const pdfBlob = await cvService.generateResume(profile);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${profile.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Show success message
        showToast({
          type: 'success',
          message: 'Resume saved as default and downloaded successfully!',
        });
      } catch (error) {
        console.error('Error saving resume as default:', error);
        showToast({
          type: 'error',
          message: 'Failed to save resume as default. Please try again.',
        });
      } finally {
        setIsGeneratingResume(false);
        setIsSavingAsDefault(false);
        setResumeGenerationProgress(0);
      }
    }
  };

  const handleFrontendGeneration = async () => {
    try {
      setIsGeneratingResume(true);
      setResumeGenerationProgress(0);
      setShowConfirmationDialog(false);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setResumeGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      // Generate CV using frontend service
      await frontendCVService.downloadCV(profile, selectedTemplate);

      clearInterval(progressInterval);
      setResumeGenerationProgress(100);

      showToast({
        type: 'success',
        message: `CV generated successfully with ${selectedTemplate} template!`,
      });
    } catch (error) {
      console.error('Error generating CV:', error);
      showToast({
        type: 'error',
        message: 'Failed to generate CV. Please try again.',
      });
    } finally {
      setIsGeneratingResume(false);
      setResumeGenerationProgress(0);
    }
  };

  const handleSaveFrontendAsDefaultResume = async () => {
    // Ensure this code only runs on the client
    if (typeof window !== 'undefined') {
      try {
        setIsGeneratingResume(true);
        setIsSavingAsDefault(true);
        setResumeGenerationProgress(0);
        setShowConfirmationDialog(false);

        // Get user ID from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          showToast({
            type: 'error',
            message: 'User not found. Please log in again.',
          });
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.id;

        if (!userId) {
          showToast({
            type: 'error',
            message: 'User ID not found. Please log in again.',
          });
          return;
        }

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setResumeGenerationProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 15;
          });
        }, 200);

        // Save the generated CV as default
        const result = await frontendCVService.saveGeneratedResumeAsDefault(
          userId,
          profile,
          selectedTemplate,
        );

        clearInterval(progressInterval);
        setResumeGenerationProgress(100);

        // Update localStorage with the new resume info
        const updatedUserData = {
          ...userData,
          resume: result.resume,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        // Also download the file
        await frontendCVService.downloadCV(profile, selectedTemplate);

        // Show success message
        showToast({
          type: 'success',
          message: `CV saved as default and downloaded successfully with ${selectedTemplate} template!`,
        });
      } catch (error) {
        console.error('Error saving CV as default:', error);
        showToast({
          type: 'error',
          message: 'Failed to save CV as default. Please try again.',
        });
      } finally {
        setIsGeneratingResume(false);
        setIsSavingAsDefault(false);
        setResumeGenerationProgress(0);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep profile={profile} onUpdate={handleUpdateProfile} />
        );
      case 1:
        return (
          <ProfessionalSummaryStep
            profile={profile}
            onUpdate={handleUpdateProfile}
          />
        );
      case 2:
        return (
          <ExperienceStep profile={profile} onUpdate={handleUpdateProfile} />
        );
      case 3:
        return (
          <EducationStep profile={profile} onUpdate={handleUpdateProfile} />
        );
      case 4:
        return <SkillsStep profile={profile} onUpdate={handleUpdateProfile} />;
      case 5:
        return (
          <AdditionalInfoStep
            profile={profile}
            onUpdate={handleUpdateProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
      <div className='md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Sample Data Button */}
        <div className='mb-8 flex justify-end'>
          <button
            onClick={handleFillSampleData}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
          >
            Fill Sample Data
          </button>
        </div>

        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-2'>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index !== steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400'>
            {steps.map((step) => (
              <span key={step.id} className='hidden sm:block'>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className='mt-8 flex justify-between'>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className='px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmationDialog && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Generate Resume
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Choose how you'd like to generate your resume:
              </p>

              {/* Generation Type Selection */}
              <div className='mb-6'>
                <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                  Generation Method
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
                  <button
                    onClick={() => setGenerationType('backend')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      generationType === 'backend'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
                        <SparklesIcon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <h5 className='font-medium text-gray-900 dark:text-white'>
                          AI-Powered Generation
                        </h5>
                        <span className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full'>
                          Recommended
                        </span>
                      </div>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Advanced AI generates your CV with smart content
                      optimization.
                    </p>
                  </button>

                  <button
                    onClick={() => setGenerationType('frontend')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      generationType === 'frontend'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='p-2 bg-green-100 dark:bg-green-900 rounded-lg'>
                        <ComputerDesktopIcon className='w-5 h-5 text-green-600 dark:text-green-400' />
                      </div>
                      <div>
                        <h5 className='font-medium text-gray-900 dark:text-white'>
                          Instant Generation
                        </h5>
                        <span className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full'>
                          New
                        </span>
                      </div>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Generate instantly in browser with customizable templates.
                    </p>
                  </button>
                </div>
              </div>

              {/* Template Selection for Frontend */}
              {generationType === 'frontend' && (
                <div className='mb-6'>
                  <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                    Choose Template
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    {['modern', 'classic', 'creative'].map((template) => (
                      <button
                        key={template}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          selectedTemplate === template
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className='font-medium text-gray-900 dark:text-white capitalize'>
                          {template}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          {template === 'modern' && 'Clean & Professional'}
                          {template === 'classic' && 'Traditional & Formal'}
                          {template === 'creative' && 'Unique & Visual'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='space-y-3 mb-6'>
                {generationType === 'backend' ? (
                  <>
                    <button
                      onClick={handleSaveAsDefaultResume}
                      className='w-full p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-semibold'>
                              Save as Default Resume
                            </span>
                            <span className='px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full font-medium'>
                              Recommended
                            </span>
                          </div>
                          <p className='text-sm text-blue-100 dark:text-blue-200'>
                            Save this CV as your default resume and download it.
                            This will replace your current resume in your
                            profile.
                          </p>
                        </div>
                        <div className='ml-4'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                          </svg>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleGenerateResume}
                      className='w-full p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-semibold'>
                              Download Only
                            </span>
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-300'>
                            Just download the PDF file without saving it to your
                            profile.
                          </p>
                        </div>
                        <div className='ml-4'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveFrontendAsDefaultResume}
                      className='w-full p-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-semibold'>
                              Save as Default Resume
                            </span>
                            <span className='px-2 py-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full font-medium'>
                              Recommended
                            </span>
                          </div>
                          <p className='text-sm text-green-100 dark:text-green-200'>
                            Save this CV as your default resume and download it.
                            This will replace your current resume in your
                            profile.
                          </p>
                        </div>
                        <div className='ml-4'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                          </svg>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleFrontendGeneration}
                      className='w-full p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-semibold'>
                              Download Only
                            </span>
                            <span className='px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium'>
                              Fast
                            </span>
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-300'>
                            Generate your CV instantly with the{' '}
                            {selectedTemplate} template. Download immediately
                            without saving to profile.
                          </p>
                        </div>
                        <div className='ml-4'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </>
                )}
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={() => setShowConfirmationDialog(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generation Progress */}
        {isGeneratingResume && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                {generationType === 'frontend'
                  ? isSavingAsDefault
                    ? 'Saving CV as Default'
                    : 'Generating CV Instantly'
                  : isSavingAsDefault
                    ? 'Saving Resume as Default'
                    : 'Generating Resume'}
              </h3>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4'>
                <div
                  className='bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300'
                  style={{ width: `${resumeGenerationProgress}%` }}
                />
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
                {generationType === 'frontend'
                  ? isSavingAsDefault
                    ? `${resumeGenerationProgress}% Complete - Saving to your profile...`
                    : `${resumeGenerationProgress}% Complete - Generating in browser...`
                  : isSavingAsDefault
                    ? `${resumeGenerationProgress}% Complete - Saving to your profile...`
                    : `${resumeGenerationProgress}% Complete`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
