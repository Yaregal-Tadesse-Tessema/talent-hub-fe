'use client';
import React, { useState, useCallback, useRef } from 'react';

export interface FilterState {
  experience: string;
  education: string[];
  gender: string;
  salaryRange: string;
  jobFitScore: string;
  industries: string[];
  radius: number;
}

export interface FilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  loading?: boolean;
}

const experiences = [
  'All',
  'Freshers',
  '1 - 2 Years',
  '2 - 4 Years',
  '4 - 6 Years',
  '6 - 8 Years',
  '8 - 10 Years',
  '10 - 15 Years',
  '15+ Years',
];

const educations = [
  'All',
  'High School',
  'Intermediate',
  'Graduation',
  'Master Degree',
  'Bachelor Degree',
  'Diploma',
  'PhD',
  'Associate Degree',
  'Certificate',
];

const genders = ['All', 'Male', 'Female'];

const salaryRanges = [
  'All',
  'Under $30k',
  '$30k - $50k',
  '$50k - $75k',
  '$75k - $100k',
  '$100k - $150k',
  '$150k+',
];

const jobFitScores = [
  'All',
  '90%+ Match',
  '80-89% Match',
  '70-79% Match',
  '60-69% Match',
  'Below 60%',
];

const industries = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Consulting',
  'Non-profit',
  'Government',
  'Other',
];

export default function CandidateFilters({
  filters,
  onFiltersChange,
  loading = false,
}: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    education: true,
    gender: true,
    salary: true,
    jobFit: true,
    industry: true,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    (newFilters: FilterState) => {
      console.log('Debounced filter change triggered with:', newFilters);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        console.log('Calling onFiltersChange with:', newFilters);
        onFiltersChange(newFilters);
      }, 300);
    },
    [onFiltersChange],
  );

  // Handle single filter change
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      console.log(`Filter changed: ${key} = ${value}`);
      const newFilters = { ...filters, [key]: value };
      debouncedFilterChange(newFilters);
    },
    [filters, debouncedFilterChange],
  );

  // Handle checkbox array changes (education, industries)
  const handleArrayFilterChange = useCallback(
    (key: 'education' | 'industries', value: string) => {
      console.log(`Array filter changed: ${key} = ${value}`);
      const currentArray = filters[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      // Handle "All" selection
      if (value === 'All') {
        const newFilters = { ...filters, [key]: ['All'] };
        debouncedFilterChange(newFilters);
      } else {
        // Remove "All" if other items are selected
        const filteredArray = newArray.filter((item) => item !== 'All');
        const finalArray = filteredArray.length === 0 ? ['All'] : filteredArray;
        const newFilters = { ...filters, [key]: finalArray };
        debouncedFilterChange(newFilters);
      }
    },
    [filters, debouncedFilterChange],
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            className='text-blue-600'
          >
            <path
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
              stroke='currentColor'
              strokeWidth='2'
            />
          </svg>
          Filters
          {loading && (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
          )}
        </h3>
        <button
          onClick={() => {
            const resetFilters: FilterState = {
              experience: 'All',
              education: ['All'],
              gender: 'All',
              salaryRange: 'All',
              jobFitScore: 'All',
              industries: ['All'],
              radius: 32,
            };
            onFiltersChange(resetFilters);
          }}
          className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
        >
          Clear All
        </button>
      </div>

      <div className='space-y-6'>
        {/* Experience Filter */}
        <FilterSection
          title='Experience'
          expanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          <div className='space-y-2'>
            {experiences.map((exp) => (
              <label
                key={exp}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='radio'
                  name='experience'
                  value={exp}
                  checked={filters.experience === exp}
                  onChange={(e) =>
                    handleFilterChange('experience', e.target.value)
                  }
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {exp}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Education Filter */}
        <FilterSection
          title='Education'
          expanded={expandedSections.education}
          onToggle={() => toggleSection('education')}
        >
          <div className='space-y-2'>
            {educations.map((edu) => (
              <label
                key={edu}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='checkbox'
                  checked={filters.education.includes(edu)}
                  onChange={() => handleArrayFilterChange('education', edu)}
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {edu}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection
          title='Gender'
          expanded={expandedSections.gender}
          onToggle={() => toggleSection('gender')}
        >
          <div className='space-y-2'>
            {genders.map((gender) => (
              <label
                key={gender}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='radio'
                  name='gender'
                  value={gender}
                  checked={filters.gender === gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Salary Range Filter */}
        <FilterSection
          title='Salary Expectations'
          expanded={expandedSections.salary}
          onToggle={() => toggleSection('salary')}
        >
          <div className='space-y-2'>
            {salaryRanges.map((range) => (
              <label
                key={range}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='radio'
                  name='salary'
                  value={range}
                  checked={filters.salaryRange === range}
                  onChange={(e) =>
                    handleFilterChange('salaryRange', e.target.value)
                  }
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {range}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Job Fit Score Filter */}
        <FilterSection
          title='AI Job Fit Score'
          expanded={expandedSections.jobFit}
          onToggle={() => toggleSection('jobFit')}
        >
          <div className='space-y-2'>
            {jobFitScores.map((score) => (
              <label
                key={score}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='radio'
                  name='jobFit'
                  value={score}
                  checked={filters.jobFitScore === score}
                  onChange={(e) =>
                    handleFilterChange('jobFitScore', e.target.value)
                  }
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {score}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Industry Filter */}
        <FilterSection
          title='Industry'
          expanded={expandedSections.industry}
          onToggle={() => toggleSection('industry')}
        >
          <div className='space-y-2'>
            {industries.map((industry) => (
              <label
                key={industry}
                className='flex items-center cursor-pointer group'
              >
                <input
                  type='checkbox'
                  checked={filters.industries.includes(industry)}
                  onChange={() =>
                    handleArrayFilterChange('industries', industry)
                  }
                  className='mr-3 accent-blue-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {industry}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

// Filter Section Component
interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className='border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0'>
      <button
        onClick={onToggle}
        className='flex items-center justify-between w-full text-left py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 -mx-2 transition-colors'
      >
        <span className='font-medium text-gray-900 dark:text-white'>
          {title}
        </span>
        <svg
          width='16'
          height='16'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className={`transform transition-transform text-gray-500 dark:text-gray-400 ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          <path
            d='M19 9l-7 7-7-7'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {expanded && <div className='mt-3 pl-2'>{children}</div>}
    </div>
  );
}
