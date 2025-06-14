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
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
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
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsAdding(false);
  };

  const handleEditExperience = (index: number) => {
    setNewExperience(profile.experience[index]);
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
        <h2 className='text-2xl font-bold text-gray-900'>Work Experience</h2>
        <p className='mt-1 text-sm text-gray-500'>
          List your work experience in reverse chronological order.
        </p>
      </div>

      {/* Experience List */}
      <div className='space-y-4'>
        {profile.experience.map((exp, index) => (
          <div key={index} className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-medium text-gray-900'>
                  {exp.title}
                </h3>
                <p className='text-gray-600'>{exp.company}</p>
                <p className='text-sm text-gray-500'>
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className='mt-2 text-gray-700'>{exp.description}</p>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleEditExperience(index)}
                  className='text-blue-600 hover:text-blue-800'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteExperience(index)}
                  className='text-red-600 hover:text-red-800'
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
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            {editingIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700'
              >
                Job Title
              </label>
              <input
                type='text'
                id='title'
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Software Engineer'
              />
            </div>

            <div>
              <label
                htmlFor='company'
                className='block text-sm font-medium text-gray-700'
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
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Company Name'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium text-gray-700'
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
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700'
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
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700'
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
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Describe your responsibilities and achievements...'
              />
            </div>

            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                }}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleAddExperience}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                {editingIndex !== null ? 'Save Changes' : 'Add Experience'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className='w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          + Add Experience
        </button>
      )}

      {/* Tips */}
      <div className='bg-blue-50 p-4 rounded-md'>
        <h3 className='text-sm font-medium text-blue-800'>
          Tips for listing experience:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 list-disc list-inside space-y-1'>
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
