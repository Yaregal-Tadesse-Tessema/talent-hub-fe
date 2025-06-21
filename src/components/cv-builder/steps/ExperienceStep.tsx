import { Profile } from '@/app/cv-builder/page';
import { useState } from 'react';

interface ExperienceStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function ExperienceStep({
  profile,
  onUpdate,
}: ExperienceStepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newExperience, setNewExperience] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
  });

  const handleAddExperience = () => {
    if (editingIndex !== null) {
      const updatedExperience = [...profile.experience];
      updatedExperience[editingIndex] = newExperience;
      onUpdate({ experience: updatedExperience });
      setEditingIndex(null);
    } else {
      onUpdate({ experience: [...profile.experience, newExperience] });
    }
    setNewExperience({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    });
    setIsAdding(false);
  };

  const handleEditExperience = (index: number) => {
    const exp = profile.experience[index];
    setNewExperience({
      position: exp.position || '',
      company: exp.company || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || '',
      location: exp.location || '',
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperience = profile.experience.filter((_, i) => i !== index);
    onUpdate({ experience: updatedExperience });
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Work Experience
        </h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          List your work experience in reverse chronological order.
        </p>
      </div>

      {/* Experience List */}
      <div className='space-y-4'>
        {profile.experience.map((exp, index) => (
          <div
            key={index}
            className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  {exp.position}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {exp.company}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className='mt-2 text-gray-700 dark:text-gray-300'>
                  {exp.description}
                </p>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleEditExperience(index)}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteExperience(index)}
                  className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Experience Form */}
      {isAdding ? (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            {editingIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='position'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Job Title
              </label>
              <input
                type='text'
                id='position'
                value={newExperience.position}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    position: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Software Engineer'
              />
            </div>
            <div>
              <label
                htmlFor='company'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Company
              </label>
              <input
                type='text'
                id='company'
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Company Name'
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
                  value={newExperience.startDate}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
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
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
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
                checked={newExperience.current}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    current: e.target.checked,
                  })
                }
                className='rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700'
              />
              <label className='text-sm text-gray-600 dark:text-gray-300'>
                Current Position
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
                value={newExperience.location}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
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
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                placeholder='Describe your responsibilities, achievements, etc.'
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
                onClick={handleAddExperience}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
              >
                {editingIndex !== null ? 'Save Changes' : 'Add Experience'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className='w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors'
        >
          + Add Experience
        </button>
      )}

      {/* Tips */}
      <div className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800'>
        <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
          Tips for listing experience:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1'>
          <li>Start with your most recent position</li>
          <li>Use action verbs to describe your responsibilities</li>
          <li>Include specific achievements and metrics when possible</li>
          <li>Keep descriptions concise but informative</li>
          <li>Focus on relevant experience for your target role</li>
        </ul>
      </div>
    </div>
  );
}
