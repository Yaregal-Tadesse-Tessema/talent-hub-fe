import React from 'react';
import { Button } from './Button';
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
} from 'lucide-react';

interface ApplyJobModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  open,
  onClose,
  jobTitle,
}) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-xl relative'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
          onClick={onClose}
        >
          <X className='w-6 h-6' />
        </button>
        <div className='font-semibold text-lg mb-6'>Apply Job: {jobTitle}</div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Choose Resume
          </label>
          <select className='w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option>Select...</option>
            <option>Resume 1.pdf</option>
            <option>Resume 2.pdf</option>
          </select>
        </div>
        <div className='mb-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Cover Letter
          </label>
          <textarea
            className='w-full border rounded px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Write down your biography here. Let the employers know who you are...'
          />
        </div>
        {/* Formatting Toolbar */}
        <div className='flex gap-2 mb-6 text-gray-500'>
          <button className='p-1 hover:text-blue-600'>
            <Bold className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <Italic className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <Underline className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <Strikethrough className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <List className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <ListOrdered className='w-4 h-4' />
          </button>
          <button className='p-1 hover:text-blue-600'>
            <LinkIcon className='w-4 h-4' />
          </button>
        </div>
        <div className='flex justify-end gap-2 mt-6'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button>Apply Now</Button>
        </div>
      </div>
    </div>
  );
};
