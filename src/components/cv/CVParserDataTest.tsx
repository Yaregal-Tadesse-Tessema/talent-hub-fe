'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { UserProfile } from '@/types/profile';

export default function CVParserDataTest() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleTestSave = async () => {
    setIsLoading(true);

    // Simulate a test user profile
    const testProfile: UserProfile = {
      id: 'test-user-id',
      firstName: 'John',
      middleName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      gender: 'male',
      status: 'Active',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country',
      },
      birthDate: '1990-01-01',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      portfolioUrl: 'https://johndoe.dev',
      yearOfExperience: 5,
      industry: ['Technology', 'Software Development'],
      telegramUserId: 'test_telegram_id',
      preferredJobLocation: ['San Francisco', 'New York'],
      highestLevelOfEducation: 'Bachelor',
      salaryExpectations: 100000,
      aiGeneratedJobFitScore: 85,
      technicalSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      softSkills: ['Leadership', 'Communication', 'Problem Solving'],
      profile: {},
      resume: {},
      educations: {
        'education-1': {
          degree: 'Bachelor of Science',
          institution: 'Test University',
          field: 'Computer Science',
          startDate: '2010-09-01',
          endDate: '2014-05-01',
          current: false,
          description:
            'Studied computer science with focus on software engineering',
        },
      },
      experiences: {
        'experience-1': {
          position: 'Senior Software Engineer',
          company: 'Test Company Inc.',
          startDate: '2020-01-01',
          endDate: '',
          current: true,
          location: 'San Francisco, CA',
          description:
            'Led development of web applications using React and Node.js',
        },
      },
      socialMediaLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
      },
      profileHeadLine: 'Senior Software Engineer with 5+ years of experience',
      coverLetter:
        'Experienced software engineer passionate about building scalable applications.',
      professionalSummery:
        'Dedicated software engineer with expertise in modern web technologies.',
      notificationSetting: [],
      alertConfiguration: [],
      smsAlertConfiguration: [],
      isProfilePublic: false,
      isResumePublic: false,
      isFirstTime: false,
    };

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast({
        type: 'success',
        message: 'Test profile saved successfully!',
      });

      console.log('Test profile data:', testProfile);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to save test profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            CV Parser Data Test
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Test component for CV parser functionality
          </p>
        </div>

        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
            <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2'>
              Test Information
            </h3>
            <p className='text-blue-800 dark:text-blue-200 text-sm'>
              This component allows you to test the CV parser data handling
              functionality. Click the button below to simulate saving a test
              user profile.
            </p>
          </div>

          <div className='flex justify-center'>
            <Button
              onClick={handleTestSave}
              disabled={isLoading}
              variant='default'
              className='px-8 py-3'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Testing...
                </>
              ) : (
                'Test Save Profile'
              )}
            </Button>
          </div>

          <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Test Data Preview:
            </h4>
            <div className='text-xs text-gray-600 dark:text-gray-400 space-y-1'>
              <p>
                <strong>Name:</strong> John Doe
              </p>
              <p>
                <strong>Email:</strong> john.doe@example.com
              </p>
              <p>
                <strong>Experience:</strong> 5 years
              </p>
              <p>
                <strong>Skills:</strong> JavaScript, React, Node.js, TypeScript
              </p>
              <p>
                <strong>Education:</strong> Bachelor of Science in Computer
                Science
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
