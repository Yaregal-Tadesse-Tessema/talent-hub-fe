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
} from '@heroicons/react/24/outline';
import {
  messageService,
  Message,
  SendMessageRequest,
} from '@/services/messageService';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import { applicationService } from '@/services/applicationService';
import EmailDialog from '@/components/ui/EmailDialog';

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
}: {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  application: ApplicationDetail;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [employer, setEmployer] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  useEmployerChange((employerData) => {
    setEmployer(employerData);
  });

  const handleSend = async () => {
    console.log('employer', employer);
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
        console.error('Error sending message:', error);
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
        setApplicationData(res);
        console.log('applicationData', applicationData);
      });
    }
    const fetchMessages = async () => {
      if (open && applicationId) {
        const fetchedMessages =
          await messageService.getMessagesByApplicationId(applicationId);
        setMessages(fetchedMessages);
        console.log('fetchedMessages', fetchedMessages);
      }
    };
    fetchMessages();
  }, [open, applicationId]);

  const handleEmailSuccess = () => {
    // You can add a toast notification here
    console.log('Email sent successfully');
  };

  const handleEmailError = (error: string) => {
    // You can add a toast notification here
    console.error('Email error:', error);
  };

  if (!open) return null;
  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 pb-10'>
        <div className='bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-2 relative p-8 max-h-[90vh] overflow-y-auto'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          >
            <XMarkIcon className='w-7 h-7' />
          </button>

          {/* Tab Switcher */}
          <div className='flex gap-4 mb-6 border-b border-gray-200'>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <>
              {/* Header */}
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500'>
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
                <div className='flex-1 min-w-0'>
                  <div className='text-xl font-semibold text-gray-900 truncate'>
                    {application.name}
                  </div>
                  <div className='text-gray-500 text-sm truncate'>
                    {application.role}
                  </div>
                </div>
                <button className='p-2 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-200'>
                  <StarIcon className='w-6 h-6' />
                </button>
                <button
                  className='flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg ml-2 hover:bg-blue-50 font-medium'
                  onClick={() => setShowEmailDialog(true)}
                >
                  <EnvelopeIcon className='w-5 h-5' /> Send Mail
                </button>
                <button className='flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg ml-2 hover:bg-blue-700 font-medium'>
                  <ArrowRightIcon className='w-5 h-5' /> Hire Candidates
                </button>
              </div>

              {/* Download Resume - Primary Action */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-4'>
                <div className='flex-1'>
                  <div className='text-sm font-semibold text-blue-900 mb-1'>
                    Download Resume
                  </div>
                  <div className='text-sm text-blue-700'>
                    {application.name} - {application.role}
                  </div>
                  <div className='text-xs text-blue-600'>PDF Document</div>
                </div>
                <a
                  href={application.resumeUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors'
                >
                  <ArrowDownTrayIcon className='w-5 h-5' />
                  Download
                </a>
              </div>

              {/* Left: Main Info */}
              <div className='flex flex-col md:flex-row'>
                <div className='flex-1 min-w-0 md:pr-8'>
                  {/* Biography */}
                  <div className='mb-6'>
                    <div className='font-semibold mb-1'>BIOGRAPHY</div>
                    <div className='text-gray-700 text-sm whitespace-pre-line'>
                      {application.biography}
                    </div>
                  </div>
                  {/* Cover Letter */}
                  <div className='mb-6'>
                    <div className='font-semibold mb-1'>COVER LETTER</div>
                    <div className='text-gray-700 text-sm whitespace-pre-line'>
                      {application.coverLetter}
                    </div>
                  </div>
                  {/* Social Links */}
                  <div className='flex items-center gap-2 mt-4'>
                    <span className='text-xs text-gray-400'>
                      Follow me Social Media
                    </span>
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
                            className='text-gray-400 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded p-2 transition'
                            title={
                              link.platform
                                ? link.platform.charAt(0).toUpperCase() +
                                  link.platform.slice(1)
                                : 'Social Media'
                            }
                          >
                            {getSocialMediaIcon(link.platform)}
                          </a>
                        ),
                      )}
                    {/* Fallback to individual social links if socialMediaLinks array is not available */}
                    {(!Array.isArray(
                      applicationData?.userInfo?.socialMediaLinks,
                    ) ||
                      !applicationData.userInfo.socialMediaLinks ||
                      applicationData.userInfo.socialMediaLinks.length ===
                        0) && (
                      <>
                        {applicationData?.userInfo?.linkedinUrl && (
                          <a
                            href={applicationData.userInfo.linkedinUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-400 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded p-2 transition'
                            title='LinkedIn'
                          >
                            {getSocialMediaIcon('linkedin')}
                          </a>
                        )}
                        {applicationData?.userInfo?.portfolioUrl && (
                          <a
                            href={applicationData.userInfo.portfolioUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-400 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded p-2 transition'
                            title='Portfolio'
                          >
                            {getSocialMediaIcon('portfolio')}
                          </a>
                        )}
                        {applicationData?.userInfo?.telegramUserId && (
                          <a
                            href={`https://t.me/${applicationData.userInfo.telegramUserId}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-400 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded p-2 transition'
                            title='Telegram'
                          >
                            {getSocialMediaIcon('telegram')}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Sidebar */}
                <div className='w-full md:w-80 mt-8 md:mt-0 flex flex-col gap-6'>
                  {/* Personal Info */}
                  <div className='bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-xs'>
                    <div>
                      <div className='text-gray-400'>DATE OF BIRTH</div>
                      <div className='font-medium text-gray-700'>
                        {application.dob}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>NATIONALITY</div>
                      <div className='font-medium text-gray-700'>
                        {application.nationality}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>MARITAL STATUS</div>
                      <div className='font-medium text-gray-700'>
                        {application.maritalStatus}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>GENDER</div>
                      <div className='font-medium text-gray-700'>
                        {application.gender}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>EXPERIENCE</div>
                      <div className='font-medium text-gray-700'>
                        {application.experience}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>EDUCATIONS</div>
                      <div className='font-medium text-gray-700'>
                        {application.education}
                      </div>
                    </div>
                  </div>
                  {/* Contact Info */}
                  <div className='bg-gray-50 rounded-lg p-4 flex flex-col gap-2 text-xs'>
                    <div className='font-semibold text-gray-700 mb-2'>
                      Contact Information
                    </div>
                    <div className='flex items-center gap-2'>
                      <GlobeAltIcon className='w-4 h-4' />{' '}
                      <span className='truncate'>
                        {application.contact.website}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPinIcon className='w-4 h-4' />{' '}
                      <span className='truncate'>
                        {application.contact.location}
                      </span>
                    </div>
                    <div className='text-gray-400 text-xs -mt-1 mb-1 truncate'>
                      {application.contact.address}
                    </div>
                    <div className='flex items-center gap-2'>
                      <PhoneIcon className='w-4 h-4' />{' '}
                      <span>{application.contact.phone}</span>
                    </div>
                    {application.contact.phone2 && (
                      <div className='flex items-center gap-2'>
                        <PhoneIcon className='w-4 h-4' />{' '}
                        <span>{application.contact.phone2}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <EnvelopeIcon className='w-4 h-4' />{' '}
                      <span className='truncate'>
                        {application.contact.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='flex flex-col h-[60vh]'>
              <div className='flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-4 space-y-3'>
                {messages.map((msg, idx) => {
                  const isEmployerMessage = msg.tenantId === employer?.tenantId;
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
              <div className='flex gap-2 bg-white border-t border-gray-200 p-4 rounded-b-lg'>
                <input
                  type='text'
                  className='flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300'
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
                  className='bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
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
          )}
        </div>
      </div>

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
