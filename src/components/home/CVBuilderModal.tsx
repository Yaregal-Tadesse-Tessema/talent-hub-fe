import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  ComputerDesktopIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { frontendCVService, cvTemplates } from '@/services/frontendCV.service';
import { useToast } from '@/contexts/ToastContext';

interface CVBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVBuilderModal({
  isOpen,
  onClose,
}: CVBuilderModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'backend' | 'frontend'>(
    'backend',
  );

  if (!isOpen) return null;

  const handleStartBuilding = () => {
    router.push('/cv-builder');
    onClose();
  };

  const handleFrontendGeneration = async () => {
    if (!user) {
      showToast({
        type: 'error',
        message: 'Please log in to generate your CV',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get sample profile data for demonstration
      const sampleProfile = {
        fullName: 'John Doe',
        title: 'Senior Software Engineer',
        slogan:
          'Experienced software engineer with a passion for building scalable applications and leading development teams.',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        profilePicture: '',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        website: 'https://johndoe.dev',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
        experience: [
          {
            position: 'Senior Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01',
            endDate: '2023-12',
            current: false,
            description:
              'Led development of microservices architecture. Improved system performance by 40%.',
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
              'Specialized in Artificial Intelligence and Machine Learning.',
            location: 'Stanford, CA',
          },
        ],
        certificates: [],
        publications: [],
        projects: [],
        awards: [],
        interests: [],
        volunteer: [],
        references: [],
      };

      await frontendCVService.downloadCV(sampleProfile, selectedTemplate);

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
      setIsGenerating(false);
    }
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design',
      preview: '/images/cv-templates/modern.png',
      popular: true,
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and formal layout',
      preview: '/images/cv-templates/classic.png',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with unique styling',
      preview: '/images/cv-templates/creative.png',
    },
  ];

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Professional Templates',
      description: 'Choose from multiple ATS-friendly designs',
    },
    {
      icon: UserIcon,
      title: 'Easy Customization',
      description: 'Personalize colors, fonts, and layouts',
    },
    {
      icon: AcademicCapIcon,
      title: 'Smart Suggestions',
      description: 'AI-powered content recommendations',
    },
    {
      icon: BriefcaseIcon,
      title: 'Industry Specific',
      description: 'Templates tailored to your field',
    },
  ];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
              <DocumentTextIcon className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'>
                Create Your Professional CV
              </h2>
              <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                Choose a template and start building
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-4 sm:p-6'>
            {/* Features */}
            <div className='mb-6'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Why Choose Our CV Builder?
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700'
                  >
                    <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0'>
                      <feature.icon className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                        {feature.title}
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className='mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl'>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div>
                  <div className='text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400'>
                    10K+
                  </div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>
                    CVs Created
                  </div>
                </div>
                <div>
                  <div className='text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400'>
                    95%
                  </div>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <button
            onClick={onClose}
            className='px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors'
          >
            Maybe Later
          </button>

          {generationType === 'frontend' ? (
            <button
              onClick={handleFrontendGeneration}
              disabled={isGenerating}
              className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
            >
              {isGenerating ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Generating CV...
                </>
              ) : (
                <>
                  <ComputerDesktopIcon className='w-4 h-4' />
                  Generate CV Instantly
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleStartBuilding}
              className='flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
            >
              <DocumentTextIcon className='w-4 h-4' />
              Start Building CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
