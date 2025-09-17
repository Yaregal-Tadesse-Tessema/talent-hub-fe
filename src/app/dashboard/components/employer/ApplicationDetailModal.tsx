import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  StarIcon,
  EnvelopeIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  XCircleIcon,
  TagIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  messageService,
  Message,
  SendMessageRequest,
} from '@/services/messageService';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import {
  applicationService,
  ApplicationStatus,
} from '@/services/applicationService';
import EmailDialog from '@/components/ui/EmailDialog';
import TagModal from './job-applications-board/TagModal';
import {
  SkillsAnalysisService,
  SkillsAnalysisResult,
} from '@/services/skillsAnalysisService';
import { ApplicationSkillsCard } from '@/components/employer/ApplicationSkillsCard';

export type ApplicationDetail = {
  name: string;
  role: string;
  avatarUrl?: string;
  biography: string;
  coverLetter: string;
  socialLinks: { type: string; url: string }[];
  dob: string;
  nationality: string;
  maritalStatus: string;
  gender: string;
  experience: string;
  education: string;
  resumeUrl: string;
  userId: string;
  contact: {
    website: string;
    location: string;
    address: string;
    phone: string;
    phone2?: string;
    email: string;
  };
};

// Helper function to render social media icon
const getSocialMediaIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();

  switch (platformLower) {
    case 'linkedin':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
        </svg>
      );
    case 'facebook':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0' />
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.92 2.206-4.92 4.924 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.823 2.28 3.152 4.29 3.188A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z' />
        </svg>
      );
    case 'instagram':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.449.425 20.276.131 19 .072 17.72.013 17.311 0 14.052 0h-4.104z' />
          <circle cx='12' cy='12' r='3.5' />
          <circle cx='18.406' cy='5.594' r='1.44' />
        </svg>
      );
    case 'youtube':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.458 3.5 12 3.5 12 3.5s-7.458 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.114 0 12 0 12s0 3.886.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.542 20.5 12 20.5 12 20.5s7.458 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.886 24 12 24 12s0-3.886-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
        </svg>
      );
    case 'github':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
        </svg>
      );
    case 'telegram':
      return (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M9.993 15.07l-.398 4.687c.571 0 .819-.245 1.122-.539l2.688-2.558 5.583 4.084c1.023.569 1.75.269 2.002-.949l3.626-17.043h-.001c.331-1.548-.552-2.152-1.571-1.79L.915 9.158C-.593 9.778-.576 10.63.626 10.99l5.195 1.636 12.037-7.58c.565-.36 1.08-.16.657.2L9.993 15.07z' />
        </svg>
      );
    case 'portfolio':
    case 'website':
      return <GlobeAltIcon className='w-5 h-5' />;
    default:
      return <GlobeAltIcon className='w-5 h-5' />;
  }
};

export default function ApplicationDetailModal({
  open,
  onClose,
  applicationId,
  application,
  onApplicationUpdate,
}: {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  application: ApplicationDetail;
  onApplicationUpdate?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [employer, setEmployer] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [skillsAnalysis, setSkillsAnalysis] =
    useState<SkillsAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvSummary, setCvSummary] = useState<any>(null);
  const [activeRightTab, setActiveRightTab] = useState<
    'summary' | 'skills' | 'analysis'
  >('summary');
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus | null>(
    null,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [tagModal, setTagModal] = useState<{
    open: boolean;
    application: any | null;
  }>({ open: false, application: null });

  // State for confirmation modals
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    action: 'shortlist' | 'reject' | null;
    notifyByEmail: boolean;
  }>({ open: false, action: null, notifyByEmail: false });
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Top Talent',
    'Needs Review',
    'Interviewed',
    'Follow Up',
    'Potential Fit',
  ]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEmployerChange((employerData) => {
    setEmployer(employerData);
  });

  // Generate CV summary with more comprehensive data extraction
  const generateCvSummary = (applicationData: any) => {
    if (!applicationData?.userInfo) return null;

    const userInfo = applicationData.userInfo;
    return {
      // Basic info
      experience: userInfo.yearOfExperience || 0,
      education: userInfo.highestLevelOfEducation || 'Not specified',
      location:
        userInfo.address?.city || userInfo.address?.country || 'Not specified',

      // Skills
      skills: [
        ...(Array.isArray(userInfo.technicalSkills)
          ? userInfo.technicalSkills
          : []),
        ...(Array.isArray(userInfo.softSkills) ? userInfo.softSkills : []),
      ],
      technicalSkills: Array.isArray(userInfo.technicalSkills)
        ? userInfo.technicalSkills
        : [],
      softSkills: Array.isArray(userInfo.softSkills) ? userInfo.softSkills : [],

      // Professional info
      industries: Array.isArray(userInfo.industry) ? userInfo.industry : [],
      summary:
        userInfo.professionalSummery ||
        userInfo.profileHeadLine ||
        'No summary available',
      strengths: Array.isArray(userInfo.technicalSkills)
        ? userInfo.technicalSkills.slice(0, 5)
        : [],

      // Salary and preferences
      salaryExpectation: userInfo.salaryExpectations || null,
      preferredLocations: Array.isArray(userInfo.preferredJobLocation)
        ? userInfo.preferredJobLocation
        : [],

      // Experience details
      experiences: Array.isArray(userInfo.experiences)
        ? userInfo.experiences
        : [],
      educations: Array.isArray(userInfo.educations) ? userInfo.educations : [],

      // Contact and social
      linkedinUrl: userInfo.linkedinUrl,
      portfolioUrl: userInfo.portfolioUrl,
      socialMediaLinks: Array.isArray(userInfo.socialMediaLinks)
        ? userInfo.socialMediaLinks
        : [],

      // Additional insights
      totalSkillsCount:
        (Array.isArray(userInfo.technicalSkills)
          ? userInfo.technicalSkills.length
          : 0) +
        (Array.isArray(userInfo.softSkills) ? userInfo.softSkills.length : 0),
      hasPortfolio: !!(
        userInfo.portfolioUrl ||
        (Array.isArray(userInfo.socialMediaLinks) &&
          userInfo.socialMediaLinks.some(
            (link: any) =>
              link.platform?.toLowerCase().includes('github') ||
              link.platform?.toLowerCase().includes('portfolio'),
          ))
      ),
      experienceLevel:
        userInfo.yearOfExperience >= 5
          ? 'Senior'
          : userInfo.yearOfExperience >= 2
            ? 'Mid-level'
            : 'Junior',
    };
  };

  // Perform skills analysis
  const performSkillsAnalysis = async () => {
    if (!applicationData?.userInfo || !applicationData?.jobPost) return;

    setIsAnalyzing(true);
    try {
      const skillsService = new SkillsAnalysisService();
      const analysis = await skillsService.analyzeSkillsMatch(
        applicationData.userInfo,
        applicationData.jobPost,
      );
      setSkillsAnalysis(analysis);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle shortlist action - show confirmation modal
  const handleShortlistAction = () => {
    if (!applicationId || currentStatus === 'SELECTED') return;
    setConfirmationModal({
      open: true,
      action: 'shortlist',
      notifyByEmail: false,
    });
  };

  // Handle reject action - show confirmation modal
  const handleRejectAction = () => {
    if (!applicationId || currentStatus === 'REJECTED') return;
    setConfirmationModal({
      open: true,
      action: 'reject',
      notifyByEmail: false,
    });
  };

  // Handle confirmation of shortlist/reject action
  const handleConfirmAction = async () => {
    if (!applicationId || !confirmationModal.action) return;

    setIsUpdatingStatus(true);
    try {
      const newStatus =
        confirmationModal.action === 'shortlist' ? 'SELECTED' : 'REJECTED';

      await applicationService.changeApplicationStatus({
        id: applicationId,
        status: newStatus,
      });

      setCurrentStatus(newStatus);
      onApplicationUpdate?.();

      // TODO: Handle email notification if confirmationModal.notifyByEmail is true
      // This would require an API endpoint to send notification emails

      // Close the modal
      setConfirmationModal({ open: false, action: null, notifyByEmail: false });
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle tag action
  const handleTagAction = () => {
    if (applicationData) {
      // Merge application's tags into availableTags if they exist
      const existingTags = applicationData.tags || [];
      const newTags = existingTags.filter(
        (tag: string) => !availableTags.includes(tag),
      );
      if (newTags.length > 0) {
        setAvailableTags([...availableTags, ...newTags]);
      }
      setTagModal({ open: true, application: applicationData });
    }
  };

  // Handle tag save (matching the JobApplicationsBoard implementation)
  const handleTagSave = async (appId: string, tags: string[]) => {
    try {
      if (!applicationData) {
        throw new Error('Application not found');
      }

      // Create a new object without the jobPost property if it exists
      const { jobPost, ...applicationWithoutJobPost } = applicationData;
      const updatedApplication = {
        ...applicationWithoutJobPost,
        tags,
      };

      await applicationService.updateApplicationTags(updatedApplication as any);

      // Update local state to show tags immediately
      setApplicationData({ ...applicationData, tags });
      setTagModal({ open: false, application: null });
      onApplicationUpdate?.();
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const handleSend = async () => {
    if (input.trim() && applicationId && employer) {
      try {
        const messageData: SendMessageRequest = {
          senderFullName: `${employer.firstName} ${employer.lastName}`,
          senderEmployerId: employer.tenantId,
          receiverUserId: applicationData?.userInfo?.id,
          content: input.trim(),
          applicationId: applicationId,
        };
        const newMessage = await messageService.sendMessage(messageData);
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
      } catch (error) {
        // You might want to show an error toast here
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmployer(parsedUser);
      applicationService.getApplicationById(applicationId || '').then((res) => {
        console.log('res', res);
        setApplicationData(res);
        setCurrentStatus((res.status as ApplicationStatus) || null);

        // Generate CV summary
        const summary = generateCvSummary(res);
        setCvSummary(summary);
      });
    }

    const fetchMessages = async () => {
      if (open && applicationId) {
        const fetchedMessages =
          await messageService.getMessagesByApplicationId(applicationId);
        setMessages(fetchedMessages);
      }
    };
    fetchMessages();
  }, [open, applicationId]);

  const handleEmailSuccess = () => {
    // You can add a toast notification here
  };

  const handleEmailError = (error: string) => {
    // You can add a toast notification here
  };

  if (!open) return null;
  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
        <div className='bg-white rounded-2xl shadow-2xl max-w-7xl w-full relative h-full max-h-[95vh] flex flex-col overflow-hidden'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all'
          >
            <XMarkIcon className='w-6 h-6' />
          </button>

          {/* Header Section */}
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white flex-shrink-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <div className='relative'>
                  <div className='w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4 border-white/30'>
                    {application.avatarUrl ? (
                      <img
                        src={application.avatarUrl}
                        alt={application.name}
                        className='w-full h-full rounded-full object-cover'
                      />
                    ) : (
                      application.name[0]
                    )}
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
                    <CheckCircleIcon className='w-4 h-4 text-white' />
                  </div>
                </div>
                <div>
                  <h1 className='text-3xl font-bold mb-1'>
                    {application.name}
                  </h1>
                  <p className='text-blue-100 text-lg mb-2'>
                    {application.role}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-blue-100'>
                    <span className='flex items-center gap-1'>
                      <BriefcaseIcon className='w-4 h-4' />
                      {cvSummary?.experience || 0} years exp
                    </span>
                    <span className='flex items-center gap-1'>
                      <AcademicCapIcon className='w-4 h-4' />
                      {cvSummary?.education}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPinIcon className='w-4 h-4' />
                      {application.contact.location}
                    </span>
                  </div>

                  {/* Tags Display */}
                  {applicationData?.tags && applicationData.tags.length > 0 && (
                    <div className='flex items-center gap-2 mt-3 animate-fade-in'>
                      <TagIcon className='w-4 h-4 text-blue-200' />
                      <div className='flex flex-wrap gap-2'>
                        {applicationData.tags
                          .slice(0, 4)
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className='bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30 hover:bg-white/30 transition-all duration-200'
                            >
                              {tag}
                            </span>
                          ))}
                        {applicationData.tags.length > 4 && (
                          <span className='bg-white/10 backdrop-blur-sm text-blue-200 px-3 py-1 rounded-full text-xs font-medium border border-white/20'>
                            +{applicationData.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-3'>
                {/* Status Indicator */}
                {currentStatus && (
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentStatus === 'SELECTED'
                        ? 'bg-green-100 text-green-800'
                        : currentStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : currentStatus === 'HIRED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {currentStatus === 'SELECTED'
                      ? 'Shortlisted'
                      : currentStatus === 'REJECTED'
                        ? 'Rejected'
                        : currentStatus === 'HIRED'
                          ? 'Hired'
                          : 'Pending'}
                  </div>
                )}

                {/* Action Buttons */}
                <button
                  onClick={handleShortlistAction}
                  disabled={isUpdatingStatus || currentStatus === 'SELECTED'}
                  className='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <HeartIcon className='w-4 h-4' />
                  {currentStatus === 'SELECTED' ? 'Shortlisted' : 'Shortlist'}
                </button>

                <button
                  onClick={handleRejectAction}
                  disabled={isUpdatingStatus || currentStatus === 'REJECTED'}
                  className='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <XCircleIcon className='w-4 h-4' />
                  {currentStatus === 'REJECTED' ? 'Rejected' : 'Reject'}
                </button>

                <button
                  onClick={handleTagAction}
                  className='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2'
                >
                  <TagIcon className='w-4 h-4' />
                  Tag
                </button>

                <button
                  className='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2'
                  onClick={() => setShowEmailDialog(true)}
                >
                  <EnvelopeIcon className='w-4 h-4' />
                  Email
                </button>

                <button className='bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2'>
                  <UserPlusIcon className='w-4 h-4' />
                  Hire Candidate
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='bg-gray-50 border-b border-gray-200 flex-shrink-0'>
            <div className='px-8'>
              <div className='flex gap-8'>
                <button
                  className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                    activeTab === 'details'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Application Details
                </button>
                <button
                  className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                    activeTab === 'chat'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  Messages
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 overflow-hidden min-h-0'>
            {activeTab === 'details' ? (
              <div className='h-full flex'>
                {/* Left Column - Candidate Information */}
                <div className='flex-1 overflow-y-auto px-8 py-6'>
                  {/* Key Insights Section */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    {/* Experience Level */}
                    <div className='bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                          <BriefcaseIcon className='w-5 h-5 text-green-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900 text-sm'>
                            Experience Level
                          </h3>
                          <p className='text-lg font-bold text-green-700'>
                            {cvSummary?.experienceLevel || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <p className='text-xs text-gray-600'>
                        {cvSummary?.experience || 0} years total experience
                      </p>
                    </div>

                    {/* Skills Match */}
                    <div className='bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 shadow-sm'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                          <ChartBarIcon className='w-5 h-5 text-purple-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900 text-sm'>
                            Total Skills
                          </h3>
                          <p className='text-lg font-bold text-purple-700'>
                            {cvSummary?.totalSkillsCount || 0}
                          </p>
                        </div>
                      </div>
                      <p className='text-xs text-gray-600'>
                        {cvSummary?.technicalSkills?.length || 0} technical,{' '}
                        {cvSummary?.softSkills?.length || 0} soft skills
                      </p>
                    </div>

                    {/* Salary Expectation */}
                    <div className='bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 shadow-sm'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                          <span className='text-blue-600 font-bold text-sm'>
                            $
                          </span>
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900 text-sm'>
                            Salary Expectation
                          </h3>
                          <p className='text-lg font-bold text-blue-700'>
                            {cvSummary?.salaryExpectation
                              ? `$${cvSummary.salaryExpectation.toLocaleString()}`
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <p className='text-xs text-gray-600'>
                        Annual expectation
                      </p>
                    </div>
                  </div>

                  {/* Resume Download Section */}
                  <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                          <DocumentTextIcon className='w-6 h-6 text-blue-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900 mb-1'>
                            Resume & Portfolio
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {cvSummary?.hasPortfolio
                              ? 'Portfolio available'
                              : 'Resume only'}{' '}
                            • Last updated recently
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <a
                          href={application.resumeUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md'
                        >
                          <ArrowDownTrayIcon className='w-4 h-4' />
                          Download CV
                        </a>

                        {cvSummary?.portfolioUrl && (
                          <a
                            href={cvSummary.portfolioUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 border border-green-300 text-green-700 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 font-medium transition-all duration-200'
                          >
                            <GlobeAltIcon className='w-4 h-4' />
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className='bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                      <SparklesIcon className='w-5 h-5 text-blue-600' />
                      Professional Summary
                    </h3>
                    <p className='text-gray-700 leading-relaxed'>
                      {cvSummary?.summary ||
                        application.biography ||
                        'No professional summary available.'}
                    </p>
                  </div>

                  {/* Cover Letter */}
                  <div className='bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                      <EnvelopeIcon className='w-5 h-5 text-blue-600' />
                      Cover Letter
                    </h3>
                    <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
                      {application.coverLetter || 'No cover letter provided.'}
                    </div>
                  </div>

                  {/* Detailed Experience & Education */}
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                    {/* Work Experience */}
                    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <BriefcaseIcon className='w-5 h-5 text-green-600' />
                        Work Experience
                      </h3>
                      {cvSummary?.experiences?.length > 0 ? (
                        <div className='space-y-4 max-h-80 overflow-y-auto'>
                          {cvSummary.experiences
                            .slice(0, 3)
                            .map((exp: any, index: number) => (
                              <div
                                key={index}
                                className='border-l-4 border-green-200 pl-4 pb-4'
                              >
                                <h4 className='font-semibold text-gray-900 text-sm'>
                                  {exp.jobTitle || exp.title || 'Position'}
                                </h4>
                                <p className='text-sm text-green-600 font-medium'>
                                  {exp.companyName || exp.company || 'Company'}
                                </p>
                                <p className='text-xs text-gray-500 mb-2'>
                                  {exp.startDate && exp.endDate
                                    ? `${exp.startDate} - ${exp.endDate}`
                                    : exp.duration || 'Duration not specified'}
                                </p>
                                {exp.description && (
                                  <p className='text-xs text-gray-700 line-clamp-2'>
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          {cvSummary.experiences.length > 3 && (
                            <p className='text-xs text-gray-500 text-center pt-2 border-t'>
                              +{cvSummary.experiences.length - 3} more positions
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <BriefcaseIcon className='w-8 h-8 mx-auto mb-2 opacity-50' />
                          <p className='text-sm'>
                            No detailed work experience available
                          </p>
                          <p className='text-xs'>
                            Total experience: {cvSummary?.experience || 0} years
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <AcademicCapIcon className='w-5 h-5 text-purple-600' />
                        Education
                      </h3>
                      {cvSummary?.educations?.length > 0 ? (
                        <div className='space-y-4 max-h-80 overflow-y-auto'>
                          {cvSummary.educations
                            .slice(0, 3)
                            .map((edu: any, index: number) => (
                              <div
                                key={index}
                                className='border-l-4 border-purple-200 pl-4 pb-4'
                              >
                                <h4 className='font-semibold text-gray-900 text-sm'>
                                  {edu.degree || edu.level || 'Degree'}
                                </h4>
                                <p className='text-sm text-purple-600 font-medium'>
                                  {edu.institution ||
                                    edu.school ||
                                    'Institution'}
                                </p>
                                <p className='text-xs text-gray-500 mb-2'>
                                  {edu.fieldOfStudy && (
                                    <span className='block'>
                                      {edu.fieldOfStudy}
                                    </span>
                                  )}
                                  {edu.graduationYear ||
                                    edu.year ||
                                    edu.endDate ||
                                    'Year not specified'}
                                </p>
                                {edu.gpa && (
                                  <p className='text-xs text-gray-700'>
                                    GPA: {edu.gpa}
                                  </p>
                                )}
                              </div>
                            ))}
                          {cvSummary.educations.length > 3 && (
                            <p className='text-xs text-gray-500 text-center pt-2 border-t'>
                              +{cvSummary.educations.length - 3} more
                              qualifications
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <AcademicCapIcon className='w-8 h-8 mx-auto mb-2 opacity-50' />
                          <p className='text-sm'>
                            No detailed education information
                          </p>
                          <p className='text-xs'>
                            Highest level: {cvSummary?.education}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferences & Requirements */}
                  {(cvSummary?.preferredLocations?.length > 0 ||
                    cvSummary?.salaryExpectation) && (
                    <div className='bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <ClockIcon className='w-5 h-5 text-orange-600' />
                        Preferences & Requirements
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {cvSummary?.preferredLocations?.length > 0 && (
                          <div>
                            <h4 className='text-sm font-medium text-gray-700 mb-2'>
                              Preferred Locations
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {cvSummary.preferredLocations
                                .slice(0, 4)
                                .map((location: string, index: number) => (
                                  <span
                                    key={index}
                                    className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium'
                                  >
                                    {location}
                                  </span>
                                ))}
                              {cvSummary.preferredLocations.length > 4 && (
                                <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs'>
                                  +{cvSummary.preferredLocations.length - 4}{' '}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {cvSummary?.salaryExpectation && (
                          <div>
                            <h4 className='text-sm font-medium text-gray-700 mb-2'>
                              Salary Expectation
                            </h4>
                            <div className='bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold inline-block'>
                              ${cvSummary.salaryExpectation.toLocaleString()} /
                              year
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact & Personal Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    {/* Contact Information */}
                    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4'>
                        Contact Information
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <EnvelopeIcon className='w-4 h-4 text-gray-400' />
                          <span className='text-sm text-gray-700'>
                            {application.contact.email}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <PhoneIcon className='w-4 h-4 text-gray-400' />
                          <span className='text-sm text-gray-700'>
                            {application.contact.phone}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <MapPinIcon className='w-4 h-4 text-gray-400' />
                          <span className='text-sm text-gray-700'>
                            {application.contact.location}
                          </span>
                        </div>
                        {application.contact.website && (
                          <div className='flex items-center gap-3'>
                            <GlobeAltIcon className='w-4 h-4 text-gray-400' />
                            <a
                              href={application.contact.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-sm text-blue-600 hover:text-blue-800'
                            >
                              {application.contact.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4'>
                        Personal Details
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Date of Birth</span>
                          <span className='text-sm text-gray-900'>
                            {application.dob}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Nationality</span>
                          <span className='text-sm text-gray-900'>
                            {application.nationality}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Gender</span>
                          <span className='text-sm text-gray-900'>
                            {application.gender}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Marital Status</span>
                          <span className='text-sm text-gray-900'>
                            {application.maritalStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  {(applicationData?.userInfo?.socialMediaLinks?.length > 0 ||
                    applicationData?.userInfo?.linkedinUrl ||
                    applicationData?.userInfo?.portfolioUrl) && (
                    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                      <h3 className='font-semibold text-gray-900 mb-4'>
                        Social Media & Links
                      </h3>
                      <div className='flex items-center gap-3 flex-wrap'>
                        {Array.isArray(
                          applicationData?.userInfo?.socialMediaLinks,
                        ) &&
                          applicationData.userInfo.socialMediaLinks.map(
                            (link: any, index: number) => (
                              <a
                                key={index}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200'
                                title={
                                  link.platform?.charAt(0).toUpperCase() +
                                  link.platform?.slice(1)
                                }
                              >
                                {getSocialMediaIcon(link.platform)}
                                <span className='text-sm'>{link.platform}</span>
                              </a>
                            ),
                          )}

                        {applicationData?.userInfo?.linkedinUrl && (
                          <a
                            href={applicationData.userInfo.linkedinUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-all duration-200'
                          >
                            {getSocialMediaIcon('linkedin')}
                            <span className='text-sm'>LinkedIn</span>
                          </a>
                        )}

                        {applicationData?.userInfo?.portfolioUrl && (
                          <a
                            href={applicationData.userInfo.portfolioUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-all duration-200'
                          >
                            {getSocialMediaIcon('portfolio')}
                            <span className='text-sm'>Portfolio</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - CV Features */}
                <div className='w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto'>
                  {/* Right Tab Navigation */}
                  <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10'>
                    <div className='flex gap-1'>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeRightTab === 'summary'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveRightTab('summary')}
                      >
                        Summary
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeRightTab === 'skills'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveRightTab('skills')}
                      >
                        Skills
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeRightTab === 'analysis'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveRightTab('analysis')}
                      >
                        Analysis
                      </button>
                    </div>
                  </div>

                  <div className='p-6'>
                    {activeRightTab === 'summary' && (
                      <div className='space-y-6'>
                        {/* Skills Analysis Card */}
                        <ApplicationSkillsCard
                          applicationData={applicationData}
                          onAnalysisComplete={(analysis) =>
                            setSkillsAnalysis(analysis)
                          }
                          className='shadow-sm'
                        />
                        {/* Quick Stats */}
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                          <h4 className='font-semibold text-gray-900 mb-3'>
                            Quick Overview
                          </h4>
                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <span className='text-sm text-gray-600'>
                                Experience
                              </span>
                              <span className='font-medium text-gray-900'>
                                {cvSummary?.experience || 0} years
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-sm text-gray-600'>
                                Skills Count
                              </span>
                              <span className='font-medium text-gray-900'>
                                {cvSummary?.skills?.length || 0}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-sm text-gray-600'>
                                Education
                              </span>
                              <span className='font-medium text-gray-900 text-xs'>
                                {cvSummary?.education}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Key Strengths */}
                        {cvSummary?.strengths?.length > 0 && (
                          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                              Key Strengths
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {cvSummary.strengths.map(
                                (strength: string, index: number) => (
                                  <span
                                    key={index}
                                    className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium'
                                  >
                                    {strength}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Industries */}
                        {cvSummary?.industries?.length > 0 && (
                          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                              Industries
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {cvSummary.industries.map(
                                (industry: string, index: number) => (
                                  <span
                                    key={index}
                                    className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium'
                                  >
                                    {industry}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeRightTab === 'skills' && (
                      <div className='space-y-6'>
                        {/* Technical Skills */}
                        {applicationData?.userInfo?.technicalSkills?.length >
                          0 && (
                          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                              Technical Skills
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {applicationData.userInfo.technicalSkills.map(
                                (skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium'
                                  >
                                    {skill}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Soft Skills */}
                        {applicationData?.userInfo?.softSkills?.length > 0 && (
                          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                              Soft Skills
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {applicationData.userInfo.softSkills.map(
                                (skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium'
                                  >
                                    {skill}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* All Skills Combined */}
                        {cvSummary?.skills?.length > 0 && (
                          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                              All Skills ({cvSummary.skills.length})
                            </h4>
                            <div className='max-h-60 overflow-y-auto'>
                              <div className='flex flex-wrap gap-2'>
                                {cvSummary.skills.map(
                                  (skill: string, index: number) => (
                                    <span
                                      key={index}
                                      className='bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs'
                                    >
                                      {skill}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeRightTab === 'analysis' && (
                      <div className='space-y-6'>
                        {/* Skills Analysis Card */}
                        <ApplicationSkillsCard
                          applicationData={applicationData}
                          onAnalysisComplete={(analysis) =>
                            setSkillsAnalysis(analysis)
                          }
                          className='shadow-sm'
                        />

                        {/* Skills Analysis Results */}
                        {skillsAnalysis && (
                          <div className='space-y-4'>
                            {/* Overall Match */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                              <h4 className='font-semibold text-gray-900 mb-3'>
                                Overall Match
                              </h4>
                              <div className='flex items-center gap-3'>
                                <div className='flex-1 bg-gray-200 rounded-full h-3'>
                                  <div
                                    className={`h-3 rounded-full ${
                                      skillsAnalysis.overallMatchPercentage >=
                                      80
                                        ? 'bg-green-500'
                                        : skillsAnalysis.overallMatchPercentage >=
                                            60
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${skillsAnalysis.overallMatchPercentage}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className='font-bold text-lg'>
                                  {skillsAnalysis.overallMatchPercentage}%
                                </span>
                              </div>
                            </div>

                            {/* Matched Skills */}
                            {skillsAnalysis.matchedSkills?.length > 0 && (
                              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                                <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                  <CheckCircleIcon className='w-4 h-4 text-green-600' />
                                  Matched Skills (
                                  {skillsAnalysis.matchedSkills.length})
                                </h4>
                                <div className='flex flex-wrap gap-2'>
                                  {skillsAnalysis.matchedSkills.map(
                                    (skill: string, index: number) => (
                                      <span
                                        key={index}
                                        className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Missing Skills */}
                            {skillsAnalysis.missingSkills?.length > 0 && (
                              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                                <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                  <ExclamationTriangleIcon className='w-4 h-4 text-orange-600' />
                                  Missing Skills (
                                  {skillsAnalysis.missingSkills.length})
                                </h4>
                                <div className='space-y-2'>
                                  {skillsAnalysis.missingSkills.map(
                                    (gap: any, index: number) => (
                                      <div
                                        key={index}
                                        className='flex items-center justify-between'
                                      >
                                        <span className='text-sm text-gray-700'>
                                          {gap.skill}
                                        </span>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            gap.importance === 'high'
                                              ? 'bg-red-100 text-red-800'
                                              : gap.importance === 'medium'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                          }`}
                                        >
                                          {gap.importance}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Recommendations */}
                            {skillsAnalysis.recommendations?.length > 0 && (
                              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-200'>
                                <h4 className='font-semibold text-gray-900 mb-3'>
                                  Recommendations
                                </h4>
                                <ul className='space-y-2'>
                                  {skillsAnalysis.recommendations.map(
                                    (rec: string, index: number) => (
                                      <li
                                        key={index}
                                        className='text-sm text-gray-700 flex items-start gap-2'
                                      >
                                        <span className='text-blue-600 mt-1'>
                                          •
                                        </span>
                                        {rec}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='h-full flex flex-col px-8 py-6'>
                <div className='flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-xl p-6 space-y-4 min-h-0'>
                  {messages.map((msg, idx) => {
                    const isEmployerMessage =
                      msg.tenantId === employer?.tenantId;
                    const messageDate = new Date(msg.createdAt);
                    const isToday =
                      new Date().toDateString() === messageDate.toDateString();
                    const timeString = isToday
                      ? messageDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : messageDate.toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        }) +
                        ' ' +
                        messageDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                    // Check if we should show date separator
                    const showDateSeparator =
                      idx === 0 ||
                      (idx > 0 &&
                        new Date(messages[idx - 1].createdAt).toDateString() !==
                          messageDate.toDateString());

                    return (
                      <div key={msg.id}>
                        {/* Date separator */}
                        {showDateSeparator && (
                          <div className='flex justify-center my-4'>
                            <div className='bg-white px-3 py-1 rounded-full text-xs text-gray-500 border'>
                              {isToday
                                ? 'Today'
                                : messageDate.toLocaleDateString([], {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                            </div>
                          </div>
                        )}

                        {/* Message */}
                        <div
                          className={`flex ${isEmployerMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md flex ${isEmployerMessage ? 'order-2 flex-row-reverse' : 'order-1'}`}
                          >
                            {/* Avatar for non-employer messages */}
                            {!isEmployerMessage && (
                              <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 mr-2 flex-shrink-0'>
                                {msg.senderFullName
                                  ? msg.senderFullName[0].toUpperCase()
                                  : 'U'}
                              </div>
                            )}

                            <div
                              className={`flex-1 ${isEmployerMessage ? 'text-right' : ''}`}
                            >
                              {/* Sender name for non-employer messages */}
                              {!isEmployerMessage && (
                                <div className='text-xs text-gray-600 mb-1 font-medium'>
                                  {msg.senderFullName}
                                </div>
                              )}

                              {/* Message bubble */}
                              <div
                                className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                  isEmployerMessage
                                    ? 'bg-blue-600 text-white rounded-br-md'
                                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                                }`}
                              >
                                <div className='whitespace-pre-wrap break-words'>
                                  {msg.content}
                                </div>
                              </div>

                              {/* Timestamp */}
                              <div
                                className={`text-xs text-gray-500 mt-1 ${isEmployerMessage ? 'text-right' : ''}`}
                              >
                                {timeString}
                                {msg.updatedAt !== msg.createdAt && (
                                  <span className='ml-1 italic'>(edited)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty state */}
                  {messages.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                      <EnvelopeIcon className='w-12 h-12 mb-2 opacity-50' />
                      <p className='text-sm'>No messages yet</p>
                      <p className='text-xs'>
                        Start a conversation with the candidate
                      </p>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm'>
                  <div className='flex gap-3'>
                    <input
                      type='text'
                      className='flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                      placeholder='Type your message...'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button
                      className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md'
                      onClick={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      disabled={!input.trim()}
                    >
                      <EnvelopeIcon className='w-4 h-4' />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag Modal */}
      <TagModal
        isOpen={tagModal.open}
        onClose={() => setTagModal({ open: false, application: null })}
        application={tagModal.application}
        onSave={handleTagSave}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />

      {/* Confirmation Modal for Shortlist/Reject */}
      {confirmationModal.open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative'>
            <button
              type='button'
              onClick={() =>
                setConfirmationModal({
                  open: false,
                  action: null,
                  notifyByEmail: false,
                })
              }
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
              disabled={isUpdatingStatus}
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
            <h2 className='text-lg font-semibold mb-4'>
              {confirmationModal.action === 'shortlist'
                ? 'Shortlist Candidate'
                : 'Reject Candidate'}
            </h2>
            <div className='mb-4'>
              <p>
                This action will{' '}
                {confirmationModal.action === 'shortlist'
                  ? 'shortlist'
                  : 'reject'}{' '}
                this candidate.
              </p>
              <label className='flex items-center gap-2 mt-4'>
                <input
                  type='checkbox'
                  checked={confirmationModal.notifyByEmail}
                  onChange={(e) =>
                    setConfirmationModal((prev) => ({
                      ...prev,
                      notifyByEmail: e.target.checked,
                    }))
                  }
                  disabled={isUpdatingStatus}
                />
                <span>Notify candidate by email</span>
              </label>
            </div>
            <div className='flex gap-2 mt-4'>
              <button
                className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleConfirmAction}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Processing...' : 'Confirm'}
              </button>
              <button
                className='flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium disabled:opacity-50'
                onClick={() =>
                  setConfirmationModal({
                    open: false,
                    action: null,
                    notifyByEmail: false,
                  })
                }
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Dialog */}
      <EmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        defaultTo={application.contact.email}
        defaultSubject={`Regarding your application for ${application.role}`}
        onSuccess={handleEmailSuccess}
        onError={handleEmailError}
      />
    </>
  );
}
