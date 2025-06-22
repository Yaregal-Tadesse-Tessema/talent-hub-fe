import React from 'react';

interface CandidateDetailModalProps {
  candidate: any;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
}) => {
  if (!candidate) return null;

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get full name
  const getFullName = () => {
    const parts = [];
    if (candidate.firstName) parts.push(candidate.firstName);
    if (candidate.middleName) parts.push(candidate.middleName);
    if (candidate.lastName) parts.push(candidate.lastName);
    return parts.length > 0
      ? parts.join(' ')
      : candidate.email || 'Unknown Candidate';
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl p-8 relative my-8 overflow-y-auto max-h-[calc(100vh-4rem)]'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl'
          onClick={onClose}
          aria-label='Close'
        >
          &times;
        </button>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <div className='w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
            {/* Profile image placeholder */}
            <svg width='40' height='40' fill='none' viewBox='0 0 32 32'>
              <rect
                width='32'
                height='32'
                rx='16'
                fill='#E5E7EB'
                className='dark:fill-gray-600'
              />
              <path
                d='M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z'
                fill='#D1D5DB'
                className='dark:fill-gray-500'
              />
              <circle
                cx='16'
                cy='12'
                r='5'
                fill='#D1D5DB'
                className='dark:fill-gray-500'
              />
            </svg>
          </div>
          <div>
            <div className='font-semibold text-lg text-gray-800 dark:text-white'>
              {getFullName()}
            </div>
            <div className='text-gray-500 dark:text-gray-400 text-sm'>
              {candidate.profileHeadLine ||
                candidate.alertConfiguration?.jobTitle ||
                'No title specified'}
            </div>
            {candidate.aiGeneratedJobFitScore && (
              <div className='flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1'>
                <svg
                  width='14'
                  height='14'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
                {candidate.aiGeneratedJobFitScore}% job match
              </div>
            )}
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <button className='border border-gray-200 dark:border-gray-600 rounded p-2 hover:bg-blue-600 hover:text-white bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'>
              <svg
                width='18'
                height='18'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  d='M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z'
                  strokeWidth='2'
                />
              </svg>
            </button>
            <button className='ml-auto bg-blue-600 text-white px-4 py-2 rounded gap-2 hover:bg-blue-700'>
              Send Mail
            </button>
          </div>
        </div>
        {/* Body */}
        <div className='flex gap-8'>
          {/* Left: Bio and Cover Letter */}
          <div className='flex-1 min-w-0'>
            {candidate.professionalSummery && (
              <div className='mb-4'>
                <div className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  PROFESSIONAL SUMMARY
                </div>
                <div className='text-gray-600 dark:text-gray-400 text-sm'>
                  {candidate.professionalSummery}
                </div>
              </div>
            )}
            {candidate.coverLetter && (
              <div className='mb-4'>
                <div className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  COVER LETTER
                </div>
                <div className='text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line'>
                  {candidate.coverLetter}
                </div>
              </div>
            )}
            {candidate.technicalSkills &&
              candidate.technicalSkills.length > 0 && (
                <div className='mb-4'>
                  <div className='font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                    TECHNICAL SKILLS
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {candidate.technicalSkills.map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full'
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            {candidate.softSkills && candidate.softSkills.length > 0 && (
              <div className='mb-4'>
                <div className='font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                  SOFT SKILLS
                </div>
                <div className='flex flex-wrap gap-2'>
                  {candidate.softSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(candidate.linkedinUrl || candidate.portfolioUrl) && (
              <div className='mt-6'>
                <div className='font-medium text-gray-600 dark:text-gray-400 mb-2'>
                  Professional Links
                </div>
                <div className='flex gap-2'>
                  {candidate.linkedinUrl && (
                    <a
                      href={candidate.linkedinUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded p-2 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                      </svg>
                    </a>
                  )}
                  {candidate.portfolioUrl && (
                    <a
                      href={candidate.portfolioUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded p-2 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9'
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Right: Info */}
          <div className='w-80 flex flex-col gap-4'>
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col gap-2'>
              <div className='flex gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400'>
                {candidate.birthDate && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className='font-semibold text-gray-700 dark:text-gray-300'>
                      DATE OF BIRTH
                    </div>
                    <div className='dark:text-white'>
                      {formatDate(candidate.birthDate)}
                    </div>
                  </div>
                )}
                {candidate.gender && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className='font-semibold text-gray-700 dark:text-gray-300'>
                      GENDER
                    </div>
                    <div className='dark:text-white'>{candidate.gender}</div>
                  </div>
                )}
                {candidate.yearOfExperience && (
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                    <svg
                      width='16'
                      height='16'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z'
                        strokeWidth='2'
                      />
                      <circle cx='12' cy='10' r='3' strokeWidth='2' />
                    </svg>
                    <span>
                      {candidate.yearOfExperience}{' '}
                      {parseInt(candidate.yearOfExperience) === 1
                        ? 'year'
                        : 'years'}{' '}
                      of experience
                    </span>
                  </div>
                )}
                {candidate.highestLevelOfEducation && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className='font-semibold text-gray-700 dark:text-gray-300'>
                      EDUCATION
                    </div>
                    <div className='dark:text-white'>
                      {candidate.highestLevelOfEducation}
                    </div>
                  </div>
                )}
                {candidate.salaryExpectations && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className='font-semibold text-gray-700 dark:text-gray-300'>
                      SALARY EXPECTATION
                    </div>
                    <div className='dark:text-white'>
                      ${candidate.salaryExpectations.toLocaleString()}/year
                    </div>
                  </div>
                )}
                {candidate.industry && candidate.industry.length > 0 && (
                  <div className='flex-1 min-w-[120px]'>
                    <div className='font-semibold text-gray-700 dark:text-gray-300'>
                      INDUSTRY
                    </div>
                    <div className='dark:text-white'>
                      {candidate.industry.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {candidate.resume && (
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-2'>
                <div className='flex-1'>
                  <div className='font-semibold text-gray-700 dark:text-gray-300 text-sm'>
                    Download Resume
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {getFullName()} Resume
                  </div>
                </div>
                <button className='bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded p-2 hover:bg-blue-200 dark:hover:bg-blue-900/50'>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <div className='font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2'>
                Contact Information
              </div>
              {candidate.phone && (
                <>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2'>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      className='text-blue-600 dark:text-blue-400'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                    </svg>
                    PHONE
                  </div>
                  <div className='mb-2 dark:text-white'>{candidate.phone}</div>
                </>
              )}
              {candidate.portfolioUrl && (
                <>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2'>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      className='text-blue-600 dark:text-blue-400'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                    </svg>
                    PORTFOLIO
                  </div>
                  <div className='mb-2 text-blue-600 dark:text-blue-400'>
                    <a
                      href={candidate.portfolioUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline'
                    >
                      {candidate.portfolioUrl}
                    </a>
                  </div>
                </>
              )}
              {candidate.preferredJobLocation &&
                candidate.preferredJobLocation.length > 0 && (
                  <>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2'>
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        className='text-blue-600 dark:text-blue-400'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                        <circle cx='12' cy='10' r='3' />
                      </svg>
                      PREFERRED LOCATIONS
                    </div>
                    <div className='mb-2 dark:text-white'>
                      {candidate.preferredJobLocation.join(', ')}
                    </div>
                  </>
                )}
              {candidate.email && (
                <>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2'>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      className='text-blue-600 dark:text-blue-400'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                      <polyline points='22,6 12,13 2,6' />
                    </svg>
                    EMAIL ADDRESS
                  </div>
                  <div className='mb-2 dark:text-white'>
                    <a
                      href={`mailto:${candidate.email}`}
                      className='hover:text-blue-600 dark:hover:text-blue-400'
                    >
                      {candidate.email}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
