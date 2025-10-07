import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Experience } from '@/types/profile';

interface ExperienceFormProps {
  initial?: Partial<Experience>;
  onSave: (exp: Experience) => void;
  onCancel: () => void;
}

const defaultExp: Experience = {
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  technologies: [],
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initial,
  onSave,
  onCancel,
}) => {
  const [exp, setExp] = useState<Experience>({ ...defaultExp, ...initial });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!exp.jobTitle.trim()) e.jobTitle = 'Job title is required';
    if (!exp.company.trim()) e.company = 'Company is required';
    if (!exp.startDate.trim()) e.startDate = 'Start date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof Experience, value: any) => {
    setExp((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...exp,
      technologies: (typeof exp.technologies === 'string'
        ? exp.technologies
        : ''
      )
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div>
        <label className='block text-sm font-medium mb-1'>Job Title *</label>
        <Input
          value={exp.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          className='w-full'
        />
        {errors.jobTitle && (
          <p className='text-xs text-red-500'>{errors.jobTitle}</p>
        )}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Company *</label>
        <Input
          value={exp.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className='w-full'
        />
        {errors.company && (
          <p className='text-xs text-red-500'>{errors.company}</p>
        )}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Location</label>
        <Input
          value={exp.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className='w-full'
        />
      </div>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Start Date *</label>
          <Input
            type='date'
            value={exp.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className='w-full'
          />
          {errors.startDate && (
            <p className='text-xs text-red-500'>{errors.startDate}</p>
          )}
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>End Date</label>
          <Input
            type='date'
            value={exp.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className='w-full'
            disabled={exp.current}
          />
        </div>
        <div className='flex items-center mt-6'>
          <input
            type='checkbox'
            checked={exp.current}
            onChange={(e) => handleChange('current', e.target.checked)}
            id='current-exp'
            className='mr-2'
          />
          <label htmlFor='current-exp' className='text-sm'>
            Current
          </label>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>
          Technologies (comma separated)
        </label>
        <Input
          value={
            Array.isArray(exp.technologies)
              ? exp.technologies.join(', ')
              : exp.technologies
          }
          onChange={(e) => handleChange('technologies', e.target.value)}
          className='w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <Textarea
          value={exp.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className='w-full'
        />
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' variant='default'>
          Save
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
