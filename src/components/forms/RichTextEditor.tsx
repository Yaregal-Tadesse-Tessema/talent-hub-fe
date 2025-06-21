import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
}: RichTextEditorProps) {
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
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

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
}
