import { Profile } from '@/app/cv-builder/page';
import { useState } from 'react';

interface EducationStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function EducationStep({
  profile,
  onUpdate,
}: EducationStepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
  });

  const handleAddEducation = () => {
    if (editingIndex !== null) {
      const updatedEducation = [...profile.education];
      updatedEducation[editingIndex] = newEducation;
      onUpdate({ education: updatedEducation });
      setEditingIndex(null);
    } else {
      onUpdate({ education: [...profile.education, newEducation] });
    }
    setNewEducation({
      degree: '',
      institution: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    });
    setIsAdding(false);
  };

  const handleEditEducation = (index: number) => {
    const edu = profile.education[index];
    setNewEducation({
      degree: edu.degree || '',
      institution: edu.institution || '',
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      current: edu.current || false,
      description: edu.description || '',
      location: edu.location || '',
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducation = profile.education.filter((_, i) => i !== index);
    onUpdate({ education: updatedEducation });
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Education
        </h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          List your educational background, starting with the most recent.
        </p>
      </div>

      {/* Education List */}
      <div className='space-y-4'>
        {profile.education.map((edu, index) => (
          <div
            key={index}
            className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  {edu.degree}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {edu.institution}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className='mt-2 text-gray-700 dark:text-gray-300'>
                  {edu.description}
                </p>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleEditEducation(index)}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEducation(index)}
                  className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Education Form */}
      {isAdding ? (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            {editingIndex !== null ? 'Edit Education' : 'Add Education'}
          </h3>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='degree'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Degree/Certificate
              </label>
              <input
                type='text'
                id='degree'
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Bachelor of Science in Computer Science'
              />
            </div>
            <div>
              <label
                htmlFor='field'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Field of Study
              </label>
              <input
                type='text'
                id='field'
                value={newEducation.field}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, field: e.target.value })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Computer Science'
              />
            </div>
            <div>
              <label
                htmlFor='institution'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Institution
              </label>
              <input
                type='text'
                id='institution'
                value={newEducation.institution}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    institution: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='University Name'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Start Date
                </label>
                <input
                  type='month'
                  id='startDate'
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      startDate: e.target.value,
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  End Date
                </label>
                <input
                  type='month'
                  id='endDate'
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      endDate: e.target.value,
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={newEducation.current}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    current: e.target.checked,
                  })
                }
                className='rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700'
              />
              <label className='text-sm text-gray-600 dark:text-gray-300'>
                Currently Studying
              </label>
            </div>
            <div>
              <label
                htmlFor='location'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Location
              </label>
              <input
                type='text'
                id='location'
                value={newEducation.location}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    location: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='City, Country'
              />
            </div>
            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Description
              </label>
              <textarea
                id='description'
                rows={4}
                value={newEducation.description}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    description: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Describe your studies, achievements, etc.'
              />
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                }}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleAddEducation}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
              >
                {editingIndex !== null ? 'Save Changes' : 'Add Education'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className='w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors'
        >
          + Add Education
        </button>
      )}

      {/* Tips */}
      <div className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800'>
        <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
          Tips for listing education:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1'>
          <li>Start with your highest level of education</li>
          <li>Include relevant coursework and projects</li>
          <li>Mention academic achievements and honors</li>
          <li>Include certifications and professional development</li>
          <li>Focus on education relevant to your target role</li>
        </ul>
      </div>
    </div>
  );
}
