'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SkillInput } from '@/components/ui/SkillInput';
import { TagInput } from '@/components/ui/TagInput';
import { useToast } from '@/contexts/ToastContext';
import { profileService } from '@/services/profileService';
import Image from 'next/image';
import { UserProfile, FileInfo } from '@/types/profile';
import {
  Edit3,
  Save,
  X,
  Camera,
  Download,
  FileText,
  Globe,
  Linkedin,
  Briefcase,
  GraduationCap,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Monitor,
  Home,
  Award,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { frontendCVService } from '@/services/frontendCV.service';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeResumeTab, setActiveResumeTab] = useState<'view' | 'upload'>(
    'view',
  );
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          if (userData.role !== 'employee') {
            router.push('/dashboard');
            return;
          }

          // Map user data to profile state with proper defaults
          const mappedProfile: UserProfile = {
            id: userData.id || '',
            phone: userData.phone || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            gender: userData.gender || '',
            address: userData.address || {},
            birthDate: userData.birthDate || '',
            linkedinUrl: userData.linkedinUrl || '',
            portfolioUrl: userData.portfolioUrl || '',
            yearOfExperience: parseInt(userData.yearOfExperience) || 0,
            industry: Array.isArray(userData.industry) ? userData.industry : [],
            telegramUserId: userData.telegramUserId || '',
            preferredJobLocation: Array.isArray(userData.preferredJobLocation)
              ? userData.preferredJobLocation
              : [],
            highestLevelOfEducation: userData.highestLevelOfEducation || '',
            salaryExpectations: parseInt(userData.salaryExpectations) || 0,
            aiGeneratedJobFitScore:
              parseInt(userData.aiGeneratedJobFitScore) || 0,
            technicalSkills: Array.isArray(userData.technicalSkills)
              ? userData.technicalSkills
              : [],
            softSkills: Array.isArray(userData.softSkills)
              ? userData.softSkills
              : [],
            profile: userData.profile || {},
            resume: userData.resume || {},
            educations: userData.educations || {},
            experiences: userData.experiences || {},
            socialMediaLinks: userData.socialMediaLinks || {},
            profileHeadLine: userData.profileHeadLine || '',
            coverLetter: userData.coverLetter || '',
            professionalSummery: userData.professionalSummery || '',
            isProfilePublic: userData.isProfilePublic || false,
            isResumePublic: userData.isResumePublic || false,
          };

          console.log('Mapped profile data:', mappedProfile);
          setProfile(mappedProfile);

          // Fetch profile completeness
          try {
            const completenessData =
              await profileService.getProfileCompleteness(userData.id);
            console.log('Profile completeness:', completenessData);
          } catch (error) {
            console.error('Error fetching profile completeness:', error);
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          showToast({
            type: 'error',
            message: 'Error loading profile data',
          });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [router, showToast]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(profile);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...updatedProfile, role: 'employee' }),
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      showToast({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const result = await profileService.uploadProfileImage(profile.id, file);
      const updatedProfile = {
        ...profile,
        profile: result.profile as FileInfo,
      };
      setProfile(updatedProfile);

      // Get the current user data to preserve role
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          ...updatedProfile,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      showToast({
        type: 'success',
        message: 'Profile picture updated successfully',
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to upload profile picture',
      });
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      showToast({
        type: 'error',
        message: 'Only PDF files are allowed',
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

    try {
      const result = await profileService.uploadResume(profile.id, file);
      const updatedProfile = {
        ...profile,
        resume: result.resume as FileInfo,
      };
      setProfile(updatedProfile);

      // Get the current user data to preserve role
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          ...updatedProfile,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      showToast({
        type: 'success',
        message: 'Resume uploaded successfully',
      });
      setActiveResumeTab('view');
    } catch (error) {
      console.error('Error uploading resume:', error);
      showToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to upload resume',
      });
    }
  };

  const handleFrontendCVGeneration = async () => {
    if (!profile) return;

    setIsGeneratingCV(true);
    try {
      // Debug: Log profile structure to understand data format
      console.log('Profile data:', {
        experiences: profile.experiences,
        educations: profile.educations,
        experiencesType: typeof profile.experiences,
        educationsType: typeof profile.educations,
        isExperiencesArray: Array.isArray(profile.experiences),
        isEducationsArray: Array.isArray(profile.educations),
      });

      // Helper function to convert object to array
      const convertObjectToArray = (obj: any): any[] => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
          return Object.values(obj).filter(
            (item) => item && typeof item === 'object',
          );
        }
        return [];
      };

      // Check if we have enough data for a meaningful CV
      const hasExperiences =
        convertObjectToArray(profile.experiences).length > 0;
      const hasEducations = convertObjectToArray(profile.educations).length > 0;
      const hasSkills =
        (profile.technicalSkills || []).length > 0 ||
        (profile.softSkills || []).length > 0;

      // If no meaningful data, use sample data
      if (!hasExperiences && !hasEducations && !hasSkills) {
        console.log(
          'No profile data found, using sample data for CV generation',
        );

        const sampleProfile = {
          fullName: `${profile.firstName} ${profile.lastName}`,
          title: profile.profileHeadLine || 'Professional',
          slogan:
            profile.professionalSummery ||
            'Experienced professional with a passion for excellence.',
          email: profile.email,
          phone: profile.phone,
          address: Array.isArray(profile.preferredJobLocation)
            ? profile.preferredJobLocation.join(', ')
            : profile.preferredJobLocation || 'Your Location',
          profilePicture: profile.profile?.path || '',
          linkedin: profile.linkedinUrl || '',
          github: '',
          twitter: '',
          website: profile.portfolioUrl || '',
          skills: [
            'Professional Skills',
            'Communication',
            'Problem Solving',
            'Teamwork',
          ],
          experience: [
            {
              position: 'Professional',
              company: 'Your Company',
              startDate: '2020-01',
              endDate: '2023-12',
              current: false,
              description: 'Add your professional experience here.',
              location: 'Your Location',
            },
          ],
          education: [
            {
              degree: 'Your Degree',
              institution: 'Your University',
              field: 'Your Field of Study',
              startDate: '2016-09',
              endDate: '2020-05',
              current: false,
              description: 'Add your educational background here.',
              location: 'Your Location',
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
          message: `Sample CV generated! Please update your profile with your actual information for a personalized CV.`,
        });
        return;
      }

      // Convert profile data to CV format
      const cvProfile = {
        fullName: `${profile.firstName} ${profile.lastName}`,
        title: profile.profileHeadLine || 'Professional',
        slogan: profile.professionalSummery || '',
        email: profile.email,
        phone: profile.phone,
        address: Array.isArray(profile.preferredJobLocation)
          ? profile.preferredJobLocation.join(', ')
          : profile.preferredJobLocation || '',
        profilePicture: profile.profile?.path || '',
        linkedin: profile.linkedinUrl || '',
        github: '',
        twitter: '',
        website: profile.portfolioUrl || '',
        skills: [
          ...(profile.technicalSkills || []),
          ...(profile.softSkills || []),
        ],
        experience: convertObjectToArray(profile.experiences).map(
          (exp: any) => ({
            position: exp.position || exp.title || '',
            company: exp.company || exp.employer || '',
            startDate: exp.startDate || exp.startDate || '',
            endDate: exp.endDate || exp.endDate || '',
            current: exp.current || false,
            description: exp.description || exp.summary || '',
            location: exp.location || exp.city || '',
          }),
        ),
        education: convertObjectToArray(profile.educations).map((edu: any) => ({
          degree: edu.degree || edu.title || '',
          institution: edu.institution || edu.school || edu.university || '',
          field: edu.field || edu.major || edu.studyField || '',
          startDate: edu.startDate || edu.startDate || '',
          endDate: edu.endDate || edu.endDate || edu.graduationDate || '',
          current: edu.current || false,
          description: edu.description || edu.summary || '',
          location: edu.location || edu.city || '',
        })),
        certificates: [],
        publications: [],
        projects: [],
        awards: [],
        interests: [],
        volunteer: [],
        references: [],
      };

      console.log('Generated CV profile:', cvProfile);

      await frontendCVService.downloadCV(cvProfile, selectedTemplate);

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
      setIsGeneratingCV(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Profile
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Manage your professional information and preferences
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'primary'}
          className='flex items-center gap-2'
        >
          {isEditing ? (
            <>
              <X size={16} />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={16} />
              Edit
            </>
          )}
        </Button>
      </div>

      <div className='space-y-8'>
        {/* Profile Picture Section */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col items-center'>
            <div className='relative group mb-4'>
              <div className='w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 shadow-lg'>
                {profile?.profile?.path ? (
                  <Image
                    src={profile.profile.path}
                    alt={`${profile.firstName}'s profile picture`}
                    width={160}
                    height={160}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'>
                    <User size={48} />
                  </div>
                )}
              </div>
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                <label className='cursor-pointer'>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleProfileImageUpload}
                  />
                  <div className='p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                    <Camera
                      size={24}
                      className='text-gray-600 dark:text-gray-400'
                    />
                  </div>
                </label>
              </div>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
              Hover over the profile picture to upload a new one
            </p>
          </div>
        </section>

        {/* Basic Information */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <User className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Basic Information
            </h2>
          </div>

          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  First Name
                </label>
                <Input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Middle Name
                </label>
                <Input
                  value={profile.middleName}
                  onChange={(e) =>
                    setProfile({ ...profile, middleName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Email
                </label>
                <Input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
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
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Gender
                </label>
                <Select
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value })
                  }
                  className='w-full'
                >
                  <option value=''>Select gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Birth Date
                </label>
                <Input
                  value={
                    profile.birthDate
                      ? new Date(profile.birthDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setProfile({ ...profile, birthDate: e.target.value })
                  }
                  type='date'
                  className='w-full'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <User size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Full Name
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {`${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Mail size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Email
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.email}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Phone size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Phone
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.phone}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Users size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Gender
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.gender}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Calendar size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Birth Date
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.birthDate
                    ? new Date(profile.birthDate).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Address Information */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <Home className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Address Information
            </h2>
          </div>

          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Street Address
                </label>
                <Input
                  value={profile.address?.street || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value },
                    })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  City
                </label>
                <Input
                  value={profile.address?.city || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, city: e.target.value },
                    })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  State/Province
                </label>
                <Input
                  value={profile.address?.state || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, state: e.target.value },
                    })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Postal Code
                </label>
                <Input
                  value={profile.address?.postalCode || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: {
                        ...profile.address,
                        postalCode: e.target.value,
                      },
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
                  value={profile.address?.country || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, country: e.target.value },
                    })
                  }
                  className='w-full'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {profile.address?.street && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Home size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Street Address
                    </h3>
                  </div>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {profile.address.street}
                  </p>
                </div>
              )}
              {profile.address?.city && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <MapPin size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      City
                    </h3>
                  </div>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {profile.address.city}
                  </p>
                </div>
              )}
              {profile.address?.state && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <MapPin size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      State/Province
                    </h3>
                  </div>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {profile.address.state}
                  </p>
                </div>
              )}
              {profile.address?.postalCode && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <MapPin size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Postal Code
                    </h3>
                  </div>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {profile.address.postalCode}
                  </p>
                </div>
              )}
              {profile.address?.country && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Globe size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Country
                    </h3>
                  </div>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {profile.address.country}
                  </p>
                </div>
              )}
              {!profile.address?.street &&
                !profile.address?.city &&
                !profile.address?.state &&
                !profile.address?.postalCode &&
                !profile.address?.country && (
                  <div className='col-span-full text-center py-8'>
                    <p className='text-gray-500 dark:text-gray-400'>
                      No address information provided
                    </p>
                  </div>
                )}
            </div>
          )}
        </section>

        {/* Professional Information */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <Briefcase className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Professional Information
            </h2>
          </div>

          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Profile Headline
                </label>
                <Input
                  value={profile.profileHeadLine}
                  onChange={(e) =>
                    setProfile({ ...profile, profileHeadLine: e.target.value })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Years of Experience
                </label>
                <Input
                  value={profile.yearOfExperience}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
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
                  value={profile.highestLevelOfEducation}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
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
                  value={profile.salaryExpectations}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      salaryExpectations: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  AI Generated Job Fit Score
                </label>
                <Input
                  value={profile.aiGeneratedJobFitScore}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      aiGeneratedJobFitScore: parseInt(e.target.value) || 0,
                    })
                  }
                  type='number'
                  min='0'
                  max='100'
                  className='w-full'
                  disabled
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  This score is automatically generated by our AI system
                </p>
              </div>
              <div>
                <TagInput
                  value={profile.industry || []}
                  onChange={(industry) => setProfile({ ...profile, industry })}
                  label='Industry'
                  placeholder='Enter industries'
                  tagColor='blue'
                />
              </div>
              <div>
                <TagInput
                  value={profile.preferredJobLocation || []}
                  onChange={(preferredJobLocation) =>
                    setProfile({ ...profile, preferredJobLocation })
                  }
                  label='Preferred Job Location'
                  placeholder='Enter locations'
                  tagColor='green'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Briefcase size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Profile Headline
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.profileHeadLine}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Briefcase size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Years of Experience
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.yearOfExperience} years
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <GraduationCap size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Highest Education
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {profile.highestLevelOfEducation}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <DollarSign size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Salary Expectations
                  </h3>
                </div>
                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                  ${profile.salaryExpectations.toLocaleString()}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Award size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    AI Job Fit Score
                  </h3>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                    <div
                      className='bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${profile.aiGeneratedJobFitScore}%` }}
                    ></div>
                  </div>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white min-w-[3rem]'>
                    {profile.aiGeneratedJobFitScore}%
                  </span>
                </div>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Briefcase size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Industry
                  </h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {profile.industry?.map((ind, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm'
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <MapPin size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Preferred Locations
                  </h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {profile.preferredJobLocation?.map((loc, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm'
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Skills */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <GraduationCap className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Skills
            </h2>
          </div>

          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <SkillInput
                value={profile.technicalSkills || []}
                onChange={(technicalSkills) =>
                  setProfile({ ...profile, technicalSkills })
                }
                label='Technical Skills'
                placeholder='Type a technical skill and press Enter'
              />
              <SkillInput
                value={profile.softSkills || []}
                onChange={(softSkills) =>
                  setProfile({ ...profile, softSkills })
                }
                label='Soft Skills'
                placeholder='Type a soft skill and press Enter'
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <GraduationCap size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Technical Skills
                  </h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {profile.technicalSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Users size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Soft Skills
                  </h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {profile.softSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Professional Summary */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Professional Summary
            </h2>
          </div>

          {isEditing ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Summary
              </label>
              <Textarea
                value={profile.professionalSummery}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    professionalSummery: e.target.value,
                  })
                }
                rows={4}
                className='w-full'
              />
            </div>
          ) : (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
                {profile.professionalSummery}
              </p>
            </div>
          )}
        </section>

        {/* Cover Letter */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Cover Letter
            </h2>
          </div>

          {isEditing ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Cover Letter
              </label>
              <Textarea
                value={profile.coverLetter}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    coverLetter: e.target.value,
                  })
                }
                rows={6}
                className='w-full'
              />
            </div>
          ) : (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
              <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
                {profile.coverLetter}
              </p>
            </div>
          )}
        </section>

        {/* Social Media Links */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <Globe className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Social Media Links
            </h2>
          </div>

          {isEditing ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  LinkedIn URL
                </label>
                <Input
                  value={profile.linkedinUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedinUrl: e.target.value })
                  }
                  type='url'
                  placeholder='https://linkedin.com/in/yourprofile'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Portfolio URL
                </label>
                <Input
                  value={profile.portfolioUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolioUrl: e.target.value })
                  }
                  type='url'
                  placeholder='https://yourportfolio.com'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Telegram User ID
                </label>
                <Input
                  value={profile.telegramUserId}
                  onChange={(e) =>
                    setProfile({ ...profile, telegramUserId: e.target.value })
                  }
                  className='w-full'
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Linkedin size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    LinkedIn
                  </h3>
                </div>
                <a
                  href={profile.linkedinUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  {profile.linkedinUrl}
                </a>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <Globe size={16} className='text-gray-400' />
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Portfolio
                  </h3>
                </div>
                <a
                  href={profile.portfolioUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  {profile.portfolioUrl}
                </a>
              </div>
              {profile.telegramUserId && (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Globe size={16} className='text-gray-400' />
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Telegram
                    </h3>
                  </div>
                  <p className='text-gray-900 dark:text-white'>
                    {profile.telegramUserId}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Resume Section */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-6'>
            <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
              Resume
            </h2>
          </div>

          {/* Resume Tabs */}
          <div className='border-b border-gray-200 dark:border-gray-600 mb-6'>
            <nav className='-mb-px flex space-x-8'>
              <button
                onClick={() => setActiveResumeTab('view')}
                className={`${
                  activeResumeTab === 'view'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Current Resume
              </button>
              <button
                onClick={() => setActiveResumeTab('upload')}
                className={`${
                  activeResumeTab === 'upload'
                    ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Upload New Resume
              </button>
            </nav>
          </div>

          {/* Resume Content */}
          <div className='mt-6'>
            {activeResumeTab === 'view' ? (
              <div className='space-y-4'>
                {profile?.resume?.path ? (
                  <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 gap-4'>
                    <div className='flex items-center space-x-4'>
                      <FileText className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {profile.resume.originalname || 'Resume.pdf'}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4'>
                      <a
                        href={profile.resume.path}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center'
                      >
                        View
                      </a>
                      <button
                        onClick={() => router.push('/cv-builder')}
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
                      >
                        Generate CV
                      </button>
                      <button
                        onClick={handleFrontendCVGeneration}
                        disabled={isGeneratingCV}
                        className='px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2'
                      >
                        {isGeneratingCV ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Monitor className='w-4 h-4' />
                            Generate Instantly
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500 dark:text-gray-400'>
                      No resume uploaded yet
                    </p>
                    <div className='mt-4 flex flex-col sm:flex-row items-center justify-center gap-4'>
                      <button
                        onClick={() => setActiveResumeTab('upload')}
                        className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                      >
                        Upload your resume
                      </button>
                      <button
                        onClick={() => router.push('/cv-builder')}
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
                      >
                        Generate CV with AI
                      </button>
                      <button
                        onClick={handleFrontendCVGeneration}
                        disabled={isGeneratingCV}
                        className='px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2'
                      >
                        {isGeneratingCV ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Monitor className='w-4 h-4' />
                            Generate Instantly
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6'>
                  <div className='text-center'>
                    <Download className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
                    <div className='mt-4'>
                      <label
                        htmlFor='resume-upload'
                        className='cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-offset-gray-800'
                      >
                        <span>Upload a file</span>
                        <input
                          id='resume-upload'
                          name='resume-upload'
                          type='file'
                          accept='.pdf'
                          className='sr-only'
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                        PDF files only, up to 12MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {isEditing && (
          <div className='flex justify-end gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/50 p-6 border border-gray-200 dark:border-gray-700'>
            <Button
              onClick={() => setIsEditing(false)}
              variant='outline'
              className='flex items-center gap-2'
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant='primary'
              className='flex items-center gap-2'
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
