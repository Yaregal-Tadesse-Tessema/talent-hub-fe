'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SkillInput } from '@/components/ui/SkillInput';
import { TagInput } from '@/components/ui/TagInput';
import { useToast } from '@/contexts/ToastContext';
import {
  parseCVFromText,
  ParsedCVData,
  mapParsedDataToUserProfile,
} from '@/services/cvParsingService';
import { UserProfile } from '@/types/profile';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import {
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Save,
  X,
  Edit3,
  Check,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';

interface CVParserProps {
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  userId: string;
}

export default function CVParser({ onSave, onCancel, userId }: CVParserProps) {
  const [step, setStep] = useState<'upload' | 'review' | 'edit'>('upload');
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [editedData, setEditedData] = useState<ParsedCVData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleCVTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvText(e.target.value);
  };

  const handleParseCV = async () => {
    if (!cvText.trim()) {
      showToast({
        type: 'error',
        message: 'Please enter CV text to parse',
      });
      return;
    }

    setIsParsing(true);
    setShowLoadingAnimation(true);

    try {
      const parsed = await parseCVFromText(cvText);
      console.log('Parsed data received in component:', parsed);

      console.log('Setting parsed data to state:', parsed);
      setParsedData(parsed);
      setEditedData(parsed);
      setStep('review');
      showToast({
        type: 'success',
        message:
          'CV parsed successfully! Please review the extracted information.',
      });
    } catch (error) {
      console.error('Error parsing CV:', error);
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to parse CV',
      });
    } finally {
      setIsParsing(false);
      setShowLoadingAnimation(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingAnimation(false);
  };

  const handleEditData = () => {
    setStep('edit');
  };

  const handleSaveChanges = () => {
    if (editedData) {
      setParsedData(editedData);
    }
    setStep('review');
  };

  const handleSaveToProfile = async () => {
    if (!editedData) return;

    setIsSaving(true);
    try {
      // Use the proper mapping function
      const userProfile = mapParsedDataToUserProfile(editedData, userId);

      onSave(userProfile);
      showToast({
        type: 'success',
        message: 'Profile updated successfully with CV data!',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast({
        type: 'error',
        message: 'Failed to save profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderUploadStep = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <FileText className='mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4' />
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Parse Your CV
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Paste your CV text below and we'll extract your information
          automatically
        </p>
      </div>

      <div className='space-y-4'>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          CV Text
        </label>
        <Textarea
          value={cvText}
          onChange={handleCVTextChange}
          placeholder='Paste your CV/resume text here...'
          rows={15}
          className='w-full'
        />
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Copy and paste the text content from your CV or resume. The AI will
          extract your information and organize it into your profile.
        </p>
      </div>

      <div className='flex justify-end gap-4'>
        <Button onClick={onCancel} variant='outline'>
          <X size={16} className='mr-2' />
          Cancel
        </Button>
        <Button
          onClick={handleParseCV}
          disabled={isParsing || !cvText.trim()}
          variant='primary'
        >
          {isParsing ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              Parsing...
            </>
          ) : (
            <>
              <Eye size={16} className='mr-2' />
              Parse CV
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Review Extracted Information
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Review the information extracted from your CV
          </p>
        </div>
        <Button onClick={handleEditData} variant='outline'>
          <Edit3 size={16} className='mr-2' />
          Edit
        </Button>
      </div>

      {parsedData && (
        <div className='space-y-6'>
          {/* Basic Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <User className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Basic Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Full Name
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {`${parsedData.firstName} ${parsedData.middleName ? parsedData.middleName + ' ' : ''}${parsedData.lastName}`}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Email
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.email || 'Not provided'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Phone
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Gender
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.gender || 'Not specified'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Address
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.address?.street && parsedData.address?.city
                    ? `${parsedData.address.street}, ${parsedData.address.city}${parsedData.address.postalCode ? ', ' + parsedData.address.postalCode : ''}${parsedData.address.country ? ', ' + parsedData.address.country : ''}`
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Industry
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.industry && parsedData.industry.length > 0
                    ? parsedData.industry.join(', ')
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Professional Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Profile Headline
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.profileHeadLine || 'Not provided'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Years of Experience
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.yearOfExperience} years
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Highest Education
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.highestLevelOfEducation || 'Not specified'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Salary Expectations
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.salaryExpectations > 0
                    ? `$${parsedData.salaryExpectations.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Preferred Job Location
                </label>
                <p className='text-gray-900 dark:text-white font-medium'>
                  {parsedData.preferredJobLocation &&
                  parsedData.preferredJobLocation.length > 0
                    ? parsedData.preferredJobLocation.join(', ')
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <GraduationCap className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Skills
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                  Technical Skills
                </label>
                <div className='flex flex-wrap gap-2'>
                  {parsedData.technicalSkills &&
                  parsedData.technicalSkills.length > 0 ? (
                    parsedData.technicalSkills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm'
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400'>
                      No technical skills found
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                  Soft Skills
                </label>
                <div className='flex flex-wrap gap-2'>
                  {parsedData.softSkills && parsedData.softSkills.length > 0 ? (
                    parsedData.softSkills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm'
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400'>
                      No soft skills found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          {parsedData.professionalSummery && (
            <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-3 mb-4'>
                <FileText className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Professional Summary
                </h3>
              </div>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
                {parsedData.professionalSummery}
              </p>
            </section>
          )}

          {/* Experience and Education Summary */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-3'>
                  Work Experience ({Object.keys(parsedData.experiences).length}{' '}
                  positions)
                </h4>
                {Object.keys(parsedData.experiences).length > 0 ? (
                  <div className='space-y-3'>
                    {Object.entries(parsedData.experiences)
                      .slice(0, 3)
                      .map(([key, exp]) => (
                        <div
                          key={key}
                          className='border-l-2 border-blue-500 pl-3'
                        >
                          <p className='font-medium text-gray-900 dark:text-white'>
                            {exp.position || key} at{' '}
                            {exp.company || 'Unknown Company'}
                          </p>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {exp.startDate || 'Unknown'} -{' '}
                            {exp.current ? 'Present' : exp.endDate || 'Unknown'}
                          </p>
                          {exp.location && (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {exp.location}
                            </p>
                          )}
                        </div>
                      ))}
                    {Object.keys(parsedData.experiences).length > 3 && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        +{Object.keys(parsedData.experiences).length - 3} more
                        positions
                      </p>
                    )}
                  </div>
                ) : (
                  <p className='text-gray-500 dark:text-gray-400'>
                    No work experience found
                  </p>
                )}
              </div>
              <div>
                <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-3'>
                  Education ({Object.keys(parsedData.educations).length}{' '}
                  degrees)
                </h4>
                {Object.keys(parsedData.educations).length > 0 ? (
                  <div className='space-y-3'>
                    {Object.entries(parsedData.educations)
                      .slice(0, 3)
                      .map(([key, edu]) => (
                        <div
                          key={key}
                          className='border-l-2 border-green-500 pl-3'
                        >
                          <p className='font-medium text-gray-900 dark:text-white'>
                            {edu.degree || key} from{' '}
                            {edu.institution || 'Unknown Institution'}
                          </p>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {edu.startDate || 'Unknown'} -{' '}
                            {edu.current ? 'Present' : edu.endDate || 'Unknown'}
                          </p>
                          {edu.field && (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {edu.field}
                            </p>
                          )}
                        </div>
                      ))}
                    {Object.keys(parsedData.educations).length > 3 && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        +{Object.keys(parsedData.educations).length - 3} more
                        degrees
                      </p>
                    )}
                  </div>
                ) : (
                  <p className='text-gray-500 dark:text-gray-400'>
                    No education found
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <div className='flex justify-end gap-4'>
        <Button onClick={onCancel} variant='outline'>
          <X size={16} className='mr-2' />
          Cancel
        </Button>
        <Button
          onClick={handleSaveToProfile}
          disabled={isSaving}
          variant='primary'
        >
          {isSaving ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className='mr-2' />
              Save to Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderEditStep = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Edit Extracted Information
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Review and modify the extracted information before saving
          </p>
        </div>
        <Button onClick={handleSaveChanges} variant='primary'>
          <Check size={16} className='mr-2' />
          Save Changes
        </Button>
      </div>

      {editedData && (
        <div className='space-y-6'>
          {/* Basic Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <User className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Basic Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  First Name
                </label>
                <Input
                  value={editedData.firstName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, firstName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Middle Name
                </label>
                <Input
                  value={editedData.middleName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, middleName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Last Name
                </label>
                <Input
                  value={editedData.lastName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, lastName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Email
                </label>
                <Input
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  type='email'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Phone
                </label>
                <Input
                  value={editedData.phone}
                  onChange={(e) =>
                    setEditedData({ ...editedData, phone: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Gender
                </label>
                <Select
                  value={editedData.gender}
                  onChange={(e) =>
                    setEditedData({ ...editedData, gender: e.target.value })
                  }
                  className='w-full'
                >
                  <option value=''>Select gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Select>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Professional Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Profile Headline
                </label>
                <Input
                  value={editedData.profileHeadLine}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      profileHeadLine: e.target.value,
                    })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Years of Experience
                </label>
                <Input
                  value={editedData.yearOfExperience}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      yearOfExperience: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Highest Level of Education
                </label>
                <Select
                  value={editedData.highestLevelOfEducation}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      highestLevelOfEducation: e.target.value,
                    })
                  }
                  className='w-full'
                >
                  <option value=''>Select education level</option>
                  <option value='High School'>High School</option>
                  <option value='Diploma'>Diploma</option>
                  <option value='Bachelor'>Bachelor</option>
                  <option value='Master'>Master</option>
                  <option value='PhD'>PhD</option>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Salary Expectations
                </label>
                <Input
                  value={editedData.salaryExpectations}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      salaryExpectations: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                  className='w-full'
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <GraduationCap className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Skills
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <SkillInput
                value={editedData.technicalSkills}
                onChange={(technicalSkills) =>
                  setEditedData({ ...editedData, technicalSkills })
                }
                label='Technical Skills'
                placeholder='Type a technical skill and press Enter'
              />
              <SkillInput
                value={editedData.softSkills}
                onChange={(softSkills) =>
                  setEditedData({ ...editedData, softSkills })
                }
                label='Soft Skills'
                placeholder='Type a soft skill and press Enter'
              />
            </div>
          </section>

          {/* Professional Summary */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <FileText className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Professional Summary
              </h3>
            </div>
            <Textarea
              value={editedData.professionalSummery}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  professionalSummery: e.target.value,
                })
              }
              rows={4}
              className='w-full'
            />
          </section>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className='max-w-4xl mx-auto p-6'>
        {step === 'upload' && renderUploadStep()}
        {step === 'review' && renderReviewStep()}
        {step === 'edit' && renderEditStep()}
      </div>

      {/* Loading Animation */}
      <LoadingAnimation
        isVisible={showLoadingAnimation}
        onComplete={handleLoadingComplete}
      />
    </>
  );
}
