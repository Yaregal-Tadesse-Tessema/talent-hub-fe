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

  useEmployerChange((employerData) => {
    setEmployer(employerData);
  });

  const handleSend = async () => {
    if (input.trim() && applicationId && employer) {
      try {
        const messageData: SendMessageRequest = {
          senderFullName: `${employer.firstName} ${employer.lastName}`,
          senderEmployerId: employer.id,
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

  if (!open) return null;
  return (
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
              <button className='flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg ml-2 hover:bg-blue-50 font-medium'>
                <EnvelopeIcon className='w-5 h-5' /> Send Mail
              </button>
              <button className='flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg ml-2 hover:bg-blue-700 font-medium'>
                <ArrowRightIcon className='w-5 h-5' /> Hire Candidates
              </button>
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
                  {application.socialLinks.map((link) => (
                    <a
                      key={link.type}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-400 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded p-2 transition'
                      title={
                        link.type.charAt(0).toUpperCase() + link.type.slice(1)
                      }
                    >
                      <GlobeAltIcon className='w-5 h-5' />
                    </a>
                  ))}
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
                {/* Download Resume */}
                <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-4'>
                  <div className='flex-1'>
                    <div className='text-xs text-gray-400 mb-1'>
                      Download My Resume
                    </div>
                    <div className='font-medium text-gray-700'>
                      {application.name}
                    </div>
                    <div className='text-xs text-gray-500'>PDF</div>
                  </div>
                  <a
                    href={application.resumeUrl}
                    download
                    className='p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100'
                  >
                    <ArrowDownTrayIcon className='w-6 h-6' />
                  </a>
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
            <div className='flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-4'>
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`mb-2 flex ${msg.senderId === 'employer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                      msg.senderId === 'employer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex gap-2'>
              <input
                type='text'
                className='flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                placeholder='Type your message...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium'
                onClick={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
