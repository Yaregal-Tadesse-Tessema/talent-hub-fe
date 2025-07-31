import React, { useState } from 'react';
import { Application } from '@/services/applicationService';
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import EmailComposer, {
  EmailTemplate,
} from '@/components/shared/EmailComposer';

interface ListViewProps {
  applications: Record<string, Application>;
  filteredAppIds: string[];
  selectedRows: string[];
  toggleSelectRow: (id: string) => void;
  allSelected: boolean;
  isIndeterminate: boolean;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSelectedApplicationId: (id: string) => void;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  columns?: { id: string; title: string; appIds: string[] }[];
  onRemarkAction?: (appId: string) => void;
  onTagAction?: (appId: string) => void;
}

// Job application specific email templates
const jobApplicationTemplates: EmailTemplate[] = [
  {
    id: 'application-received',
    name: 'Application Received',
    subject: 'Application Received - [Position] at [Company]',
    html: `
      <h2>Dear [Candidate Name],</h2>
      <p>Thank you for your interest in the [Position] role at [Company]. We have received your application and are currently reviewing it.</p>
      <p>We will be in touch within the next few days to let you know about the next steps in our hiring process.</p>
      <p>If you have any questions in the meantime, please don't hesitate to reach out.</p>
      <p>Best regards,<br>[Your Name]<br>[Your Title]<br>[Company Name]</p>
    `,
    description: 'Confirmation email for received applications',
  },
  {
    id: 'interview-invitation',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - [Position] at [Company]',
    html: `
      <h2>Dear [Candidate Name],</h2>
      <p>We are pleased to invite you for an interview for the [Position] role at [Company].</p>
      <p><strong>Interview Details:</strong></p>
      <ul>
        <li><strong>Date:</strong> [Interview Date]</li>
        <li><strong>Time:</strong> [Interview Time]</li>
        <li><strong>Location:</strong> [Interview Location/Platform]</li>
        <li><strong>Duration:</strong> [Duration]</li>
      </ul>
      <p>Please confirm your availability by replying to this email. If you need to reschedule, please let us know at least 24 hours in advance.</p>
      <p>We look forward to meeting you!</p>
      <p>Best regards,<br>[Your Name]<br>[Your Title]<br>[Company Name]</p>
    `,
    description: 'Formal interview invitation',
  },
  {
    id: 'application-status-update',
    name: 'Application Status Update',
    subject: 'Application Status Update - [Position]',
    html: `
      <h2>Dear [Candidate Name],</h2>
      <p>We wanted to provide you with an update regarding your application for the [Position] role at [Company].</p>
      <p><strong>Current Status:</strong> [Status Update]</p>
      <p>[Additional details about the status or next steps]</p>
      <p>We appreciate your patience throughout this process and will continue to keep you informed of any developments.</p>
      <p>If you have any questions, please don't hesitate to reach out.</p>
      <p>Best regards,<br>[Your Name]<br>[Your Title]<br>[Company Name]</p>
    `,
    description: 'Status update for applications',
  },
  {
    id: 'rejection-letter',
    name: 'Rejection Letter',
    subject: 'Application Update - [Position] at [Company]',
    html: `
      <h2>Dear [Candidate Name],</h2>
      <p>Thank you for your interest in the [Position] role at [Company] and for taking the time to apply and interview with us.</p>
      <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
      <p>We were impressed by your background and experience, and we encourage you to apply for future opportunities that may be a better fit for your skills and career goals.</p>
      <p>We wish you the best in your job search and future endeavors.</p>
      <p>Best regards,<br>[Your Name]<br>[Your Title]<br>[Company Name]</p>
    `,
    description: 'Professional rejection letter',
  },
  {
    id: 'job-offer',
    name: 'Job Offer',
    subject: 'Job Offer - [Position] at [Company]',
    html: `
      <h2>Dear [Candidate Name],</h2>
      <p>We are delighted to offer you the position of [Position] at [Company]. We were very impressed with your qualifications and believe you will be a valuable addition to our team.</p>
      <p><strong>Offer Details:</strong></p>
      <ul>
        <li><strong>Position:</strong> [Position]</li>
        <li><strong>Start Date:</strong> [Start Date]</li>
        <li><strong>Salary:</strong> [Salary Details]</li>
        <li><strong>Benefits:</strong> [Benefits Overview]</li>
      </ul>
      <p>Please review the attached offer letter for complete details. We would appreciate your response within [Response Timeframe].</p>
      <p>We are excited about the possibility of you joining our team and look forward to hearing from you.</p>
      <p>Best regards,<br>[Your Name]<br>[Your Title]<br>[Company Name]</p>
    `,
    description: 'Job offer letter',
  },
];

const ListView: React.FC<ListViewProps> = ({
  applications,
  filteredAppIds,
  selectedRows,
  toggleSelectRow,
  allSelected,
  isIndeterminate,
  toggleSelectAll,
  clearSelection,
  setSelectedApplicationId,
  openActionMenu,
  setOpenActionMenu,
  columns = [
    { id: 'PENDING', title: 'Pending', appIds: [] },
    { id: 'SELECTED', title: 'Selected', appIds: [] },
    { id: 'REJECTED', title: 'Rejected', appIds: [] },
    { id: 'HIRED', title: 'Hired', appIds: [] },
  ],
  onRemarkAction,
  onTagAction,
}) => {
  // Email composer state
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [selectedApplicationForEmail, setSelectedApplicationForEmail] =
    useState<Application | null>(null);

  function getAppStatus(appId: string) {
    const col = columns.find((c) => c.appIds.includes(appId));
    return col
      ? { id: col.id, title: col.title }
      : { id: 'all', title: 'All Applications' };
  }

  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'SELECTED':
        return 'bg-blue-100 text-blue-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'HIRED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  // Handle email action
  const handleEmailAction = (appId: string) => {
    const application = applications[appId];
    if (application) {
      setSelectedApplicationForEmail(application);
      setEmailComposerOpen(true);
      setOpenActionMenu(null);
    }
  };

  // Handle email success
  const handleEmailSuccess = (response: any) => {
    console.log('Email sent successfully:', response);
    // You can add additional logic here like updating application status
  };

  // Handle email error
  const handleEmailError = (error: string) => {
    console.error('Email error:', error);
  };

  // Get default email content based on application status
  const getDefaultEmailContent = (application: Application) => {
    const candidateName = `${application.userInfo?.firstName} ${application.userInfo?.lastName}`;
    const position = application.jobPost?.position || '[Position]';
    const company = '[Company]'; // JobPost doesn't have company property, using placeholder

    return {
      to: application.userInfo?.email || '',
      subject: `Application Update - ${position} at ${company}`,
      html: `
        <h2>Dear ${candidateName},</h2>
        <p>Thank you for your interest in the ${position} role at ${company}.</p>
        <p>We are currently reviewing your application and will be in touch soon with next steps.</p>
        <p>Best regards,<br>[Your Name]<br>[Your Title]<br>${company}</p>
      `,
    };
  };

  return (
    <>
      <div className='bg-white rounded-lg shadow p-4'>
        {/* Bulk actions bar is handled outside */}
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-gray-400 text-left'>
              <th className='py-2 px-4'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className='py-2 px-4'>Name</th>
              <th className='py-2 px-4'>Role</th>
              <th className='py-2 px-4'>Experience</th>
              <th className='py-2 px-4'>Education</th>
              <th className='py-2 px-4'>Applied</th>
              <th className='py-2 px-4'>Status</th>
              <th className='py-2 px-4'>Tags</th>
              <th className='py-2 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppIds.map((appId) => {
              const app = applications[appId];
              const status = getAppStatus(appId);
              return (
                <tr
                  key={appId}
                  className='border-t hover:bg-blue-50 cursor-pointer'
                  onClick={() => setSelectedApplicationId(appId)}
                >
                  <td
                    className='py-3 px-4'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type='checkbox'
                      checked={selectedRows.includes(appId)}
                      onChange={() => toggleSelectRow(appId)}
                    />
                  </td>
                  <td className='py-3 px-4 font-medium'>
                    {app.userInfo?.firstName} {app.userInfo?.lastName}
                  </td>
                  <td className='py-3 px-4'>{app.jobPost?.position}</td>
                  <td className='py-3 px-4'>
                    {app.userInfo?.yearOfExperience || 'N/A'} years
                  </td>
                  <td className='py-3 px-4'>
                    {app.userInfo?.highestLevelOfEducation || 'N/A'}
                  </td>
                  <td className='py-3 px-4'>
                    {new Date(app.userInfo?.createdAt)?.toLocaleDateString()}
                  </td>
                  <td className='py-3 px-4'>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-default ${getStatusColor(app.status)}`}
                      title={app?.status}
                    >
                      {app?.status}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <div className='flex flex-wrap gap-1'>
                      {app.tags && app.tags.length > 0 ? (
                        app.tags.map((tag) => (
                          <span
                            key={tag}
                            className='inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-400 text-xs'>No tags</span>
                      )}
                    </div>
                  </td>
                  <td
                    className='py-3 px-4 relative'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-200'
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenu(
                          openActionMenu === appId ? null : appId,
                        );
                      }}
                      aria-label='Open actions menu'
                      type='button'
                    >
                      <EllipsisVerticalIcon className='w-5 h-5' />
                    </button>
                    {openActionMenu === appId && (
                      <div className='absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10 dropdown-menu'>
                        <button
                          className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                          onClick={() => {
                            setSelectedApplicationId(appId);
                            setOpenActionMenu(null);
                          }}
                        >
                          <PencilSquareIcon className='w-5 h-5 text-blue-500' />{' '}
                          View Details
                        </button>
                        <button
                          className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                          onClick={() => {
                            handleEmailAction(appId);
                          }}
                        >
                          <EnvelopeIcon className='w-5 h-5 text-green-500' />{' '}
                          Send Email
                        </button>
                        <button
                          className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                          onClick={() => {
                            onRemarkAction?.(appId);
                            setOpenActionMenu(null);
                          }}
                        >
                          <ChatBubbleLeftRightIcon className='w-5 h-5 text-purple-500' />{' '}
                          Add Remark
                        </button>
                        <button
                          className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                          onClick={() => {
                            onTagAction?.(appId);
                            setOpenActionMenu(null);
                          }}
                        >
                          <TagIcon className='w-5 h-5 text-orange-500' />{' '}
                          Add/Edit Tags
                        </button>
                        <button
                          className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                          onClick={() => {
                            /* TODO: Download CV logic */
                            setOpenActionMenu(null);
                          }}
                        >
                          <ArrowDownTrayIcon className='w-5 h-5 text-indigo-500' />{' '}
                          Download CV
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Email Composer Modal */}
      {selectedApplicationForEmail && (
        <EmailComposer
          open={emailComposerOpen}
          onClose={() => {
            setEmailComposerOpen(false);
            setSelectedApplicationForEmail(null);
          }}
          defaultTo={selectedApplicationForEmail.userInfo?.email || ''}
          defaultSubject={`Application Update - ${selectedApplicationForEmail.jobPost?.position || '[Position]'}`}
          defaultHtml={getDefaultEmailContent(selectedApplicationForEmail).html}
          templates={jobApplicationTemplates}
          showFrom={true}
          showCc={true}
          showBcc={true}
          showTemplates={true}
          showDraftActions={true}
          title={`Send Email to ${selectedApplicationForEmail.userInfo?.firstName} ${selectedApplicationForEmail.userInfo?.lastName}`}
          onSuccess={handleEmailSuccess}
          onError={handleEmailError}
        />
      )}
    </>
  );
};

export default ListView;
