import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  StarIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import {
  messageService,
  Message,
  SendMessageRequest,
} from '@/services/messageService';
import { applicationService, Application } from '@/services/applicationService';

export default function ApplicationDetailModal({
  open,
  onClose,
  applicationId,
  application,
}: {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  application: Application;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<Application | null>(
    null,
  );

  const handleSend = async () => {
    console.log('applicationData', applicationData);
    if (input.trim() && applicationId && user) {
      try {
        const messageData: SendMessageRequest = {
          senderFullName: `${user.firstName} ${user.lastName}`,
          senderUserId: user.id,
          receiverEmployerId: messages[0]?.senderEmployerId || '',
          content: input.trim(),
          applicationId: applicationId,
        };
        const newMessage = await messageService.sendMessage(messageData);
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    if (applicationId) {
      applicationService.getApplicationById(applicationId).then((res) => {
        setApplicationData(res);
      });
    }

    const fetchMessages = async () => {
      if (open && applicationId) {
        const fetchedMessages =
          await messageService.getMessagesByApplicationId(applicationId);
        console.log('fetchedMessages', fetchedMessages);
        setMessages(fetchedMessages);
      }
    };
    fetchMessages();
  }, [open, applicationId]);

  if (!open) return null;

  const jobPost = applicationData?.jobPost || application.jobPost;
  const userInfo = applicationData?.userInfo || application.userInfo;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 pb-10'>
      <div className='bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-2 relative p-8 max-h-[90vh] overflow-y-auto'>
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
            Application Details
          </button>
          {messages.length > 0 && (
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat with Employer
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
                <BuildingOfficeIcon className='w-8 h-8 text-blue-600' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-xl font-semibold text-gray-900 truncate'>
                  {jobPost?.title}
                </div>
                <div className='text-gray-500 text-sm truncate'>
                  {jobPost?.industry} • {jobPost?.position}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-500'>Application Status</div>
                <div
                  className={`font-semibold ${
                    application.status === 'SELECTED'
                      ? 'text-green-600'
                      : application.status === 'REJECTED'
                        ? 'text-red-600'
                        : application.status === 'HIRED'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                  }`}
                >
                  {application.status}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Job Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3'>
                  <BuildingOfficeIcon className='w-5 h-5 text-gray-400' />
                  <div>
                    <div className='text-sm text-gray-500'>Company</div>
                    <div className='font-medium'>
                      {jobPost?.industry || 'Not specified'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <BriefcaseIcon className='w-5 h-5 text-gray-400' />
                  <div>
                    <div className='text-sm text-gray-500'>Position</div>
                    <div className='font-medium'>
                      {jobPost?.position || 'Not specified'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <CalendarIcon className='w-5 h-5 text-gray-400' />
                  <div>
                    <div className='text-sm text-gray-500'>Applied Date</div>
                    <div className='font-medium'>
                      {new Date(
                        application.createdAt || jobPost?.createdAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <StarIcon className='w-5 h-5 text-gray-400' />
                  <div>
                    <div className='text-sm text-gray-500'>
                      Questionnaire Score
                    </div>
                    <div className='font-medium'>
                      {application.questionaryScore
                        ? `${application.questionaryScore}%`
                        : 'Not completed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Job Description
              </h3>
              <div
                className='text-gray-700 text-sm prose prose-sm max-w-none'
                dangerouslySetInnerHTML={{
                  __html: jobPost?.description || 'No description available',
                }}
              />
            </div>

            {/* Your Application */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                Your Application
              </h3>

              {/* Cover Letter */}
              <div className='mb-6'>
                <div className='font-medium mb-2 text-gray-700'>
                  Cover Letter
                </div>
                <div className='text-gray-700 text-sm whitespace-pre-line bg-white p-4 rounded border'>
                  {application.coverLetter || 'No cover letter provided'}
                </div>
              </div>

              {/* Resume Download */}
              {application.cv && (
                <div className='bg-white rounded-lg p-4 flex items-center gap-4 border'>
                  <div className='flex-1'>
                    <div className='text-sm text-gray-500 mb-1'>
                      Your Resume
                    </div>
                    <div className='font-medium text-gray-700'>
                      {application.cv.filename || 'Resume.pdf'}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {(application.cv.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <a
                    href={application.cv.path}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100'
                  >
                    <ArrowDownTrayIcon className='w-6 h-6' />
                  </a>
                </div>
              )}
            </div>

            {/* Application Notes */}
            {application.remark && (
              <div className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Employer Notes
                </h3>
                <div className='text-gray-700 text-sm whitespace-pre-line bg-white p-4 rounded border'>
                  {application.remark}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col h-[60vh]'>
            <div className='flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-4 space-y-3'>
              {messages.map((msg, idx) => {
                const isEmployeeMessage = msg.senderUserId === user?.id;
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

                const showDateSeparator =
                  idx === 0 ||
                  (idx > 0 &&
                    new Date(messages[idx - 1].createdAt).toDateString() !==
                      messageDate.toDateString());

                return (
                  <div key={msg.id}>
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

                    <div
                      className={`flex ${isEmployeeMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-end gap-2 ${isEmployeeMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                            isEmployeeMessage
                              ? 'bg-blue-300 text-blue-600'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isEmployeeMessage
                            ? user?.firstName
                              ? user.firstName[0].toUpperCase()
                              : 'U'
                            : msg.senderFullName
                              ? msg.senderFullName[0].toUpperCase()
                              : 'E'}
                        </div>

                        {/* Message content */}
                        <div className='max-w-xs lg:max-w-md'>
                          {!isEmployeeMessage && (
                            <div className='text-xs text-gray-600 mb-1 font-medium'>
                              {msg.senderFullName}
                            </div>
                          )}

                          <div
                            className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                              isEmployeeMessage
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                            }`}
                          >
                            <div className='whitespace-pre-wrap break-words'>
                              {msg.content}
                            </div>
                          </div>

                          <div
                            className={`text-xs text-gray-500 mt-1 ${isEmployeeMessage ? 'text-right' : 'text-left'}`}
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

              {messages.length === 0 && (
                <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                  <EnvelopeIcon className='w-12 h-12 mb-2 opacity-50' />
                  <p className='text-sm'>No messages yet</p>
                  <p className='text-xs'>
                    Start a conversation with the employer
                  </p>
                </div>
              )}
            </div>

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
  );
}
