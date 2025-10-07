'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SkillInput } from '@/components/ui/SkillInput';
import { TagInput } from '@/components/ui/TagInput';
import { useToast } from '@/contexts/ToastContext';
import {
  ParsedCVData,
  mapExtractedDataToUserProfile,
  cvParsingService,
} from '@/services/cvParsingService';
import { UserProfile } from '@/types/profile';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
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
  Trash2,
  GripVertical,
} from 'lucide-react';

interface CVParserProps {
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  userId: string;
}

export default function CVParser({ onSave, onCancel, userId }: CVParserProps) {
  const [step, setStep] = useState<'upload' | 'review' | 'edit'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [editedData, setEditedData] = useState<ParsedCVData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        showToast({
          type: 'error',
          message: 'Please select a PDF file only',
        });
        return;
      }

      // Check file size (12MB limit)
      if (file.size > 12 * 1024 * 1024) {
        showToast({
          type: 'error',
          message: 'File size exceeds 12MB limit',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleParseCV = async () => {
    if (!selectedFile) {
      showToast({
        type: 'error',
        message: 'Please select a PDF file to parse',
      });
      return;
    }

    setIsParsing(true);
    setShowLoadingAnimation(true);

    try {
      // Use the CV parsing service to extract data from the file
      const extractedData =
        await cvParsingService.extractCVFromFile(selectedFile);
      // Use AI to map the extracted data to UserProfile
      const mappedProfile = await mapExtractedDataToUserProfile(
        extractedData,
        userId,
      );

      // Convert UserProfile back to ParsedCVData for display
      const parsed: ParsedCVData = {
        firstName: mappedProfile.firstName,
        middleName: mappedProfile.middleName,
        lastName: mappedProfile.lastName,
        email: mappedProfile.email,
        phone: mappedProfile.phone,
        gender: mappedProfile.gender,
        birthDate: mappedProfile.birthDate,
        address: mappedProfile.address as any,
        linkedinUrl: mappedProfile.linkedinUrl,
        portfolioUrl: mappedProfile.portfolioUrl,
        yearOfExperience: mappedProfile.yearOfExperience,
        industry: mappedProfile.industry,
        telegramUserId: mappedProfile.telegramUserId,
        preferredJobLocation: mappedProfile.preferredJobLocation,
        highestLevelOfEducation: mappedProfile.highestLevelOfEducation,
        salaryExpectations: mappedProfile.salaryExpectations,
        technicalSkills: mappedProfile.technicalSkills,
        softSkills: mappedProfile.softSkills,
        profileHeadLine: mappedProfile.profileHeadLine,
        coverLetter: mappedProfile.coverLetter,
        professionalSummery: mappedProfile.professionalSummery,
        educations: mappedProfile.educations as any,
        experiences: mappedProfile.experiences as any,
        socialMediaLinks: mappedProfile.socialMediaLinks as any,
      };

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

  const handleDeleteExperience = (keyToDelete: string) => {
    if (editedData) {
      const newExperiences = { ...editedData.experiences };
      delete newExperiences[keyToDelete];
      setEditedData({
        ...editedData,
        experiences: newExperiences,
      });
    }
  };

  const handleDeleteEducation = (keyToDelete: string) => {
    if (editedData) {
      const newEducations = { ...editedData.educations };
      delete newEducations[keyToDelete];
      setEditedData({
        ...editedData,
        educations: newEducations,
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editedData) return;

    const { source, destination, type } = result;

    if (type === 'experience') {
      const experienceEntries = Object.entries(editedData.experiences);
      const [reorderedItem] = experienceEntries.splice(source.index, 1);
      experienceEntries.splice(destination.index, 0, reorderedItem);

      const newExperiences = Object.fromEntries(experienceEntries);
      setEditedData({
        ...editedData,
        experiences: newExperiences,
      });
    } else if (type === 'education') {
      const educationEntries = Object.entries(editedData.educations);
      const [reorderedItem] = educationEntries.splice(source.index, 1);
      educationEntries.splice(destination.index, 0, reorderedItem);

      const newEducations = Object.fromEntries(educationEntries);
      setEditedData({
        ...editedData,
        educations: newEducations,
      });
    }
  };

  const handleSaveToProfile = async () => {
    if (!editedData) return;

    setIsSaving(true);
    try {
      // Convert ParsedCVData back to UserProfile for saving
      const userProfile: UserProfile = {
        id: userId,
        firstName: editedData.firstName,
        middleName: editedData.middleName,
        lastName: editedData.lastName,
        email: editedData.email,
        phone: editedData.phone,
        gender: editedData.gender,
        status: 'Active',
        address: editedData.address as any,
        birthDate: editedData.birthDate,
        linkedinUrl: editedData.linkedinUrl,
        portfolioUrl: editedData.portfolioUrl,
        yearOfExperience: editedData.yearOfExperience,
        industry: editedData.industry,
        telegramUserId: editedData.telegramUserId,
        preferredJobLocation: editedData.preferredJobLocation,
        highestLevelOfEducation: editedData.highestLevelOfEducation,
        salaryExpectations: editedData.salaryExpectations,
        aiGeneratedJobFitScore: 0,
        technicalSkills: editedData.technicalSkills,
        softSkills: editedData.softSkills,
        profile: {},
        resume: {},
        educations: editedData.educations as any,
        experiences: editedData.experiences as any,
        socialMediaLinks: editedData.socialMediaLinks as any,
        profileHeadLine: editedData.profileHeadLine,
        coverLetter: editedData.coverLetter,
        professionalSummery: editedData.professionalSummery,
        notificationSetting: [],
        alertConfiguration: [],
        smsAlertConfiguration: [],
        isProfilePublic: false,
        isResumePublic: false,
        isFirstTime: false,
      };

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
          Upload your CV PDF and we&apos;ll extract your information
          automatically
        </p>
      </div>

      <div className='space-y-4'>
        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6'>
          <div className='text-center'>
            <Upload className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4' />
            <div className='space-y-2'>
              <label
                htmlFor='cv-upload'
                className='cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-offset-gray-800'
              >
                <span>Upload a PDF file</span>
                <input
                  id='cv-upload'
                  name='cv-upload'
                  type='file'
                  accept='.pdf'
                  className='sr-only'
                  onChange={handleFileSelect}
                />
              </label>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                PDF files only, up to 12MB
              </p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
            <div className='flex items-center gap-3'>
              <Check className='h-5 w-5 text-green-600 dark:text-green-400' />
              <div>
                <p className='text-sm font-medium text-green-800 dark:text-green-200'>
                  File selected: {selectedFile.name}
                </p>
                <p className='text-xs text-green-600 dark:text-green-400'>
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Upload your CV or resume in PDF format. Our AI will extract your
          information and organize it into your profile.
        </p>
      </div>

      <div className='flex justify-end gap-4'>
        <Button onClick={onCancel} variant='outline'>
          <X size={16} className='mr-2' />
          Cancel
        </Button>
        <Button
          onClick={handleParseCV}
          disabled={isParsing || !selectedFile}
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

          {/* Experience */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Work Experience
              </h3>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId='experiences' type='experience'>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='space-y-6'
                  >
                    {Object.entries(editedData?.experiences || {}).map(
                      ([key, exp], index) => (
                        <Draggable key={key} draggableId={key} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative ${
                                snapshot.isDragging
                                  ? 'opacity-75 scale-105'
                                  : ''
                              }`}
                            >
                              {/* Experience Card */}
                              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
                                {/* Experience Header */}
                                <div className='flex items-start justify-between mb-4'>
                                  <div className='flex items-center gap-3'>
                                    <div className='flex items-center gap-2'>
                                      <div
                                        {...provided.dragHandleProps}
                                        className='cursor-grab active:cursor-grabbing p-1 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded'
                                      >
                                        <GripVertical className='w-4 h-4 text-blue-500 dark:text-blue-400' />
                                      </div>
                                      <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                        {exp.position || 'Position'}
                                      </h4>
                                      <p className='text-blue-600 dark:text-blue-400 font-medium'>
                                        {exp.company || 'Company'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    {exp.current && (
                                      <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full'>
                                        Current
                                      </span>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleDeleteExperience(key)
                                      }
                                      className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
                                      title='Delete experience'
                                    >
                                      <Trash2 className='w-4 h-4' />
                                    </button>
                                  </div>
                                </div>

                                {/* Experience Details */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                  <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                      Position
                                    </label>
                                    <Input
                                      value={exp.position || ''}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              position: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      className='w-full'
                                      placeholder='e.g., Senior Software Engineer'
                                    />
                                  </div>
                                  <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                      Company
                                    </label>
                                    <Input
                                      value={exp.company || ''}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              company: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      className='w-full'
                                      placeholder='e.g., Google Inc.'
                                    />
                                  </div>
                                  <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                      Start Date
                                    </label>
                                    <Input
                                      value={exp.startDate || ''}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              startDate: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      type='date'
                                      className='w-full'
                                    />
                                  </div>
                                  <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                      End Date
                                    </label>
                                    <Input
                                      value={exp.endDate || ''}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              endDate: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      type='date'
                                      className='w-full'
                                      disabled={exp.current}
                                    />
                                  </div>
                                  <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                      Location
                                    </label>
                                    <Input
                                      value={exp.location || ''}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              location: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      className='w-full'
                                      placeholder='e.g., San Francisco, CA'
                                    />
                                  </div>
                                  <div className='flex items-center'>
                                    <input
                                      type='checkbox'
                                      id={`current-${key}`}
                                      checked={exp.current || false}
                                      onChange={(e) =>
                                        setEditedData({
                                          ...editedData,
                                          experiences: {
                                            ...editedData.experiences,
                                            [key]: {
                                              ...exp,
                                              current: e.target.checked,
                                            },
                                          },
                                        })
                                      }
                                      className='mr-2'
                                    />
                                    <label
                                      htmlFor={`current-${key}`}
                                      className='text-sm font-medium text-gray-700 dark:text-gray-300'
                                    >
                                      Currently working here
                                    </label>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Description
                                  </label>
                                  <Textarea
                                    value={exp.description || ''}
                                    onChange={(e) =>
                                      setEditedData({
                                        ...editedData,
                                        experiences: {
                                          ...editedData.experiences,
                                          [key]: {
                                            ...exp,
                                            description: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    rows={3}
                                    className='w-full'
                                    placeholder='Describe your role, responsibilities, and achievements...'
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ),
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          {/* Education */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <GraduationCap className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Education
              </h3>
            </div>
            <div className='space-y-6'>
              {Object.entries(editedData?.educations || {}).map(
                ([key, edu], index) => (
                  <div key={key} className='relative'>
                    {/* Education Card */}
                    <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
                      {/* Education Header */}
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                              {edu.degree || 'Degree'}
                            </h4>
                            <p className='text-green-600 dark:text-green-400 font-medium'>
                              {edu.institution || 'Institution'}
                            </p>
                          </div>
                        </div>
                        {edu.current && (
                          <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full'>
                            Current
                          </span>
                        )}
                      </div>

                      {/* Education Details */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Degree
                          </label>
                          <Input
                            value={edu.degree || ''}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: { ...edu, degree: e.target.value },
                                },
                              })
                            }
                            className='w-full'
                            placeholder='e.g., Bachelor of Science'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Institution
                          </label>
                          <Input
                            value={edu.institution || ''}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: {
                                    ...edu,
                                    institution: e.target.value,
                                  },
                                },
                              })
                            }
                            className='w-full'
                            placeholder='e.g., Stanford University'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Field of Study
                          </label>
                          <Input
                            value={edu.field || ''}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: { ...edu, field: e.target.value },
                                },
                              })
                            }
                            className='w-full'
                            placeholder='e.g., Computer Science'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Start Date
                          </label>
                          <Input
                            value={edu.startDate || ''}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: { ...edu, startDate: e.target.value },
                                },
                              })
                            }
                            type='date'
                            className='w-full'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            End Date
                          </label>
                          <Input
                            value={edu.endDate || ''}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: { ...edu, endDate: e.target.value },
                                },
                              })
                            }
                            type='date'
                            className='w-full'
                            disabled={edu.current}
                          />
                        </div>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            id={`edu-current-${key}`}
                            checked={edu.current || false}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                educations: {
                                  ...editedData.educations,
                                  [key]: { ...edu, current: e.target.checked },
                                },
                              })
                            }
                            className='mr-2'
                          />
                          <label
                            htmlFor={`edu-current-${key}`}
                            className='text-sm font-medium text-gray-700 dark:text-gray-300'
                          >
                            Currently studying
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Description
                        </label>
                        <Textarea
                          value={edu.description || ''}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              educations: {
                                ...editedData.educations,
                                [key]: { ...edu, description: e.target.value },
                              },
                            })
                          }
                          rows={3}
                          className='w-full'
                          placeholder='Describe your studies, achievements, and relevant coursework...'
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Additional Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <Mail className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Additional Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  LinkedIn URL
                </label>
                <Input
                  value={editedData.linkedinUrl}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      linkedinUrl: e.target.value,
                    })
                  }
                  type='url'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Portfolio URL
                </label>
                <Input
                  value={editedData.portfolioUrl}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      portfolioUrl: e.target.value,
                    })
                  }
                  type='url'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Birth Date
                </label>
                <Input
                  value={editedData.birthDate}
                  onChange={(e) =>
                    setEditedData({ ...editedData, birthDate: e.target.value })
                  }
                  type='date'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Industry
                </label>
                <TagInput
                  value={editedData.industry}
                  onChange={(industry) =>
                    setEditedData({ ...editedData, industry })
                  }
                  placeholder='Type industry and press Enter'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Preferred Job Locations
                </label>
                <TagInput
                  value={editedData.preferredJobLocation}
                  onChange={(preferredJobLocation) =>
                    setEditedData({ ...editedData, preferredJobLocation })
                  }
                  placeholder='Type location and press Enter'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Telegram User ID
                </label>
                <Input
                  value={editedData.telegramUserId}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      telegramUserId: e.target.value,
                    })
                  }
                  className='w-full'
                />
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3 mb-4'>
              <MapPin className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Address Information
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  City
                </label>
                <Input
                  value={editedData.address?.city || ''}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      address: { ...editedData.address, city: e.target.value },
                    })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Country
                </label>
                <Input
                  value={editedData.address?.country || ''}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      address: {
                        ...editedData.address,
                        country: e.target.value,
                      },
                    })
                  }
                  className='w-full'
                />
              </div>
            </div>
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
