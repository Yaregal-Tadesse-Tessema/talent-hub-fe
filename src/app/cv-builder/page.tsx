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
      alert('Resume generated successfully!');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGeneratingResume(false);
      setResumeGenerationProgress(0);
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
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Sample Data Button */}
        <div className='mb-8 flex justify-end'>
          <button
            onClick={handleFillSampleData}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className='flex justify-between text-sm text-gray-600'>
            {steps.map((step) => (
              <span key={step.id}>{step.title}</span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
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
              className={`px-4 py-2 rounded-md ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmationDialog && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Generate Resume
              </h3>
              <p className='text-gray-600 mb-6'>
                Are you ready to generate your resume? This will create a PDF
                file that you can download.
              </p>
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => setShowConfirmationDialog(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateResume}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
                >
                  Generate Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generation Progress */}
        {isGeneratingResume && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Generating Resume
              </h3>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
                  style={{ width: `${resumeGenerationProgress}%` }}
                />
              </div>
              <p className='text-sm text-gray-600 text-center'>
                {resumeGenerationProgress}% Complete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
