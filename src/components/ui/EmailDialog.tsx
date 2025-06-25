import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { showToast } = useToast();

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
      const errorMessage = 'Please fill in all required fields';
      onError?.(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
      });
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
