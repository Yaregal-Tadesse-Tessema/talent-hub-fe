import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import EmailDialog from './EmailDialog';
import { Button } from './Button';

export default function EmailDialogExample() {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
  });

  const handleEmailSuccess = () => {
    // You can add a toast notification here
    console.log('Email sent successfully');
    // Example: showToast('Email sent successfully', 'success');
  };

  const handleEmailError = (error: string) => {
    // You can add a toast notification here
    console.error('Email error:', error);
    // Example: showToast(error, 'error');
  };

  const openDialog = (title: string) => {
    setDialogConfig({ title });
    setShowEmailDialog(true);
  };

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Email Dialog Examples</h2>
      <p className='text-gray-600 mb-6'>
        Different use cases for the EmailDialog component.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        {/* Employee Templates */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-blue-900 mb-3'>
            Employee Templates
          </h3>
          <div className='space-y-2'>
            <Button
              onClick={() => openDialog('Employee Application Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              Application Related
            </Button>
            <Button
              onClick={() => openDialog('Employee Marketing Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              Marketing
            </Button>
          </div>
        </div>

        {/* Employer Templates */}
        <div className='bg-green-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-green-900 mb-3'>
            Employer Templates
          </h3>
          <div className='space-y-2'>
            <Button
              onClick={() => openDialog('Employer Application Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              Application Related
            </Button>
            <Button
              onClick={() => openDialog('Employer Support Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              Support
            </Button>
          </div>
        </div>

        {/* Admin Templates */}
        <div className='bg-red-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-red-900 mb-3'>Admin Templates</h3>
          <div className='space-y-2'>
            <Button
              onClick={() => openDialog('Admin Support Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              Support
            </Button>
            <Button
              onClick={() => openDialog('Admin System Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              System
            </Button>
          </div>
        </div>

        {/* Onboarding Templates */}
        <div className='bg-purple-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-purple-900 mb-3'>
            Onboarding Templates
          </h3>
          <div className='space-y-2'>
            <Button
              onClick={() => openDialog('Onboarding Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              All Users
            </Button>
            <Button
              onClick={() => openDialog('All Templates')}
              variant='outline'
              size='sm'
              className='w-full justify-start'
            >
              All Templates
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='font-semibold mb-2'>Usage Examples:</h3>
        <ul className='text-sm text-gray-600 space-y-1'>
          <li>
            • <strong>Employee Application:</strong> Send emails to job
            applicants with status updates
          </li>
          <li>
            • <strong>Employer Notifications:</strong> Notify employers about
            new applications
          </li>
          <li>
            • <strong>Admin Support:</strong> Handle support requests and system
            notifications
          </li>
          <li>
            • <strong>Onboarding:</strong> Welcome emails and account
            verification
          </li>
          <li>
            • <strong>Marketing:</strong> Newsletters and promotional content
          </li>
        </ul>
      </div>

      <EmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        defaultTo=''
        defaultSubject=''
        defaultHtml=''
        onSuccess={handleEmailSuccess}
        onError={handleEmailError}
      />
    </div>
  );
}
