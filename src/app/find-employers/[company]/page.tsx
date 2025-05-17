import React from 'react';
import Link from 'next/link';

export default function EmployerDetailPage() {
  return (
    <div className='min-h-screen pb-16 bg-gray-50'>
      {/* Page title and breadcrumb */}
      <div className='flex justify-between bg-gray-100 items-center px-16 py-4'>
        <h2 className='text-md text-gray-500'>Single Employer</h2>
        <nav className='text-gray-400 text-sm flex items-center gap-1'>
          <span className='hover:text-gray-600 cursor-pointer'>Home</span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 font-medium'>Single Employer</span>
        </nav>
      </div>

      {/* Top Banner Placeholder */}
      <div className='w-full px-16 h-56 bg-[repeating-linear-gradient(90deg,_#000_0_60px,_#fff_60px_120px)]' />
      {/* Card with logo, name, industry, button */}
      <div className='max-w-5xl mx-auto -mt-16'>
        <div className='bg-white rounded-xl shadow p-6 flex items-center gap-6'>
          <div className='w-20 h-20 rounded-lg bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center'>
            <svg width='40' height='40' viewBox='0 0 40 40' fill='none'>
              <rect width='40' height='40' rx='8' fill='url(#paint0_linear)' />
              <path
                d='M20 12a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z'
                fill='#fff'
              />
              <defs>
                <linearGradient
                  id='paint0_linear'
                  x1='0'
                  y1='0'
                  x2='40'
                  y2='40'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stopColor='#F58529' />
                  <stop offset='1' stopColor='#DD2A7B' />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className='flex-1'>
            <div className='font-semibold text-xl'>Twitter</div>
            <div className='text-gray-500 text-sm'>
              Information Technology (IT)
            </div>
          </div>
          <button className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
            View Open Position
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className='max-w-5xl mx-auto mt-8 flex gap-8'>
        {/* Left: Description, Benefits, Vision */}
        <div className='flex-1'>
          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Description</div>
            <div className='text-gray-600 text-sm leading-relaxed'>
              Fusce et erat et nibh maximus fermentum. Mauris ac justo nibh.
              Praesent nec lorem lorem. Donec ullamcorper lacus mollis tortor
              pretium malesuada. In quis porta nisi, quis fringilla orci. Donec
              porttitor, odio a efficitur blandit, orci nisl porta elit, eget
              vulputate quam nibh ut tellus. Sed ut posuere risus, vitae commodo
              velit. Nullam in lorem dolor. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Nulla tincidunt ac quam quis vehicula.
              Quisque sagittis ullamcorper magna. Vivamus elementum eu leo et
              gravida. Sed dignissim placerat diam, ac laoreet eros rutrum sit
              amet. Donec imperdiet in leo et imperdiet. In hac habitasse platea
              dictumst. Sed quis nisi nisi. Sed nisi nisi molestie diam
              ullamcorper condimentum. Sed aliquet, arcu eget pretium bibendum,
              odio enim rutrum arcu, quis suscipit mauris turpis in neque.
              Vestibulum id vestibulum odio. Sed dolor felis, iaculis eget
              turpis eu, lobortis imperdiet massa.
            </div>
          </div>
          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Company Benefits</div>
            <ul className='list-disc pl-6 text-gray-600 text-sm space-y-1'>
              <li>In hac habitasse platea dictumst.</li>
              <li>
                Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu.
              </li>
              <li>Vestibulum id vestibulum odio.</li>
              <li>
                Etiam libero ante accumsan id tellus venenatis rhoncus vulputate
                velit.
              </li>
              <li>Nam condimentum et nisi maximus et imperdiet massa.</li>
            </ul>
          </div>
          <div className='mb-8'>
            <div className='font-semibold text-lg mb-2'>Company Vision</div>
            <div className='text-gray-600 text-sm leading-relaxed'>
              Praesent ultrices mauris et nisl euismod, ut venenatis augue
              blandit. Etiam massa risus, accumsan nec tempus nec, venenatis in
              nisl. Maecenas nulla ex, blandit in magna id, pellentesque
              facilisis sapien. In feugiat tortor at, eget commodo luctus
              convallis ac.
            </div>
          </div>
          <div className='flex gap-2 items-center mt-4'>
            <span className='text-gray-500 text-sm'>Share profile:</span>
            <button className='bg-blue-100 text-blue-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Facebook
            </button>
            <button className='bg-blue-100 text-blue-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Twitter
            </button>
            <button className='bg-red-100 text-red-600 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium'>
              Pinterest
            </button>
          </div>
        </div>
        {/* Right: Info Card */}
        <div className='w-96 flex flex-col gap-6'>
          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='flex justify-between mb-2'>
              <div>
                <div className='text-xs text-gray-400'>FOUNDED IN:</div>
                <div className='font-medium'>14 June, 2021</div>
              </div>
              <div>
                <div className='text-xs text-gray-400'>ORGANIZATION TYPE</div>
                <div className='font-medium'>Private Company</div>
              </div>
            </div>
            <div className='flex justify-between mt-4'>
              <div>
                <div className='text-xs text-gray-400'>TEAM SIZE</div>
                <div className='font-medium'>120-300 Candidates</div>
              </div>
              <div>
                <div className='text-xs text-gray-400'>INDUSTRY TYPES</div>
                <div className='font-medium'>Technology</div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='font-semibold mb-2'>Contact Information</div>
            <div className='mb-2'>
              <div className='text-xs text-gray-400'>WEBSITE</div>
              <a
                href='https://www.estherhoward.com'
                className='text-blue-600 hover:underline'
              >
                www.estherhoward.com
              </a>
            </div>
            <div className='mb-2'>
              <div className='text-xs text-gray-400'>PHONE</div>
              <div className='font-medium'>+1-202-555-0141</div>
            </div>
            <div>
              <div className='text-xs text-gray-400'>EMAIL ADDRESS</div>
              <div className='font-medium'>esther.howard@gmail.com</div>
            </div>
          </div>
          <div className='bg-white rounded-lg border p-6 text-sm text-gray-700'>
            <div className='font-semibold mb-2'>Follow us on:</div>
            <div className='flex gap-3'>
              <a href='#' className='text-blue-600 hover:text-blue-800'>
                <svg width='20' height='20' fill='currentColor'>
                  <rect width='20' height='20' rx='4' />
                  <path
                    d='M14 7h-2a2 2 0 00-2 2v2H8v2h2v4h2v-4h2l1-2h-3V9a1 1 0 011-1h2V7z'
                    fill='#fff'
                  />
                </svg>
              </a>
              <a href='#' className='text-blue-600 hover:text-blue-800'>
                <svg width='20' height='20' fill='currentColor'>
                  <rect width='20' height='20' rx='4' />
                  <path
                    d='M10 8a2 2 0 100 4 2 2 0 000-4zm0 7a5 5 0 100-10 5 5 0 000 10zm7-7a1 1 0 11-2 0 1 1 0 012 0z'
                    fill='#fff'
                  />
                </svg>
              </a>
              <a href='#' className='text-blue-600 hover:text-blue-800'>
                <svg width='20' height='20' fill='currentColor'>
                  <rect width='20' height='20' rx='4' />
                  <circle cx='10' cy='10' r='4' fill='#fff' />
                </svg>
              </a>
              <a href='#' className='text-blue-600 hover:text-blue-800'>
                <svg width='20' height='20' fill='currentColor'>
                  <rect width='20' height='20' rx='4' />
                  <rect x='6' y='6' width='8' height='8' fill='#fff' />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Open Position Section */}
      <div className='max-w-5xl mx-auto mt-16'>
        <h2 className='text-3xl font-semibold text-center mb-10'>
          Open Position (05)
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Job Cards */}
          {[
            {
              company: 'Freepik',
              logo: 'https://cdn.worldvectorlogo.com/logos/freepik.svg',
              country: 'China',
              title: 'Visual Designer',
              type: 'Full Time',
              salary: '$10K-$15K',
              featured: true,
            },
            {
              company: 'Instagram',
              logo: 'https://cdn.worldvectorlogo.com/logos/instagram-2-1.svg',
              country: 'Australia',
              title: 'Front End Developer',
              type: 'Contract Base',
              salary: '$50K-$80K',
              featured: false,
            },
            {
              company: 'Upwork',
              logo: 'https://cdn.worldvectorlogo.com/logos/upwork.svg',
              country: 'France',
              title: 'Techical Support Specialist',
              type: 'Full Time',
              salary: '$35K-$40K',
              featured: true,
            },
            {
              company: 'Facebook',
              logo: 'https://cdn.worldvectorlogo.com/logos/facebook-3.svg',
              country: 'United Kingdom of Great Britain',
              title: 'Software Engineer',
              type: 'Part Time',
              salary: '$15K-$20K',
              featured: false,
            },
            {
              company: 'Microsoft',
              logo: 'https://cdn.worldvectorlogo.com/logos/microsoft.svg',
              country: 'Australia',
              title: 'Product Designer',
              type: 'Full Time',
              salary: '$40K-$50K',
              featured: false,
            },
          ].map((job, idx) => (
            <div
              key={job.company + job.title}
              className={`rounded-xl border bg-white p-6 flex flex-col gap-2 shadow-sm relative ${job.featured ? 'border-0 bg-gradient-to-r from-yellow-50 to-white' : ''}`}
            >
              <div className='flex items-center gap-3 mb-2'>
                <img
                  src={job.logo}
                  alt={job.company}
                  className='w-10 h-10 rounded-lg object-contain bg-gray-100'
                />
                <div className='font-semibold text-base'>{job.company}</div>
                {job.featured && (
                  <span className='ml-2 bg-pink-100 text-pink-500 text-xs font-semibold px-3 py-1 rounded-full'>
                    Featured
                  </span>
                )}
              </div>
              <div className='flex items-center gap-1 text-gray-400 text-xs mb-2'>
                <svg
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                    strokeWidth='2'
                  />
                </svg>
                {job.country}
              </div>
              <div className='font-semibold text-lg text-gray-800 mb-1'>
                {job.title}
              </div>
              <div className='text-gray-500 text-sm flex gap-2'>
                <span>{job.type}</span>
                <span className='mx-1'>•</span>
                <span>{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
