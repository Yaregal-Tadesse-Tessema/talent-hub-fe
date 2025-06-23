'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  tagColor?: 'blue' | 'green' | 'purple' | 'yellow';
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  label,
  className = '',
  tagColor = 'blue',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    yellow:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          {label}
        </label>
      )}
      <div className='min-h-[42px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400'>
        <div className='flex flex-wrap gap-2 mb-2'>
          {value.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 ${colorClasses[tagColor]} rounded-full text-sm font-medium`}
            >
              {tag}
              <button
                type='button'
                onClick={() => removeTag(tag)}
                className='ml-1 hover:opacity-70 focus:outline-none'
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : 'Add another...'}
          className='w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm'
        />
      </div>
      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
        Press Enter or comma to add
      </p>
    </div>
  );
}
