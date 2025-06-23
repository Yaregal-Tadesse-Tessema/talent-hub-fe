import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ProfessionalTabProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

const educationLevels = [
  'High School',
  'Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Other',
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Sales',
  'Human Resources',
  'Legal',
  'Consulting',
  'Non-profit',
  'Government',
  'Entertainment',
  'Real Estate',
  'Transportation',
  'Energy',
  'Agriculture',
  'Media',
  'Other',
];

const commonLocations = [
  'Addis Ababa, Ethiopia',
  'Nairobi, Kenya',
  'Lagos, Nigeria',
  'Cairo, Egypt',
  'Johannesburg, South Africa',
  'New York, USA',
  'London, UK',
  'Toronto, Canada',
  'Sydney, Australia',
  'Berlin, Germany',
  'Paris, France',
  'Tokyo, Japan',
  'Singapore',
  'Dubai, UAE',
  'Mumbai, India',
  'Other',
];

const technicalSkills = [
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'Angular',
  'Vue.js',
  'TypeScript',
  'PHP',
  'Ruby',
  'C#',
  'C++',
  'Swift',
  'Kotlin',
  'Go',
  'Rust',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'GraphQL',
  'REST API',
  'Git',
  'CI/CD',
  'DevOps',
  'Machine Learning',
  'Data Science',
  'Blockchain',
  'Mobile Development',
  'UI/UX Design',
  'Other',
];

const softSkills = [
  'Leadership',
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Critical Thinking',
  'Creativity',
  'Adaptability',
  'Time Management',
  'Organization',
  'Negotiation',
  'Conflict Resolution',
  'Emotional Intelligence',
  'Public Speaking',
  'Mentoring',
  'Project Management',
  'Customer Service',
  'Sales',
  'Marketing',
  'Research',
  'Analytical Thinking',
  'Strategic Planning',
  'Decision Making',
  'Collaboration',
  'Innovation',
  'Other',
];

export default function ProfessionalTab({
  userProfile,
  setUserProfile,
}: ProfessionalTabProps) {
  const [newIndustry, setNewIndustry] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');

  const handleArrayFieldChange = (
    field: string,
    value: string,
    action: 'add' | 'remove',
  ) => {
    const currentArray = userProfile[field] || [];
    let newArray;

    if (action === 'add') {
      if (!currentArray.includes(value)) {
        newArray = [...currentArray, value];
      } else {
        return; // Already exists
      }
    } else {
      newArray = currentArray.filter((item: string) => item !== value);
    }

    setUserProfile({ ...userProfile, [field]: newArray });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving professional information:', userProfile);
  };

  const renderTagInput = (
    field: string,
    placeholder: string,
    newValue: string,
    setNewValue: (value: string) => void,
    options: string[],
  ) => (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className='flex-1'
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (newValue.trim()) {
                handleArrayFieldChange(field, newValue.trim(), 'add');
                setNewValue('');
              }
            }
          }}
        />
        <Button
          type='button'
          onClick={() => {
            if (newValue.trim()) {
              handleArrayFieldChange(field, newValue.trim(), 'add');
              setNewValue('');
            }
          }}
          className='px-4'
        >
          Add
        </Button>
      </div>

      {/* Selected Tags */}
      <div className='flex flex-wrap gap-2'>
        {(userProfile[field] || []).map((item: string, index: number) => (
          <span
            key={index}
            className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm'
          >
            {item}
            <button
              type='button'
              onClick={() => handleArrayFieldChange(field, item, 'remove')}
              className='ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Quick Add Options */}
      <div className='text-xs text-gray-500 dark:text-gray-400'>
        Quick add:{' '}
        {options.slice(0, 5).map((option, index) => (
          <button
            key={index}
            type='button'
            onClick={() => handleArrayFieldChange(field, option, 'add')}
            className='text-blue-600 dark:text-blue-400 hover:underline mr-2'
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form className='mt-8' onSubmit={handleSave}>
      <div className='space-y-8'>
        {/* Basic Professional Info */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Basic Professional Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Years of Experience */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Years of Experience
              </label>
              <Input
                type='number'
                min='0'
                max='50'
                value={userProfile.yearOfExperience || ''}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    yearOfExperience: parseInt(e.target.value) || 0,
                  })
                }
                placeholder='Enter years of experience'
              />
            </div>

            {/* Highest Level of Education */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Highest Level of Education
              </label>
              <Select
                value={userProfile.highestLevelOfEducation || ''}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    highestLevelOfEducation: e.target.value,
                  })
                }
              >
                <option value=''>Select education level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </div>

            {/* Salary Expectations */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                Salary Expectations (USD/year)
              </label>
              <Input
                type='number'
                min='0'
                value={userProfile.salaryExpectations || ''}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    salaryExpectations: parseInt(e.target.value) || 0,
                  })
                }
                placeholder='Enter expected salary'
              />
            </div>

            {/* AI Generated Job Fit Score */}
            <div>
              <label className='mb-2 text-sm font-medium text-gray-900 dark:text-white block'>
                AI Generated Job Fit Score
              </label>
              <Input
                type='number'
                min='0'
                max='100'
                value={userProfile.aiGeneratedJobFitScore || ''}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    aiGeneratedJobFitScore: parseInt(e.target.value) || 0,
                  })
                }
                placeholder='0-100'
                disabled
                className='bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
              />
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                This score is automatically generated based on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Industry Selection */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Industry Experience
          </h3>
          {renderTagInput(
            'industry',
            'Add industry (e.g., Technology, Healthcare)',
            newIndustry,
            setNewIndustry,
            industries,
          )}
        </div>

        {/* Preferred Job Locations */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Preferred Job Locations
          </h3>
          {renderTagInput(
            'preferredJobLocation',
            'Add location (e.g., Addis Ababa, Ethiopia)',
            newLocation,
            setNewLocation,
            commonLocations,
          )}
        </div>

        {/* Technical Skills */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Technical Skills
          </h3>
          {renderTagInput(
            'technicalSkills',
            'Add technical skill (e.g., JavaScript, React)',
            newTechnicalSkill,
            setNewTechnicalSkill,
            technicalSkills,
          )}
        </div>

        {/* Soft Skills */}
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold mb-6 text-gray-900 dark:text-white'>
            Soft Skills
          </h3>
          {renderTagInput(
            'softSkills',
            'Add soft skill (e.g., Leadership, Communication)',
            newSoftSkill,
            setNewSoftSkill,
            softSkills,
          )}
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button type='submit' className='px-8'>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
