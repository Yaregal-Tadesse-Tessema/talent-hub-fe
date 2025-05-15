import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const experienceOptions = [
  'Freshers',
  '1 - 2 Years',
  '2 - 4 Years',
  '4 - 6 Years',
  '6 - 8 Years',
  '8 - 10 Years',
  '10 - 15 Years',
  '15+ Years',
];
const salaryOptions = [
  '$50 - $1000',
  '$1000 - $2000',
  '$3000 - $4000',
  '$4000 - $6000',
  '$6000 - $8000',
  '$8000 - $10000',
  '$10000 - $15000',
  '$15000+',
];
const jobTypeOptions = [
  'All',
  'Full Time',
  'Part Time',
  'Internship',
  'Remote',
  'Temporary',
  'Contract Base',
];
const educationOptions = [
  'All',
  'High School',
  'Intermediate',
  'Graduation',
  'Master Degree',
  'Bachelor Degree',
];
const jobLevelOptions = ['Entry Level', 'Mid Level', 'Expert Level'];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl relative'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
          onClick={onClose}
        >
          &times;
        </button>
        {/* Filter Content */}
        <div className='grid grid-cols-5 gap-6'>
          {/* Experience */}
          <div>
            <div className='font-semibold mb-2'>Experience</div>
            <div className='flex flex-col gap-2'>
              {experienceOptions.map((exp) => (
                <label key={exp} className='flex items-center gap-2'>
                  <input type='radio' name='experience' />
                  <span>{exp}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Salary */}
          <div>
            <div className='font-semibold mb-2'>Salary</div>
            <div className='flex flex-col gap-2'>
              {salaryOptions.map((sal) => (
                <label key={sal} className='flex items-center gap-2'>
                  <input type='radio' name='salary' />
                  <span>{sal}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Job Type */}
          <div>
            <div className='font-semibold mb-2'>Job Type</div>
            <div className='flex flex-col gap-2'>
              {jobTypeOptions.map((type) => (
                <label key={type} className='flex items-center gap-2'>
                  <input type='checkbox' name='jobType' />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Education */}
          <div>
            <div className='font-semibold mb-2'>Education</div>
            <div className='flex flex-col gap-2'>
              {educationOptions.map((edu) => (
                <label key={edu} className='flex items-center gap-2'>
                  <input type='checkbox' name='education' />
                  <span>{edu}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Job Level */}
          <div>
            <div className='font-semibold mb-2'>Job Level</div>
            <div className='flex flex-col gap-2'>
              {jobLevelOptions.map((level) => (
                <label key={level} className='flex items-center gap-2'>
                  <input type='radio' name='jobLevel' />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Apply Button */}
        <div className='flex justify-end mt-8'>
          <button className='bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition'>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
