import React, { useState } from 'react';
import {
  X,
  Filter,
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Clock,
  Users,
} from 'lucide-react';

export interface AdvancedFilters {
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
  };
  employmentType: string[];
  educationLevel: string;
  industry: string;
  location: string;
  skills: string[];
  gender: string;
  minimumGPA: number;
  fieldOfStudy: string;
  positionNumbers: number;
  paymentType: string;
}

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
  currentFilters: AdvancedFilters;
}

const experienceOptions = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Expert Level',
  'Freshers',
  '1 - 2 Years',
  '2 - 4 Years',
  '4 - 6 Years',
  '6 - 8 Years',
  '8 - 10 Years',
  '10 - 15 Years',
  '15+ Years',
];

const employmentTypeOptions = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Internship',
  'Remote',
  'Temporary',
  'Freelance',
];

const educationOptions = [
  'High School',
  'Intermediate',
  'Bachelor Degree',
  'Master Degree',
  'PhD',
  'Graduation',
  'Diploma',
];

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Sales',
  'Design',
  'Engineering',
  'Consulting',
  'Non-profit',
  'Government',
  'Other',
];

const genderOptions = ['Any', 'Male', 'Female', 'Other'];

const paymentTypeOptions = [
  'Hourly',
  'Monthly',
  'Yearly',
  'Project-based',
  'Commission',
];

const skillOptions = [
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
  'Go',
  'Rust',
  'C++',
  'C#',
  'Swift',
  'Kotlin',
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
  'Machine Learning',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Project Management',
  'Agile',
  'Scrum',
  'Leadership',
  'Communication',
  'Problem Solving',
  'Team Management',
];

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.skills || [],
  );

  if (!isOpen) return null;

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      skills: selectedSkills,
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters: AdvancedFilters = {
      experienceLevel: '',
      salaryRange: { min: 0, max: 0 },
      employmentType: [],
      educationLevel: '',
      industry: '',
      location: '',
      skills: [],
      gender: '',
      minimumGPA: 0,
      fieldOfStudy: '',
      positionNumbers: 0,
      paymentType: '',
    };
    setFilters(resetFilters);
    setSelectedSkills([]);
  };

  const handleEmploymentTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter((t) => t !== type)
        : [...prev.employmentType, type],
    }));
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 sm:p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-0 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <Filter className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
              Advanced Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors self-end sm:self-auto'
          >
            <X className='w-6 h-6 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
            {/* Experience Level */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Experience Level
                </h3>
              </div>
              <select
                value={filters.experienceLevel}
                onChange={(e) =>
                  handleFilterChange('experienceLevel', e.target.value)
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Any Experience Level</option>
                {experienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Range */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <DollarSign className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Salary Range
                </h3>
              </div>
              <div className='flex gap-2 sm:gap-3'>
                <input
                  type='number'
                  placeholder='Min'
                  value={filters.salaryRange.min || ''}
                  onChange={(e) =>
                    handleFilterChange('salaryRange', {
                      ...filters.salaryRange,
                      min: parseInt(e.target.value) || 0,
                    })
                  }
                  className='flex-1 p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <input
                  type='number'
                  placeholder='Max'
                  value={filters.salaryRange.max || ''}
                  onChange={(e) =>
                    handleFilterChange('salaryRange', {
                      ...filters.salaryRange,
                      max: parseInt(e.target.value) || 0,
                    })
                  }
                  className='flex-1 p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Employment Type */}
            <div className='lg:pl-20 space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <Clock className='w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Employment Type
                </h3>
              </div>
              <div className='space-y-1 sm:space-y-2 max-h-32 overflow-y-auto'>
                {employmentTypeOptions.map((type) => (
                  <label
                    key={type}
                    className='flex items-center gap-2 cursor-pointer text-sm sm:text-base'
                  >
                    <input
                      type='checkbox'
                      checked={filters.employmentType.includes(type)}
                      onChange={() => handleEmploymentTypeToggle(type)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-shrink-0'
                    />
                    <span className='text-gray-700 dark:text-gray-300'>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Education Level */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <GraduationCap className='w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Education Level
                </h3>
              </div>
              <select
                value={filters.educationLevel}
                onChange={(e) =>
                  handleFilterChange('educationLevel', e.target.value)
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Any Education Level</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <Briefcase className='w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Industry
                </h3>
              </div>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Any Industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Location
                </h3>
              </div>
              <input
                type='text'
                placeholder='City, Country'
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Gender */}
            <div className='space-y-2 sm:space-y-3'>
              <div className='flex items-center gap-2'>
                <Users className='w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0' />
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                  Gender
                </h3>
              </div>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Any Gender</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum GPA */}
            <div className='space-y-2 sm:space-y-3'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                Minimum GPA
              </h3>
              <input
                type='number'
                step='0.1'
                min='0'
                max='4'
                placeholder='0.0 - 4.0'
                value={filters.minimumGPA || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'minimumGPA',
                    parseFloat(e.target.value) || 0,
                  )
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Field of Study */}
            <div className='space-y-2 sm:space-y-3'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                Field of Study
              </h3>
              <input
                type='text'
                placeholder='e.g., Computer Science'
                value={filters.fieldOfStudy}
                onChange={(e) =>
                  handleFilterChange('fieldOfStudy', e.target.value)
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Payment Type */}
            <div className='space-y-2 sm:space-y-3'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                Payment Type
              </h3>
              <select
                value={filters.paymentType}
                onChange={(e) =>
                  handleFilterChange('paymentType', e.target.value)
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Any Payment Type</option>
                {paymentTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Numbers */}
            <div className='space-y-2 sm:space-y-3'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                Number of Positions
              </h3>
              <input
                type='number'
                min='1'
                placeholder='Number of positions'
                value={filters.positionNumbers || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'positionNumbers',
                    parseInt(e.target.value) || 0,
                  )
                }
                className='w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className='mt-6 sm:mt-8 space-y-2 sm:space-y-3'>
            <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
              Required Skills
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-2 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg'>
              {skillOptions.map((skill) => (
                <label
                  key={skill}
                  className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 sm:p-2 rounded text-xs sm:text-sm'
                >
                  <input
                    type='checkbox'
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-shrink-0'
                  />
                  <span className='text-gray-700 dark:text-gray-300'>
                    {skill}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0'>
          <button
            onClick={handleReset}
            className='w-full sm:w-auto px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium transition-colors'
          >
            Reset All Filters
          </button>
          <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
            <button
              onClick={onClose}
              className='w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className='w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterModal;
