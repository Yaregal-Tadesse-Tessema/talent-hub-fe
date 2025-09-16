import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export interface RichTextEditorRef {
  updateContent: (content: string) => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ content, onChange, placeholder = 'Start writing...' }, ref) => {
    const lastContentRef = useRef<string>(content);
    const isUpdatingRef = useRef<boolean>(false);
    const isAIContentUpdateRef = useRef<boolean>(false);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
        Image,
        Placeholder.configure({
          placeholder,
        }),
      ],
      content,
      immediatelyRender: false, // Fix SSR hydration issues
      onUpdate: ({ editor }) => {
        if (isUpdatingRef.current || isAIContentUpdateRef.current) {
          console.log(
            '🚫 Ignoring onChange during programmatic content update',
          );
          return; // Prevent updates during programmatic content changes
        }

        const html = editor.getHTML();
        if (html !== lastContentRef.current) {
          lastContentRef.current = html;
          onChange(html);
        }
      },
    });

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        updateContent: (newContent: string) => {
          if (editor) {
            console.log('🎯 Direct content update called:', newContent);
            console.log(
              '🎯 Current editor content before update:',
              editor.getHTML(),
            );

            isUpdatingRef.current = true;
            isAIContentUpdateRef.current = true; // Mark as AI content update

            try {
              // Set new content directly
              editor.commands.setContent(newContent, false);
              lastContentRef.current = newContent;

              console.log(
                '🎯 Editor content after direct update:',
                editor.getHTML(),
              );
              console.log('✅ Direct content update completed successfully');

              // Manually trigger onChange to update form data
              console.log('🔄 Manually triggering onChange for form data sync');
              onChange(newContent);

              // Release locks after a short delay
              setTimeout(() => {
                isUpdatingRef.current = false;
                isAIContentUpdateRef.current = false;
                console.log('🔓 Content update locks released');
              }, 500);
            } catch (error) {
              console.error('❌ Error in direct content update:', error);
              isUpdatingRef.current = false;
              isAIContentUpdateRef.current = false;
            }
          } else {
            console.log('❌ Editor not available for direct content update');
          }
        },
      }),
      [editor],
    );

    // Update editor content when the content prop changes
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        // Don't update if we're in the middle of an AI content update
        if (isAIContentUpdateRef.current) {
          console.log(
            '🚫 Skipping content update - AI content update in progress',
          );
          return;
        }

        console.log('📝 Updating editor content with:', content);
        isUpdatingRef.current = true;
        lastContentRef.current = content;

        try {
          editor.commands.setContent(content, false);
          console.log('✅ Editor content updated successfully');
        } catch (error) {
          console.error('❌ Error updating editor content:', error);
        } finally {
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        }
      }
    }, [editor, content]);

    if (!editor) {
      return null;
    }

    return (
      <div className='border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700'>
        <div className='border-b border-gray-300 dark:border-gray-600 p-2 flex gap-2 flex-wrap bg-gray-50 dark:bg-gray-800'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${
              editor.isActive('bold')
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : ''
            }`}
            type='button'
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${
              editor.isActive('italic')
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : ''
            }`}
            type='button'
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : ''
            }`}
            type='button'
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : ''
            }`}
            type='button'
          >
            1. List
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${
              editor.isActive('link')
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : ''
            }`}
            type='button'
          >
            🔗 Link
          </button>
        </div>
        <EditorContent
          editor={editor}
          className='prose max-w-none p-4 min-h-[200px] text-gray-900 dark:text-gray-100 prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-em:text-gray-900 dark:prose-em:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300'
        />
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
