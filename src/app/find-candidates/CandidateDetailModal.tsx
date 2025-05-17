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
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 relative my-8 overflow-y-auto max-h-[calc(100vh-4rem)]'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl'
          onClick={onClose}
          aria-label='Close'
        >
          &times;
        </button>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
            {/* Profile image placeholder */}
            <svg width='40' height='40' fill='none' viewBox='0 0 32 32'>
              <rect width='32' height='32' rx='16' fill='#E5E7EB' />
              <path
                d='M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z'
                fill='#D1D5DB'
              />
              <circle cx='16' cy='12' r='5' fill='#D1D5DB' />
            </svg>
          </div>
          <div>
            <div className='font-semibold text-lg text-gray-800'>
              {candidate.name}
            </div>
            <div className='text-gray-500 text-sm'>{candidate.title}</div>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <button className='border rounded p-2 hover:bg-blue-600 hover:text-white bg-blue-50 text-blue-600'>
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
            <div className='mb-4'>
              <div className='font-semibold text-gray-700 mb-1'>BIOGRAPHY</div>
              <div className='text-gray-600 text-sm'>
                {/* Placeholder biography */}
                I've been passionate about graphic design and digital art from
                an early age with a keen interest in Website and Mobile
                Application User Interfaces. I can create high-quality and
                aesthetically pleasing designs in a quick turnaround time. Check
                out the portfolio section of my profile to see samples of my
                work and feel free to discuss your designing needs. I mostly use
                Adobe Photoshop, Illustrator, XD and Figma.
              </div>
            </div>
            <div className='mb-4'>
              <div className='font-semibold text-gray-700 mb-1'>
                COVER LETTER
              </div>
              <div className='text-gray-600 text-sm whitespace-pre-line'>
                {/* Placeholder cover letter */}
                Dear Sir,\n\nI am writing to express my interest in the front
                grade instructional position that is currently available in the
                Fort Wayne Community School System. I learned of the opening
                through a notice posted on JobZone, IPFW's job database. I am
                confident that my academic background and curriculum development
                skills would be successfully utilized in this teaching
                position.\n\nI have just completed my Bachelor of Science degree
                in Elementary Education and have successfully completed Praxis I
                and Praxis II. During my student teaching experience, I
                developed and initiated a three-week curriculum sequence on
                animal species and earth resources. This collaborative unit
                involved working with three other third grade teachers within my
                team, and culminated in a field trip to the Indianapolis Zoo
                Animal Research Unit.\n\nSincerely,\nEsther Howard
              </div>
            </div>
            <div className='mt-6'>
              <div className='font-medium text-gray-600 mb-2'>
                Follow me Social Media
              </div>
              <div className='flex gap-2'>
                <a
                  href='#'
                  className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'
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
                <a
                  href='#'
                  className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right: Info */}
          <div className='w-80 flex flex-col gap-4'>
            <div className='bg-gray-50 rounded-lg p-4 flex flex-col gap-2'>
              <div className='flex gap-2 flex-wrap text-xs text-gray-500'>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>
                    DATE OF BIRTH
                  </div>
                  <div>14 June, 2021</div>
                </div>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>NATIONALITY</div>
                  <div>Bangladesh</div>
                </div>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>
                    MARITAL STATUS
                  </div>
                  <div>Single</div>
                </div>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>GENDER</div>
                  <div>{candidate.gender}</div>
                </div>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>EXPERIENCE</div>
                  <div>{candidate.experience || '7 Years'}</div>
                </div>
                <div className='flex-1 min-w-[120px]'>
                  <div className='font-semibold text-gray-700'>EDUCATIONS</div>
                  <div>{candidate.education || 'Master Degree'}</div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-2'>
              <div className='flex-1'>
                <div className='font-semibold text-gray-700 text-sm'>
                  Download My Resume
                </div>
                <div className='text-xs text-gray-500'>Esther Howard PDF</div>
              </div>
              <button className='bg-blue-100 text-blue-600 rounded p-2 hover:bg-blue-200'>
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
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='font-semibold text-gray-700 text-sm mb-2'>
                Contact Information
              </div>
              <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  className='text-blue-600'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                </svg>
                PHONE
              </div>
              <div className='mb-2'>+1-202-555-0141</div>
              <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  className='text-blue-600'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                </svg>
                SECONDARY PHONE
              </div>
              <div className='mb-2'>+1-202-555-0189</div>
              <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  className='text-blue-600'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                  <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                </svg>
                WEBSITE
              </div>
              <div className='mb-2 text-blue-600'>www.estherhoward.com</div>
              <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  className='text-blue-600'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                  <circle cx='12' cy='10' r='3' />
                </svg>
                LOCATION
              </div>
              <div className='mb-2'>Beverly Hills, California 90202</div>
              <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  className='text-blue-600'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                  <polyline points='22,6 12,13 2,6' />
                </svg>
                EMAIL ADDRESS
              </div>
              <div className='mb-2'>esther.howard@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
