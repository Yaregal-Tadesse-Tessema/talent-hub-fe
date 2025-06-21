import { Profile } from '@/app/cv-builder/page';
import { useState } from 'react';

interface SkillsStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function SkillsStep({ profile, onUpdate }: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      onUpdate({ skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    onUpdate({
      skills: profile.skills.filter((skill) => skill !== skillToDelete),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Skills
        </h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          List your key skills and competencies. These will help employers find
          you.
        </p>
      </div>

      {/* Skills Input */}
      <div className='flex gap-2'>
        <input
          type='text'
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Add a skill (e.g., JavaScript, Project Management)'
          className='flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
        />
        <button
          onClick={handleAddSkill}
          className='px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
        >
          Add
        </button>
      </div>

      {/* Skills List */}
      <div className='flex flex-wrap gap-2'>
        {profile.skills.map((skill, index) => (
          <div
            key={index}
            className='group relative bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center border border-blue-200 dark:border-blue-700'
          >
            <span>{skill}</span>
            <button
              onClick={() => handleDeleteSkill(skill)}
              className='ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity'
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800'>
        <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
          Tips for listing skills:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1'>
          <li>Include both technical and soft skills</li>
          <li>List skills relevant to your target position</li>
          <li>Be specific (e.g., "React.js" instead of just "JavaScript")</li>
          <li>Include industry-specific tools and technologies</li>
          <li>Add language proficiencies if applicable</li>
        </ul>
      </div>

      {/* Skill Categories */}
      <div className='mt-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
          Suggested Skill Categories
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
            <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
              Technical Skills
            </h4>
            <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
              <li>Programming Languages</li>
              <li>Frameworks & Libraries</li>
              <li>Databases</li>
              <li>Development Tools</li>
              <li>Cloud Platforms</li>
            </ul>
          </div>
          <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
            <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
              Soft Skills
            </h4>
            <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
              <li>Communication</li>
              <li>Leadership</li>
              <li>Problem Solving</li>
              <li>Team Collaboration</li>
              <li>Time Management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
