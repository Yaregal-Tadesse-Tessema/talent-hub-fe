import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Education } from '@/types/profile';

interface EducationFormProps {
  initial?: Partial<Education>;
  onSave: (edu: Education) => void;
  onCancel: () => void;
}

const defaultEdu: Education = {
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  gpa: undefined,
  courses: [],
  description: '',
};

const EducationForm: React.FC<EducationFormProps> = ({
  initial,
  onSave,
  onCancel,
}) => {
  const [edu, setEdu] = useState<Education>({ ...defaultEdu, ...initial });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!edu.degree.trim()) e.degree = 'Degree is required';
    if (!edu.institution.trim()) e.institution = 'Institution is required';
    if (!edu.startDate.trim()) e.startDate = 'Start date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof Education, value: any) => {
    setEdu((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...edu,
      courses: (typeof edu.courses === 'string' ? edu.courses : '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      gpa: edu.gpa ? Number(edu.gpa) : undefined,
    });
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div>
        <label className='block text-sm font-medium mb-1'>Degree *</label>
        <Input
          value={edu.degree}
          onChange={(e) => handleChange('degree', e.target.value)}
          className='w-full'
        />
        {errors.degree && (
          <p className='text-xs text-red-500'>{errors.degree}</p>
        )}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Institution *</label>
        <Input
          value={edu.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          className='w-full'
        />
        {errors.institution && (
          <p className='text-xs text-red-500'>{errors.institution}</p>
        )}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Location</label>
        <Input
          value={edu.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className='w-full'
        />
      </div>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>Start Date *</label>
          <Input
            type='date'
            value={edu.startDate}
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
            value={edu.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className='w-full'
            disabled={edu.current}
          />
        </div>
        <div className='flex items-center mt-6'>
          <input
            type='checkbox'
            checked={edu.current}
            onChange={(e) => handleChange('current', e.target.checked)}
            id='current-edu'
            className='mr-2'
          />
          <label htmlFor='current-edu' className='text-sm'>
            Current
          </label>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>GPA</label>
        <Input
          type='number'
          step='0.01'
          value={edu.gpa ?? ''}
          onChange={(e) => handleChange('gpa', e.target.value)}
          className='w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>
          Courses (comma separated)
        </label>
        <Input
          value={
            Array.isArray(edu.courses) ? edu.courses.join(', ') : edu.courses
          }
          onChange={(e) => handleChange('courses', e.target.value)}
          className='w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <Textarea
          value={edu.description}
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

export default EducationForm;
