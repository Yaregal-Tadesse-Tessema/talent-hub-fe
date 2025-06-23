'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface SkillInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SkillInput({
  value = [],
  onChange,
  placeholder = 'Type a skill and press Enter',
  label,
  className = '',
}: SkillInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !value.includes(skill)) {
      onChange([...value, skill]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addSkill();
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
          {value.map((skill, index) => (
            <span
              key={index}
              className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium'
            >
              {skill}
              <button
                type='button'
                onClick={() => removeSkill(skill)}
                className='ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none'
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
          placeholder={
            value.length === 0 ? placeholder : 'Add another skill...'
          }
          className='w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm'
        />
      </div>
      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
        Press Enter or comma to add a skill
      </p>
    </div>
  );
}
