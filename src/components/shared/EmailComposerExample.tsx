import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import EmailComposer, { EmailTemplate, EmailDraft } from './EmailComposer';

// Custom templates for this example
const customTemplates: EmailTemplate[] = [
  {
    id: 'job-application',
    name: 'Job Application Follow-up',
    subject: 'Follow-up on Job Application - [Position]',
    html: `
      <h2>Dear [Hiring Manager],</h2>
      <p>I hope this email finds you well. I wanted to follow up on my recent application for the [Position] role at [Company Name].</p>
      <p>I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your team's needs.</p>
      <p>Thank you for your time and consideration.</p>
      <p>Best regards,<br>[Your Name]</p>
    `,
    description: 'Professional follow-up for job applications',
  },
  {
    id: 'interview-thank-you',
    name: 'Interview Thank You',
    subject: 'Thank You - [Position] Interview',
    html: `
      <h2>Dear [Interviewer Name],</h2>
      <p>Thank you for taking the time to interview me today for the [Position] role. I enjoyed our conversation and learning more about [Company Name] and the team.</p>
      <p>I am very excited about the opportunity to contribute to [specific project/team mentioned] and believe my background in [relevant experience] would be valuable to your organization.</p>
      <p>I look forward to hearing from you regarding next steps.</p>
      <p>Best regards,<br>[Your Name]</p>
    `,
    description: 'Thank you note after job interviews',
  },
  {
    id: 'networking',
    name: 'Networking Email',
    subject: 'Connecting - [Your Name] from [Company/School]',
    html: `
      <h2>Hi [Name],</h2>
      <p>I hope you're doing well. I came across your profile and was impressed by your work in [specific area/company].</p>
      <p>I'm currently [your current situation] and would love to connect and learn more about your experience in [industry/field].</p>
      <p>Would you be available for a brief conversation in the coming weeks?</p>
      <p>Thank you for your time!</p>
      <p>Best regards,<br>[Your Name]</p>
    `,
    description: 'Professional networking outreach',
  },
];

export default function EmailComposerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailType, setEmailType] = useState<'simple' | 'full' | 'template'>(
    'simple',
  );

  // Example draft storage (in a real app, this would be in localStorage or a database)
  const [savedDraft, setSavedDraft] = useState<EmailDraft | null>(null);

  const handleSaveDraft = (draft: EmailDraft) => {
    setSavedDraft(draft);
    console.log('Draft saved:', draft);
  };

  const handleLoadDraft = () => {
    return savedDraft;
  };

  const handleSuccess = (response: any) => {
    console.log('Email sent successfully:', response);
  };

  const handleError = (error: string) => {
    console.error('Email error:', error);
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    console.log('Template selected:', template);
  };

  const renderEmailComposer = () => {
    switch (emailType) {
      case 'simple':
        return (
          <EmailComposer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            defaultTo='recipient@example.com'
            defaultSubject='Simple Email'
            showFrom={false}
            showCc={false}
            showBcc={false}
            showTemplates={false}
            showDraftActions={false}
            title='Simple Email Composer'
            onSuccess={handleSuccess}
            onError={handleError}
          />
        );

      case 'full':
        return (
          <EmailComposer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            defaultFrom='sender@example.com'
            defaultTo='recipient@example.com'
            defaultCc='cc@example.com'
            defaultBcc='bcc@example.com'
            defaultSubject='Full Featured Email'
            showFrom={true}
            showCc={true}
            showBcc={true}
            showTemplates={true}
            showDraftActions={true}
            templates={customTemplates}
            title='Full Featured Email Composer'
            onSuccess={handleSuccess}
            onError={handleError}
            onSaveDraft={handleSaveDraft}
            onLoadDraft={handleLoadDraft}
            onTemplateSelect={handleTemplateSelect}
          />
        );

      case 'template':
        return (
          <EmailComposer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            defaultTemplate='job-application'
            templates={customTemplates}
            showFrom={true}
            showCc={false}
            showBcc={false}
            showTemplates={true}
            showDraftActions={true}
            title='Template-Based Email Composer'
            onSuccess={handleSuccess}
            onError={handleError}
            onSaveDraft={handleSaveDraft}
            onLoadDraft={handleLoadDraft}
            onTemplateSelect={handleTemplateSelect}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Email Composer Examples
        </h1>
        <p className='text-gray-600 mb-6'>
          This demonstrates different configurations of the EmailComposer
          component
        </p>
      </div>

      {/* Email Type Selector */}
      <div className='flex justify-center gap-4 mb-8'>
        <Button
          variant={emailType === 'simple' ? 'primary' : 'outline'}
          onClick={() => setEmailType('simple')}
        >
          Simple Email
        </Button>
        <Button
          variant={emailType === 'full' ? 'primary' : 'outline'}
          onClick={() => setEmailType('full')}
        >
          Full Featured
        </Button>
        <Button
          variant={emailType === 'template' ? 'primary' : 'outline'}
          onClick={() => setEmailType('template')}
        >
          Template Based
        </Button>
      </div>

      {/* Description */}
      <div className='max-w-2xl mx-auto text-center'>
        {emailType === 'simple' && (
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-blue-900 mb-2'>
              Simple Email Composer
            </h3>
            <p className='text-blue-700 text-sm'>
              Basic email composer with minimal fields - just To, Subject, and
              Content. Perfect for quick emails without advanced features.
            </p>
          </div>
        )}

        {emailType === 'full' && (
          <div className='bg-green-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-green-900 mb-2'>
              Full Featured Email Composer
            </h3>
            <p className='text-green-700 text-sm'>
              Complete email composer with all features: From, To, CC, BCC,
              templates, draft saving, and rich text editing. Ideal for
              professional email composition.
            </p>
          </div>
        )}

        {emailType === 'template' && (
          <div className='bg-purple-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-purple-900 mb-2'>
              Template-Based Email Composer
            </h3>
            <p className='text-purple-700 text-sm'>
              Email composer focused on templates with pre-written content for
              common professional scenarios like job applications and
              networking.
            </p>
          </div>
        )}
      </div>

      {/* Open Email Composer Button */}
      <div className='text-center'>
        <Button onClick={() => setIsOpen(true)} className='px-8 py-3 text-lg'>
          Open Email Composer
        </Button>
      </div>

      {/* Saved Draft Display */}
      {savedDraft && (
        <div className='max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-gray-900 mb-2'>Saved Draft</h3>
          <div className='text-sm text-gray-600 space-y-1'>
            <p>
              <strong>From:</strong> {savedDraft.from}
            </p>
            <p>
              <strong>To:</strong> {savedDraft.to.join(', ')}
            </p>
            <p>
              <strong>Subject:</strong> {savedDraft.subject}
            </p>
            <p>
              <strong>Saved:</strong>{' '}
              {new Date(savedDraft.timestamp).toLocaleString()}
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setSavedDraft(null)}
            className='mt-2'
          >
            Clear Draft
          </Button>
        </div>
      )}

      {/* Render the Email Composer */}
      {renderEmailComposer()}
    </div>
  );
}
