import React, { useState } from 'react';
import {
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  ApplicationStatus,
  ApplicationFilters,
} from '@/services/applicationService';

interface FilterModalProps {
  filters: ApplicationFilters;
  setFilters: (filters: ApplicationFilters) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  onApplyFilters?: (filters: ApplicationFilters) => void;
  onClearFilters?: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  filters,
  setFilters,
  filterOpen,
  setFilterOpen,
  onApplyFilters,
  onClearFilters,
}) => {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'experience' | 'skills' | 'dates' | 'tags'
  >('basic');
  const [tempFilters, setTempFilters] = useState(filters);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Top Talent',
    'Needs Review',
    'Interviewed',
    'Follow Up',
    'Potential Fit',
  ]);
  const [newTag, setNewTag] = useState('');

  if (!filterOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: 'technicalSkills' | 'softSkills' | 'tags',
    value: string,
    action: 'add' | 'remove',
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]:
        action === 'add'
          ? [...(prev[field] || []), value]
          : (prev[field] || []).filter((item) => item !== value),
    }));
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;

    // Add to available tags if not already there
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }

    // Add to selected tags if not already selected
    if (!tempFilters.tags?.includes(tag)) {
      handleArrayChange('tags', tag, 'add');
    }

    setNewTag('');
  };

  const applyFilters = async () => {
    setIsProcessing(true);
    setFilters(tempFilters);

    if (onApplyFilters) {
      await onApplyFilters(tempFilters);
    }

    setFilterOpen(false);
    setIsProcessing(false);
  };

  const clearFilters = async () => {
    setIsProcessing(true);
    const clearedFilters: ApplicationFilters = {
      name: '',
      email: '',
      phone: '',
      status: '',
      hasCV: null,
      hasCoverLetter: null,
      isViewed: null,
      hasRemark: null,
      experienceMin: '',
      experienceMax: '',
      education: '',
      gpaMin: '',
      gpaMax: '',
      technicalSkills: [],
      softSkills: [],
      industry: '',
      location: '',
      salaryExpectations: '',
      appliedFrom: '',
      appliedTo: '',
      questionaryScoreMin: '',
      questionaryScoreMax: '',
      aiJobFitScoreMin: '',
      aiJobFitScoreMax: '',
      tags: [],
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    if (onClearFilters) {
      await onClearFilters();
    }
    setIsProcessing(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== '' &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true),
  );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <FunnelIcon className='w-5 h-5 md:w-6 md:h-6 text-blue-600' />
            </div>
            <div>
              <h2 className='text-lg md:text-xl font-semibold text-gray-900'>
                Filter Applications
              </h2>
              <p className='text-xs md:text-sm text-gray-500'>
                Refine your search with multiple criteria
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterOpen(false)}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex flex-col md:flex-row flex-1 min-h-0'>
          {/* Sidebar - Mobile: Horizontal tabs, Desktop: Vertical sidebar */}
          <div className='md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex-shrink-0'>
            <div className='p-2 md:p-4'>
              {/* Mobile: Horizontal scrollable tabs */}
              <div className='md:hidden flex space-x-2 overflow-x-auto pb-2'>
                {[
                  { id: 'tags', label: 'Tags', icon: '🏷️' },
                  { id: 'basic', label: 'Basic Info', icon: '👤' },
                  { id: 'experience', label: 'Experience', icon: '🎓' },
                  { id: 'skills', label: 'Skills', icon: '⚡' },
                  { id: 'dates', label: 'Dates', icon: '📅' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className='text-sm'>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Desktop: Vertical navigation */}
              <nav className='hidden md:block space-y-2'>
                {[
                  { id: 'tags', label: 'Tags', icon: '🏷️' },
                  { id: 'basic', label: 'Basic Info', icon: '👤' },
                  {
                    id: 'experience',
                    label: 'Experience & Education',
                    icon: '🎓',
                  },
                  { id: 'skills', label: 'Skills & Industry', icon: '⚡' },
                  { id: 'dates', label: 'Dates & Scores', icon: '📅' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className='text-lg'>{tab.icon}</span>
                    <span className='font-medium'>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 overflow-y-auto min-h-0'>
            <div className='p-4 md:p-6'>
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className='space-y-4 md:space-y-6'>
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
                      Basic Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Candidate Name
                        </label>
                        <div className='relative'>
                          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                          <input
                            type='text'
                            value={tempFilters.name}
                            onChange={(e) =>
                              handleInputChange('name', e.target.value)
                            }
                            placeholder='Search by name...'
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Email Address
                        </label>
                        <input
                          type='email'
                          value={tempFilters.email}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                          placeholder='Filter by email...'
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Phone Number
                        </label>
                        <input
                          type='tel'
                          value={tempFilters.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                          placeholder='Filter by phone...'
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Application Status
                        </label>
                        <select
                          value={tempFilters.status}
                          onChange={(e) =>
                            handleInputChange('status', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        >
                          <option value=''>All Statuses</option>
                          <option value='PENDING'>Pending</option>
                          <option value='SELECTED'>Selected</option>
                          <option value='REJECTED'>Rejected</option>
                          <option value='HIRED'>Hired</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm md:text-md font-semibold text-gray-800 mb-2 md:mb-3'>
                      Application Details
                    </h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                      {[
                        {
                          field: 'hasCV',
                          label: 'Has CV',
                          trueLabel: 'With CV',
                          falseLabel: 'Without CV',
                        },
                        {
                          field: 'hasCoverLetter',
                          label: 'Has Cover Letter',
                          trueLabel: 'With Cover Letter',
                          falseLabel: 'Without Cover Letter',
                        },
                        {
                          field: 'isViewed',
                          label: 'Viewed Status',
                          trueLabel: 'Viewed',
                          falseLabel: 'Not Viewed',
                        },
                        {
                          field: 'hasRemark',
                          label: 'Has Remarks',
                          trueLabel: 'With Remarks',
                          falseLabel: 'Without Remarks',
                        },
                      ].map(({ field, label, trueLabel, falseLabel }) => (
                        <div key={field}>
                          <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                            {label}
                          </label>
                          <select
                            value={
                              tempFilters[field as keyof typeof tempFilters] ===
                              null
                                ? ''
                                : tempFilters[
                                    field as keyof typeof tempFilters
                                  ]?.toString()
                            }
                            onChange={(e) =>
                              handleInputChange(
                                field,
                                e.target.value === ''
                                  ? null
                                  : e.target.value === 'true',
                              )
                            }
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                          >
                            <option value=''>All</option>
                            <option value='true'>{trueLabel}</option>
                            <option value='false'>{falseLabel}</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Experience & Education Tab */}
              {activeTab === 'experience' && (
                <div className='space-y-4 md:space-y-6'>
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
                      Experience & Education
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Years of Experience
                        </label>
                        <div className='grid grid-cols-2 gap-2 md:gap-3'>
                          <div>
                            <input
                              type='number'
                              value={tempFilters.experienceMin}
                              onChange={(e) =>
                                handleInputChange(
                                  'experienceMin',
                                  e.target.value,
                                )
                              }
                              placeholder='Min years'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                          <div>
                            <input
                              type='number'
                              value={tempFilters.experienceMax}
                              onChange={(e) =>
                                handleInputChange(
                                  'experienceMax',
                                  e.target.value,
                                )
                              }
                              placeholder='Max years'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Education Level
                        </label>
                        <select
                          value={tempFilters.education}
                          onChange={(e) =>
                            handleInputChange('education', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        >
                          <option value=''>All Education Levels</option>
                          <option value='High School'>High School</option>
                          <option value="Associate's Degree">
                            Associate's Degree
                          </option>
                          <option value="Bachelor's Degree">
                            Bachelor's Degree
                          </option>
                          <option value="Master's Degree">
                            Master's Degree
                          </option>
                          <option value='PhD'>PhD</option>
                          <option value='Other'>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          GPA Range
                        </label>
                        <div className='grid grid-cols-2 gap-2 md:gap-3'>
                          <div>
                            <input
                              type='number'
                              step='0.1'
                              min='0'
                              max='4'
                              value={tempFilters.gpaMin}
                              onChange={(e) =>
                                handleInputChange('gpaMin', e.target.value)
                              }
                              placeholder='Min GPA'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                          <div>
                            <input
                              type='number'
                              step='0.1'
                              min='0'
                              max='4'
                              value={tempFilters.gpaMax}
                              onChange={(e) =>
                                handleInputChange('gpaMax', e.target.value)
                              }
                              placeholder='Max GPA'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Salary Expectations
                        </label>
                        <input
                          type='text'
                          value={tempFilters.salaryExpectations}
                          onChange={(e) =>
                            handleInputChange(
                              'salaryExpectations',
                              e.target.value,
                            )
                          }
                          placeholder='Filter by salary expectations...'
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Industry Tab */}
              {activeTab === 'skills' && (
                <div className='space-y-4 md:space-y-6'>
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
                      Skills & Industry
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Technical Skills
                        </label>
                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                          {[
                            'JavaScript',
                            'React',
                            'Node.js',
                            'Python',
                            'Java',
                            'SQL',
                            'AWS',
                            'Docker',
                          ].map((skill) => (
                            <label key={skill} className='flex items-center'>
                              <input
                                type='checkbox'
                                checked={
                                  tempFilters.technicalSkills?.includes(
                                    skill,
                                  ) || false
                                }
                                onChange={(e) =>
                                  handleArrayChange(
                                    'technicalSkills',
                                    skill,
                                    e.target.checked ? 'add' : 'remove',
                                  )
                                }
                                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                              />
                              <span className='ml-2 text-sm text-gray-700'>
                                {skill}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Soft Skills
                        </label>
                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                          {[
                            'Leadership',
                            'Communication',
                            'Teamwork',
                            'Problem Solving',
                            'Time Management',
                            'Adaptability',
                          ].map((skill) => (
                            <label key={skill} className='flex items-center'>
                              <input
                                type='checkbox'
                                checked={
                                  tempFilters.softSkills?.includes(skill) ||
                                  false
                                }
                                onChange={(e) =>
                                  handleArrayChange(
                                    'softSkills',
                                    skill,
                                    e.target.checked ? 'add' : 'remove',
                                  )
                                }
                                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                              />
                              <span className='ml-2 text-sm text-gray-700'>
                                {skill}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Industry
                        </label>
                        <select
                          value={tempFilters.industry}
                          onChange={(e) =>
                            handleInputChange('industry', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        >
                          <option value=''>All Industries</option>
                          <option value='Technology'>Technology</option>
                          <option value='Healthcare'>Healthcare</option>
                          <option value='Finance'>Finance</option>
                          <option value='Education'>Education</option>
                          <option value='Manufacturing'>Manufacturing</option>
                          <option value='Retail'>Retail</option>
                          <option value='Marketing'>Marketing</option>
                          <option value='Other'>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Preferred Location
                        </label>
                        <input
                          type='text'
                          value={tempFilters.location}
                          onChange={(e) =>
                            handleInputChange('location', e.target.value)
                          }
                          placeholder='Filter by location...'
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates & Scores Tab */}
              {activeTab === 'dates' && (
                <div className='space-y-4 md:space-y-6'>
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
                      Application Dates & Scores
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Application Date Range
                        </label>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3'>
                          <div>
                            <input
                              type='date'
                              value={tempFilters.appliedFrom}
                              onChange={(e) =>
                                handleInputChange('appliedFrom', e.target.value)
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                          <div>
                            <input
                              type='date'
                              value={tempFilters.appliedTo}
                              onChange={(e) =>
                                handleInputChange('appliedTo', e.target.value)
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          Questionnaire Score Range
                        </label>
                        <div className='grid grid-cols-2 gap-2 md:gap-3'>
                          <div>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempFilters.questionaryScoreMin}
                              onChange={(e) =>
                                handleInputChange(
                                  'questionaryScoreMin',
                                  e.target.value,
                                )
                              }
                              placeholder='Min score'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                          <div>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempFilters.questionaryScoreMax}
                              onChange={(e) =>
                                handleInputChange(
                                  'questionaryScoreMax',
                                  e.target.value,
                                )
                              }
                              placeholder='Max score'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 md:mb-2'>
                          AI Job Fit Score Range
                        </label>
                        <div className='grid grid-cols-2 gap-2 md:gap-3'>
                          <div>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempFilters.aiJobFitScoreMin}
                              onChange={(e) =>
                                handleInputChange(
                                  'aiJobFitScoreMin',
                                  e.target.value,
                                )
                              }
                              placeholder='Min score'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                          <div>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempFilters.aiJobFitScoreMax}
                              onChange={(e) =>
                                handleInputChange(
                                  'aiJobFitScoreMax',
                                  e.target.value,
                                )
                              }
                              placeholder='Max score'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Tab */}
              {activeTab === 'tags' && (
                <div className='space-y-4 md:space-y-6'>
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>
                      Filter by Tags
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                      Select tags to filter applications. You can choose from
                      existing tags or create new ones.
                    </p>

                    {/* Selected Tags */}
                    {tempFilters.tags && tempFilters.tags.length > 0 && (
                      <div className='mb-6'>
                        <h4 className='text-sm font-medium text-gray-700 mb-2'>
                          Selected Tags ({tempFilters.tags.length})
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {tempFilters.tags.map((tag, index) => (
                            <span
                              key={index}
                              className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'
                            >
                              {tag}
                              <button
                                onClick={() =>
                                  handleArrayChange('tags', tag, 'remove')
                                }
                                className='ml-1 text-blue-600 hover:text-blue-800'
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Tags */}
                    <div className='mb-6'>
                      <h4 className='text-sm font-medium text-gray-700 mb-3'>
                        Available Tags
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() =>
                              handleArrayChange(
                                'tags',
                                tag,
                                tempFilters.tags?.includes(tag)
                                  ? 'remove'
                                  : 'add',
                              )
                            }
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors focus:outline-none ${
                              tempFilters.tags?.includes(tag)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add New Tag */}
                    <div>
                      <h4 className='text-sm font-medium text-gray-700 mb-2'>
                        Create New Tag
                      </h4>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder='Enter new tag name...'
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddTag}
                          disabled={!newTag.trim()}
                          className='px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                        >
                          Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 gap-3'>
          <div className='flex items-center gap-3'>
            <button
              onClick={clearFilters}
              className='px-3 md:px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm'
            >
              Clear All Filters
            </button>
            {hasActiveFilters && (
              <span className='px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'>
                {
                  Object.values(filters).filter(
                    (v) =>
                      v !== '' &&
                      v !== null &&
                      (Array.isArray(v) ? v.length > 0 : true),
                  ).length
                }{' '}
                active filters
              </span>
            )}
          </div>
          <div className='flex gap-2 md:gap-3 w-full sm:w-auto'>
            <button
              onClick={() => setFilterOpen(false)}
              className='flex-1 sm:flex-none px-4 md:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm'
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className='flex-1 sm:flex-none px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
