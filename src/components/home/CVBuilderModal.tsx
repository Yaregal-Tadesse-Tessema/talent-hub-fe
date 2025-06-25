import React, { useState } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  if (!isOpen) return null;

  const handleStartBuilding = () => {
    if (!user) {
      localStorage.setItem('returnToCVBuilder', '/cv-builder');
      router.push('/login');
    } else {
      router.push('/cv-builder');
    }
    onClose();
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
            {/* Template Selection */}
            <div className='mb-6'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Choose Your Template
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className='p-4'>
                      <div className='aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center'>
                        <DocumentTextIcon className='w-8 h-8 text-gray-400' />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium text-gray-900 dark:text-white'>
                            {template.name}
                          </h4>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {template.description}
                          </p>
                        </div>
                        {template.popular && (
                          <span className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full'>
                            <StarIcon className='w-3 h-3' />
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className='absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center'>
                        <svg
                          className='w-3 h-3 text-white'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
          <button
            onClick={handleStartBuilding}
            className='flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
          >
            <DocumentTextIcon className='w-4 h-4' />
            Start Building CV
          </button>
        </div>
      </div>
    </div>
  );
}
