import React, { useState, useEffect, useCallback } from 'react';
import {
  XMarkIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Plus,
  Trash2,
  Type,
  Palette,
  Highlighter,
  EyeIcon,
  EyeOff,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { emailService, EmailRequest } from '@/services/emailService';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  description?: string;
}

export interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  // Email fields
  defaultFrom?: string;
  defaultTo?: string | string[];
  defaultCc?: string | string[];
  defaultBcc?: string | string[];
  defaultSubject?: string;
  defaultHtml?: string;
  defaultTemplate?: string;
  // Templates
  templates?: EmailTemplate[];
  onTemplateSelect?: (template: EmailTemplate) => void;
  // Callbacks
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  onSaveDraft?: (draft: EmailDraft) => void;
  onLoadDraft?: () => EmailDraft | null;
  // UI options
  showFrom?: boolean;
  showCc?: boolean;
  showBcc?: boolean;
  showTemplates?: boolean;
  showDraftActions?: boolean;
  maxHeight?: string;
  title?: string;
  // Validation
  requiredFields?: ('from' | 'to' | 'subject' | 'content')[];
}

export interface EmailDraft {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  timestamp: number;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Our Platform!',
    html: "<h2>Welcome!</h2><p>Thank you for joining our platform. We're excited to have you on board.</p><p>Best regards,<br>The Team</p>",
    description: 'A warm welcome message for new users',
  },
  {
    id: 'follow-up',
    name: 'Follow-up Email',
    subject: 'Following up on our conversation',
    html: '<h2>Follow-up</h2><p>I hope this email finds you well. I wanted to follow up on our recent conversation.</p><p>Looking forward to hearing from you.</p><p>Best regards,<br>[Your Name]</p>',
    description: 'Professional follow-up template',
  },
  {
    id: 'meeting-invitation',
    name: 'Meeting Invitation',
    subject: 'Meeting Invitation',
    html: '<h2>Meeting Invitation</h2><p>You are invited to attend a meeting on [Date] at [Time].</p><p><strong>Agenda:</strong><br>[Meeting agenda]</p><p>Please confirm your attendance.</p><p>Best regards,<br>[Your Name]</p>',
    description: 'Formal meeting invitation template',
  },
];

export default function EmailComposer({
  open,
  onClose,
  defaultFrom = '',
  defaultTo = '',
  defaultCc = '',
  defaultBcc = '',
  defaultSubject = '',
  defaultHtml = '',
  defaultTemplate = '',
  templates = defaultTemplates,
  onTemplateSelect,
  onSuccess,
  onError,
  onSaveDraft,
  onLoadDraft,
  showFrom = true,
  showCc = true,
  showBcc = true,
  showTemplates = true,
  showDraftActions = true,
  maxHeight = '90vh',
  title = 'Compose Email',
  requiredFields = ['to', 'subject', 'content'],
}: EmailComposerProps) {
  // Email fields state
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(
    Array.isArray(defaultTo) ? defaultTo : defaultTo ? [defaultTo] : [],
  );
  const [cc, setCc] = useState(
    Array.isArray(defaultCc) ? defaultCc : defaultCc ? [defaultCc] : [],
  );
  const [bcc, setBcc] = useState(
    Array.isArray(defaultBcc) ? defaultBcc : defaultBcc ? [defaultBcc] : [],
  );
  const [subject, setSubject] = useState(defaultSubject);
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showCcField, setShowCcField] = useState(false);
  const [showBccField, setShowBccField] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const { showToast } = useToast();

  // Helper function to convert array to comma-separated string
  const arrayToString = (arr: string[]) => arr.filter(Boolean).join(', ');

  // Helper function to convert comma-separated string to array
  const stringToArray = (str: string) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  // TipTap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: defaultHtml,
    onUpdate: ({ editor }) => {
      // Auto-save draft if callback provided
      if (onSaveDraft) {
        const draft: EmailDraft = {
          from,
          to,
          cc,
          bcc,
          subject,
          html: editor.getHTML(),
          timestamp: Date.now(),
        };
        onSaveDraft(draft);
      }
    },
  });

  // Load draft on mount if available
  useEffect(() => {
    if (onLoadDraft) {
      const draft = onLoadDraft();
      if (draft) {
        setFrom(draft.from);
        setTo(draft.to);
        setCc(draft.cc);
        setBcc(draft.bcc);
        setSubject(draft.subject);
        if (editor) {
          editor.commands.setContent(draft.html);
        }
      }
    }
  }, [onLoadDraft, editor]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFrom(defaultFrom);
      setTo(
        Array.isArray(defaultTo) ? defaultTo : defaultTo ? [defaultTo] : [],
      );
      setCc(
        Array.isArray(defaultCc) ? defaultCc : defaultCc ? [defaultCc] : [],
      );
      setBcc(
        Array.isArray(defaultBcc) ? defaultBcc : defaultBcc ? [defaultBcc] : [],
      );
      setSubject(defaultSubject);
      setSelectedTemplate(defaultTemplate);
      if (defaultHtml && editor) {
        editor.commands.setContent(defaultHtml);
      }
    }
  }, [
    open,
    defaultFrom,
    defaultTo,
    defaultCc,
    defaultBcc,
    defaultSubject,
    defaultHtml,
    defaultTemplate,
    editor,
  ]);

  // Apply template
  const applyTemplate = useCallback(
    (template: EmailTemplate) => {
      setSubject(template.subject);
      if (editor) {
        editor.commands.setContent(template.html);
      }
      setSelectedTemplate(template.id);
      onTemplateSelect?.(template);
      setShowTemplateSelector(false);
    },
    [editor, onTemplateSelect],
  );

  // Validation
  const validateForm = () => {
    const errors: string[] = [];

    if (requiredFields.includes('from') && !from.trim()) {
      errors.push('From field is required');
    }

    if (requiredFields.includes('to') && to.length === 0) {
      errors.push('To field is required');
    }

    if (requiredFields.includes('subject') && !subject.trim()) {
      errors.push('Subject is required');
    }

    if (requiredFields.includes('content') && !editor?.getHTML().trim()) {
      errors.push('Email content is required');
    }

    return errors;
  };

  // Send email
  const handleSend = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      onError?.(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
      });
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = editor?.getHTML() || '';

      const emailData: EmailRequest = {
        to: arrayToString(to),
        subject: subject.trim(),
        html: htmlContent,
        from: from.trim() || undefined,
        replyTo: from.trim() || undefined,
      };

      const response = await emailService.sendEmail(emailData);

      if (response.success) {
        onSuccess?.(response);
        onClose();
        // Reset form
        setFrom('');
        setTo([]);
        setCc([]);
        setBcc([]);
        setSubject('');
        if (editor) {
          editor.commands.setContent('');
        }
        showToast({
          type: 'success',
          message: 'Email sent successfully!',
        });
      } else {
        const errorMessage = response.error || 'Failed to send email';
        onError?.(errorMessage);
        showToast({
          type: 'error',
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = 'Failed to send email. Please try again.';
      onError?.(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Editor toolbar functions
  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const insertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addColumnBefore = () => editor?.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor?.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor?.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor?.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor?.chain().focus().addRowAfter().run();
  const deleteRow = () => editor?.chain().focus().deleteRow().run();
  const deleteTable = () => editor?.chain().focus().deleteTable().run();

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden`}
        style={{ maxHeight }}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <EnvelopeIcon className='w-6 h-6 text-blue-600' />
            <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
          </div>
          <div className='flex items-center gap-2'>
            {showDraftActions && onSaveDraft && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const draft: EmailDraft = {
                    from,
                    to,
                    cc,
                    bcc,
                    subject,
                    html: editor?.getHTML() || '',
                    timestamp: Date.now(),
                  };
                  onSaveDraft(draft);
                  showToast({
                    type: 'success',
                    message: 'Draft saved successfully!',
                  });
                }}
                className='flex items-center gap-2'
              >
                <DocumentDuplicateIcon className='w-4 h-4' />
                Save Draft
              </Button>
            )}
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Email Form */}
        <div
          className='flex flex-col'
          style={{ height: `calc(${maxHeight} - 80px)` }}
        >
          <div className='p-6 flex-1 overflow-y-auto'>
            {/* Template Selector */}
            {showTemplates && templates.length > 0 && (
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Email Templates
                  </label>
                  <button
                    onClick={() =>
                      setShowTemplateSelector(!showTemplateSelector)
                    }
                    className='text-sm text-blue-600 hover:text-blue-800'
                  >
                    {showTemplateSelector ? 'Hide Templates' : 'Show Templates'}
                  </button>
                </div>
                {showTemplateSelector && (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className='border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors'
                        onClick={() => applyTemplate(template)}
                      >
                        <h4 className='font-medium text-gray-900'>
                          {template.name}
                        </h4>
                        <p className='text-sm text-gray-600 mt-1'>
                          {template.description}
                        </p>
                        <p className='text-xs text-gray-500 mt-2'>
                          {template.subject}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Email Fields */}
            <div className='space-y-4 mb-6'>
              {/* From Field */}
              {showFrom && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From {requiredFields.includes('from') && '*'}
                  </label>
                  <Input
                    type='email'
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder='sender@example.com'
                    className='w-full'
                  />
                </div>
              )}

              {/* To Field */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  To {requiredFields.includes('to') && '*'}
                </label>
                <Input
                  type='text'
                  value={arrayToString(to)}
                  onChange={(e) => setTo(stringToArray(e.target.value))}
                  placeholder='recipient@example.com, another@example.com'
                  className='w-full'
                />
              </div>

              {/* CC Field */}
              {showCc && (
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      CC
                    </label>
                    <button
                      onClick={() => setShowCcField(!showCcField)}
                      className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                      {showCcField ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <EyeIcon className='w-4 h-4' />
                      )}
                      {showCcField ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showCcField && (
                    <Input
                      type='text'
                      value={arrayToString(cc)}
                      onChange={(e) => setCc(stringToArray(e.target.value))}
                      placeholder='cc@example.com, another@example.com'
                      className='w-full'
                    />
                  )}
                </div>
              )}

              {/* BCC Field */}
              {showBcc && (
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      BCC
                    </label>
                    <button
                      onClick={() => setShowBccField(!showBccField)}
                      className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                      {showBccField ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <EyeIcon className='w-4 h-4' />
                      )}
                      {showBccField ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showBccField && (
                    <Input
                      type='text'
                      value={arrayToString(bcc)}
                      onChange={(e) => setBcc(stringToArray(e.target.value))}
                      placeholder='bcc@example.com, another@example.com'
                      className='w-full'
                    />
                  )}
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subject {requiredFields.includes('subject') && '*'}
                </label>
                <Input
                  type='text'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder='Email subject'
                  className='w-full'
                />
              </div>

              {/* Content Field */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Content {requiredFields.includes('content') && '*'}
                </label>
                <div className='border border-gray-300 rounded-lg overflow-hidden'>
                  {/* Enhanced Toolbar */}
                  <div className='bg-gray-50 border-b border-gray-300 p-3'>
                    {/* Text Formatting Row */}
                    <div className='flex flex-wrap gap-1 mb-2'>
                      {/* Font Family */}
                      <div className='relative'>
                        <select
                          onChange={(e) =>
                            editor
                              ?.chain()
                              .focus()
                              .setFontFamily(e.target.value)
                              .run()
                          }
                          className='pl-8 pr-2 py-1 text-sm border border-gray-300 rounded bg-white appearance-none'
                        >
                          <option value=''>Font</option>
                          <option value='Arial'>Arial</option>
                          <option value='Times New Roman'>
                            Times New Roman
                          </option>
                          <option value='Courier New'>Courier New</option>
                          <option value='Georgia'>Georgia</option>
                          <option value='Verdana'>Verdana</option>
                        </select>
                        <Type className='w-4 h-4 absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500' />
                      </div>

                      {/* Text Color */}
                      <div className='relative'>
                        <input
                          type='color'
                          onInput={(e) =>
                            editor
                              ?.chain()
                              .focus()
                              .setColor((e.target as HTMLInputElement).value)
                              .run()
                          }
                          className='w-8 h-8 border border-gray-300 rounded cursor-pointer opacity-0 absolute inset-0'
                          title='Text Color'
                        />
                        <Palette className='w-8 h-8 border border-gray-300 rounded bg-white p-1 text-gray-500' />
                      </div>

                      {/* Highlight Color */}
                      <div className='relative'>
                        <input
                          type='color'
                          onInput={(e) =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleHighlight({
                                color: (e.target as HTMLInputElement).value,
                              })
                              .run()
                          }
                          className='w-8 h-8 border border-gray-300 rounded cursor-pointer opacity-0 absolute inset-0'
                          title='Highlight Color'
                        />
                        <Highlighter className='w-8 h-8 border border-gray-300 rounded bg-white p-1 text-gray-500' />
                      </div>

                      <div className='w-px bg-gray-300 mx-1'></div>

                      {/* Bold, Italic, Underline, Strikethrough */}
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                        className={`p-2 rounded text-sm font-bold ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Bold'
                      >
                        <Bold className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                        className={`p-2 rounded text-sm italic ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Italic'
                      >
                        <Italic className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleUnderline().run()
                        }
                        className={`p-2 rounded text-sm underline ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Underline'
                      >
                        <UnderlineIcon className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleStrike().run()
                        }
                        className={`p-2 rounded text-sm line-through ${editor?.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Strikethrough'
                      >
                        <Strikethrough className='w-4 h-4' />
                      </button>

                      <div className='w-px bg-gray-300 mx-1'></div>

                      {/* Headings */}
                      <button
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        className={`p-2 rounded text-sm font-bold ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Heading 1'
                      >
                        H1
                      </button>
                      <button
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={`p-2 rounded text-sm font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Heading 2'
                      >
                        H2
                      </button>
                      <button
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                        }
                        className={`p-2 rounded text-sm font-bold ${editor?.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Heading 3'
                      >
                        H3
                      </button>
                    </div>

                    {/* Alignment and Lists Row */}
                    <div className='flex flex-wrap gap-1 mb-2'>
                      {/* Text Alignment */}
                      <button
                        onClick={() =>
                          editor?.chain().focus().setTextAlign('left').run()
                        }
                        className={`p-2 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Align Left'
                      >
                        <AlignLeft className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().setTextAlign('center').run()
                        }
                        className={`p-2 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Align Center'
                      >
                        <AlignCenter className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().setTextAlign('right').run()
                        }
                        className={`p-2 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Align Right'
                      >
                        <AlignRight className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().setTextAlign('justify').run()
                        }
                        className={`p-2 rounded ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Justify'
                      >
                        <AlignJustify className='w-4 h-4' />
                      </button>

                      <div className='w-px bg-gray-300 mx-1'></div>

                      {/* Lists */}
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleBulletList().run()
                        }
                        className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Bullet List'
                      >
                        <List className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleOrderedList().run()
                        }
                        className={`p-2 rounded ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Numbered List'
                      >
                        <ListOrdered className='w-4 h-4' />
                      </button>

                      <div className='w-px bg-gray-300 mx-1'></div>

                      {/* Blockquote and Code */}
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleBlockquote().run()
                        }
                        className={`p-2 rounded ${editor?.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Blockquote'
                      >
                        <Quote className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleCodeBlock().run()
                        }
                        className={`p-2 rounded ${editor?.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                        title='Code Block'
                      >
                        <Code className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().setHorizontalRule().run()
                        }
                        className='p-2 rounded hover:bg-gray-200'
                        title='Horizontal Rule'
                      >
                        <Minus className='w-4 h-4' />
                      </button>
                    </div>

                    {/* Links and Tables Row */}
                    <div className='flex flex-wrap gap-1'>
                      {/* Links */}
                      {showLinkInput ? (
                        <div className='flex gap-1 items-center'>
                          <input
                            type='url'
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder='Enter URL'
                            className='px-2 py-1 text-sm border border-gray-300 rounded'
                            onKeyDown={(e) => e.key === 'Enter' && addLink()}
                          />
                          <button
                            onClick={addLink}
                            className='px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowLinkInput(false)}
                            className='px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600'
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowLinkInput(true)}
                          className={`p-2 rounded ${editor?.isActive('link') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                          title='Add Link'
                        >
                          <LinkIcon className='w-4 h-4' />
                        </button>
                      )}
                      {editor?.isActive('link') && (
                        <button
                          onClick={removeLink}
                          className='p-2 rounded hover:bg-gray-200 text-red-600'
                          title='Remove Link'
                        >
                          <Unlink className='w-4 h-4' />
                        </button>
                      )}

                      <div className='w-px bg-gray-300 mx-1'></div>

                      {/* Table Controls */}
                      <button
                        onClick={insertTable}
                        className='p-2 rounded hover:bg-gray-200'
                        title='Insert Table'
                      >
                        <TableIcon className='w-4 h-4' />
                      </button>
                      {editor?.isActive('table') && (
                        <>
                          <div className='w-px bg-gray-300 mx-1'></div>
                          <span className='text-xs text-gray-500 px-1'>
                            Columns:
                          </span>
                          <button
                            onClick={addColumnBefore}
                            className='p-1 rounded hover:bg-gray-200 text-xs'
                            title='Add Column Before'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                          <button
                            onClick={addColumnAfter}
                            className='p-1 rounded hover:bg-gray-200 text-xs'
                            title='Add Column After'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                          <button
                            onClick={deleteColumn}
                            className='p-1 rounded hover:bg-gray-200 text-xs text-red-600'
                            title='Delete Column'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <div className='w-px bg-gray-300 mx-1'></div>
                          <span className='text-xs text-gray-500 px-1'>
                            Rows:
                          </span>
                          <button
                            onClick={addRowBefore}
                            className='p-1 rounded hover:bg-gray-200 text-xs'
                            title='Add Row Before'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                          <button
                            onClick={addRowAfter}
                            className='p-1 rounded hover:bg-gray-200 text-xs'
                            title='Add Row After'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                          <button
                            onClick={deleteRow}
                            className='p-1 rounded hover:bg-gray-200 text-xs text-red-600'
                            title='Delete Row'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <div className='w-px bg-gray-300 mx-1'></div>
                          <button
                            onClick={deleteTable}
                            className='p-1 rounded hover:bg-gray-200 text-xs text-red-600'
                            title='Delete Table'
                          >
                            <Trash2 className='w-3 h-3' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Editor */}
                  <div className='min-h-[300px] max-h-[400px] overflow-y-auto'>
                    <EditorContent
                      editor={editor}
                      className='p-4 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-gray-300 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:bg-gray-50 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:text-left [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_pre]:bg-gray-100 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_hr]:border-gray-300 [&_.ProseMirror_hr]:my-4'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='border-t border-gray-200 p-6 bg-gray-50'>
            <div className='flex justify-between items-center'>
              <div className='text-sm text-gray-500'>
                {selectedTemplate &&
                  `Template: ${templates.find((t) => t.id === selectedTemplate)?.name}`}
              </div>
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={
                    isLoading ||
                    (requiredFields.includes('to') && to.length === 0) ||
                    (requiredFields.includes('subject') && !subject.trim()) ||
                    (requiredFields.includes('content') &&
                      !editor?.getHTML().trim())
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
                      <PaperAirplaneIcon className='w-4 h-4' />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
