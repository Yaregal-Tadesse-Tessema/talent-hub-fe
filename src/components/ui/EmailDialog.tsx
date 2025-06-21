import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { emailService, EmailRequest } from '@/services/emailService';
import { Input } from './Input';
import { Button } from './Button';

interface EmailDialogProps {
  open: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultHtml?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function EmailDialog({
  open,
  onClose,
  defaultTo = '',
  defaultSubject = '',
  defaultHtml = '',
  onSuccess,
  onError,
}: EmailDialogProps) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
    ],
    content: defaultHtml,
    onUpdate: ({ editor }) => {
      // Handle content updates if needed
    },
  });

  useEffect(() => {
    if (open) {
      setTo(defaultTo);
      setSubject(defaultSubject);
      if (defaultHtml && editor) {
        editor.commands.setContent(defaultHtml);
      }
    }
  }, [open, defaultTo, defaultSubject, defaultHtml, editor]);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !editor?.getHTML()) {
      onError?.('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = editor.getHTML();

      const emailData: EmailRequest = {
        to: to.trim(),
        subject: subject.trim(),
        html: htmlContent,
      };

      const response = await emailService.sendEmail(emailData);

      if (response.success) {
        onSuccess?.();
        onClose();
        // Reset form
        setTo('');
        setSubject('');
        if (editor) {
          editor.commands.setContent('');
        }
      } else {
        onError?.(response.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      onError?.('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <EnvelopeIcon className='w-6 h-6 text-blue-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Send Email</h2>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Email Form */}
        <div className='flex flex-col h-[calc(90vh-80px)]'>
          <div className='p-6 flex-1 overflow-y-auto'>
            {/* Email Fields */}
            <div className='space-y-4 mb-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  To *
                </label>
                <Input
                  type='email'
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder='recipient@example.com'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subject *
                </label>
                <Input
                  type='text'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder='Email subject'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Content *
                </label>
                <div className='border border-gray-300 rounded-lg overflow-hidden'>
                  {/* Toolbar */}
                  <div className='bg-gray-50 border-b border-gray-300 p-2 flex gap-2'>
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                      title='Bold'
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                      title='Italic'
                    >
                      <em>I</em>
                    </button>
                    <div className='w-px bg-gray-300 mx-2'></div>
                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                      title='Bullet List'
                    >
                      •
                    </button>
                    <button
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      className={`p-2 rounded ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                      title='Numbered List'
                    >
                      1.
                    </button>
                  </div>

                  {/* Editor */}
                  <div className='min-h-[300px] max-h-[400px] overflow-y-auto'>
                    <EditorContent
                      editor={editor}
                      className='p-4 prose prose-sm max-w-none'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='border-t border-gray-200 p-6 bg-gray-50'>
            <div className='flex justify-end gap-3'>
              <Button variant='outline' onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={
                  isLoading ||
                  !to.trim() ||
                  !subject.trim() ||
                  !editor?.getHTML()
                }
                className='flex items-center gap-2'
              >
                {isLoading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className='w-4 h-4' />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
