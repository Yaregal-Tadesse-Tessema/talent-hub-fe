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
    startDate: '',
    endDate: '',
    description: '',
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
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsAdding(false);
  };

  const handleEditEducation = (index: number) => {
    setNewEducation(profile.education[index]);
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
        <h2 className='text-2xl font-bold text-gray-900'>Education</h2>
        <p className='mt-1 text-sm text-gray-500'>
          List your educational background, starting with the most recent.
        </p>
      </div>

      {/* Education List */}
      <div className='space-y-4'>
        {profile.education.map((edu, index) => (
          <div key={index} className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-medium text-gray-900'>
                  {edu.degree}
                </h3>
                <p className='text-gray-600'>{edu.institution}</p>
                <p className='text-sm text-gray-500'>
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className='mt-2 text-gray-700'>{edu.description}</p>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleEditEducation(index)}
                  className='text-blue-600 hover:text-blue-800'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEducation(index)}
                  className='text-red-600 hover:text-red-800'
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
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            {editingIndex !== null ? 'Edit Education' : 'Add Education'}
          </h3>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='degree'
                className='block text-sm font-medium text-gray-700'
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
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Bachelor of Science in Computer Science'
              />
            </div>

            <div>
              <label
                htmlFor='institution'
                className='block text-sm font-medium text-gray-700'
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
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='University Name'
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
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
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
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
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
                value={newEducation.description}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    description: e.target.value,
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Describe your major achievements, relevant coursework, or academic projects...'
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
                onClick={handleAddEducation}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                {editingIndex !== null ? 'Save Changes' : 'Add Education'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className='w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          + Add Education
        </button>
      )}

      {/* Tips */}
      <div className='bg-blue-50 p-4 rounded-md'>
        <h3 className='text-sm font-medium text-blue-800'>
          Tips for listing education:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 list-disc list-inside space-y-1'>
          <li>List your most recent education first</li>
          <li>Include relevant coursework or projects</li>
          <li>Mention academic achievements or honors</li>
          <li>Include GPA if it's impressive (3.5 or higher)</li>
          <li>Add any relevant certifications or training</li>
        </ul>
      </div>
    </div>
  );
}
