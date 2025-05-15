'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Bookmark,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import { ApplyJobModal } from '@/components/ui/ApplyJobModal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Mock job data (same as in find-job/page.tsx)
const jobs = [
  {
    id: 1,
    company: 'Reddit',
    logo: '🟧',
    featured: true,
    location: 'United Kingdom of Great Britain',
    title: 'Marketing Officer',
    type: 'Full Time',
    salary: '$30K-$35K',
    contact: {
      website: 'https://reddit.com',
      phone: '(406) 555-0120',
      email: 'career@reddit.com',
    },
    posted: '14 June, 2021',
    expires: '14 July, 2021',
    education: 'Graduation',
    experience: '4-6 Years',
    description: `Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.\n\nNam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.`,
    responsibilities: [
      'Quisque semper gravida est et consectetur.',
      'Curabitur blandit lorem velit, vitae pretium leo placerat eget.',
      'Morbi mattis in ipsum ac tempus.',
      'Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.',
      'vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.',
      'lobortis vel lectus. Nulla at risus ut diam.',
      'commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.',
      'odio metus posuere lorem, id condimentum erat velit nec neque.',
      'dui sodales ut. Curabitur tempus augue.',
    ],
    overview: {
      salary: '$30K-$35K',
      location: 'United Kingdom of Great Britain',
      type: 'Full Time',
      posted: '14 June, 2021',
      expires: '14 July, 2021',
      education: 'Graduation',
      experience: '4-6 Years',
    },
    companyInfo: {
      name: 'Reddit',
      description:
        'Social news aggregation, web content rating, and discussion website',
      founded: 'June 23, 2005',
      type: 'Private Company',
      size: '300-500 Employers',
      phone: '(406) 555-0120',
      email: 'career@reddit.com',
      website: 'https://reddit.com',
      socials: [
        { icon: 'facebook', url: '#' },
        { icon: 'twitter', url: '#' },
        { icon: 'youtube', url: '#' },
      ],
    },
  },
  // ... add other jobs as needed, including one for Instagram as in the image
  {
    id: 10,
    company: 'Instagram',
    logo: '🟪',
    featured: true,
    location: 'New York, USA',
    title: 'Senior UX Designer',
    type: 'Full Time',
    salary: '$50k-80k/month',
    contact: {
      website: 'https://instagram.com',
      phone: '(406) 555-0120',
      email: 'career@instagram.com',
    },
    posted: '14 June, 2021',
    expires: '14 July, 2021',
    education: 'Graduation',
    experience: '10-15 Years',
    description: `Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.\n\nNam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.`,
    responsibilities: [
      'Quisque semper gravida est et consectetur.',
      'Curabitur blandit lorem velit, vitae pretium leo placerat eget.',
      'Morbi mattis in ipsum ac tempus.',
      'Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.',
      'vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.',
      'lobortis vel lectus. Nulla at risus ut diam.',
      'commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.',
      'odio metus posuere lorem, id condimentum erat velit nec neque.',
      'dui sodales ut. Curabitur tempus augue.',
    ],
    overview: {
      salary: '$50k-80k/month',
      location: 'New York, USA',
      type: 'Full Time',
      posted: '14 June, 2021',
      expires: '14 July, 2021',
      education: 'Graduation',
      experience: '10-15 Years',
    },
    companyInfo: {
      name: 'Instagram',
      description: 'Social networking service',
      founded: 'March 21, 2006',
      type: 'Private Company',
      size: '120-300 Employers',
      phone: '(406) 555-0120',
      email: 'twitter@gmail.com',
      website: 'https://twitter.com',
      socials: [
        { icon: 'facebook', url: '#' },
        { icon: 'twitter', url: '#' },
        { icon: 'youtube', url: '#' },
      ],
    },
  },
];

function getJobById(id: number) {
  return jobs.find((job) => job.id === id);
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = getJobById(Number(params.id));
  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  if (!job) return notFound();

  return (
    <main className='bg-gray-50 min-h-screen pb-16'>
      <div className='max-w-7xl mx-auto px-6 pt-8'>
        <div className='mb-6 text-sm text-gray-400 flex items-center gap-2'>
          <Link href='/' className='hover:underline'>
            Home
          </Link>
          <span>/</span>
          <Link href='/find-job' className='hover:underline'>
            Find Job
          </Link>
          <span>/</span>
          <span className='text-gray-500'>Job Details</span>
        </div>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content */}
          <div className='flex-1'>
            <Card className='mb-6 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm'>
              <div className='flex items-center gap-6'>
                <div className='w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-gradient-to-tr from-pink-400 to-yellow-400'>
                  {job.logo}
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-2xl font-semibold text-gray-800'>
                      {job.title}
                    </span>
                    {job.featured && (
                      <Badge variant='destructive'>Featured</Badge>
                    )}
                    <Badge
                      variant='outline'
                      className='text-blue-600 border-blue-200 bg-blue-50'
                    >
                      {job.type}
                    </Badge>
                  </div>
                  <div className='flex flex-wrap gap-4 text-gray-500 text-sm items-center'>
                    <a
                      href={job.contact.website}
                      className='flex items-center gap-1 hover:underline'
                    >
                      <Globe className='w-4 h-4' />
                      {job.contact.website.replace('https://', '')}
                    </a>
                    <span className='flex items-center gap-1'>
                      <Phone className='w-4 h-4' />
                      {job.contact.phone}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Mail className='w-4 h-4' />
                      {job.contact.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 min-w-[220px]'>
                <div className='flex gap-2 w-full justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-gray-200'
                  >
                    <Bookmark className='w-5 h-5' />
                  </Button>
                  <Button
                    className='text-base font-semibold'
                    onClick={() => setIsApplyOpen(true)}
                  >
                    Apply Now
                  </Button>
                </div>
                <span className='text-xs text-red-500'>
                  Job expire in:{' '}
                  <span className='font-semibold'>June 30, 2021</span>
                </span>
              </div>
            </Card>
            {/* Description */}
            <Card className='mb-6 p-8'>
              <div className='font-semibold text-lg mb-2'>Job Description</div>
              <div className='text-gray-600 whitespace-pre-line mb-6'>
                {job.description}
              </div>
              <div className='font-semibold text-lg mb-2'>Responsibilities</div>
              <ul className='list-disc pl-6 text-gray-600 space-y-1 mb-6'>
                {job.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className='flex gap-2 items-center mt-4'>
                <span>Share this job:</span>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-blue-200 text-blue-600'
                >
                  <Facebook className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-blue-200 text-blue-600'
                >
                  <Twitter className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-red-200 text-red-600'
                >
                  <Youtube className='w-4 h-4' />
                </Button>
              </div>
            </Card>
          </div>
          {/* Sidebar */}
          <div className='w-full lg:w-[350px] flex flex-col gap-6'>
            {/* Job Overview */}
            <Card className='p-6'>
              <div className='font-semibold text-lg mb-4'>Job Overview</div>
              <div className='grid grid-cols-2 gap-x-4 gap-y-5 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>📅</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>JOB POSTED:</div>
                    <div>{job.overview.posted}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>⏰</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>JOB EXPIRE IN:</div>
                    <div>{job.overview.expires}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>🎓</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>EDUCATION</div>
                    <div>{job.overview.education}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>💰</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>SALARY:</div>
                    <div>{job.overview.salary}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>📍</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>LOCATION:</div>
                    <div>{job.overview.location}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>💼</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>JOB TYPE:</div>
                    <div>{job.overview.type}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>🧑‍💼</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>EXPERIENCE</div>
                    <div>{job.overview.experience}</div>
                  </div>
                </div>
              </div>
            </Card>
            {/* Company Info */}
            <Card className='p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-tr from-pink-400 to-yellow-400'>
                  {job.logo}
                </div>
                <div>
                  <div className='font-semibold'>{job.companyInfo.name}</div>
                  <div className='text-xs text-gray-400'>
                    {job.companyInfo.description}
                  </div>
                </div>
              </div>
              <div className='text-sm text-gray-600 space-y-1 mb-3'>
                <div className='flex justify-between'>
                  <span>Founded in:</span>
                  <span>{job.companyInfo.founded}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Organization type:</span>
                  <span>{job.companyInfo.type}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Company size:</span>
                  <span>{job.companyInfo.size}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Phone:</span>
                  <span>{job.companyInfo.phone}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Email:</span>
                  <span>{job.companyInfo.email}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Website:</span>
                  <span className='truncate max-w-[120px] inline-block align-bottom'>
                    <a
                      href={job.companyInfo.website}
                      className='text-blue-600 hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {job.companyInfo.website}
                    </a>
                  </span>
                </div>
              </div>
              <div className='flex gap-2 mt-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-blue-200 text-blue-600'
                >
                  <Facebook className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-blue-200 text-blue-600'
                >
                  <Twitter className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full border-red-200 text-red-600'
                >
                  <Youtube className='w-4 h-4' />
                </Button>
              </div>
            </Card>
          </div>
        </div>
        {/* Related Jobs Section */}
        <section className='max-w-7xl mx-auto px-6 mt-16'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>Related Jobs</h2>
            <div className='flex gap-2'>
              <Button variant='secondary' size='sm' className='rounded-full'>
                <span className='sr-only'>Previous</span>
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    d='M15 19l-7-7 7-7'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Button>
              <Button variant='secondary' size='sm' className='rounded-full'>
                <span className='sr-only'>Next</span>
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    d='M9 5l7 7-7 7'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
            {jobs
              .filter((j) => j.id !== job.id)
              .slice(0, 6)
              .map((related) => (
                <Card
                  key={related.id}
                  className='p-6 flex flex-col gap-2 border hover:shadow-md transition'
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <div
                      className='w-10 h-10 rounded-lg flex items-center justify-center text-2xl'
                      style={{
                        background:
                          related.logo === '🟪'
                            ? 'linear-gradient(135deg, #f58529 0%, #dd2a7b 100%)'
                            : related.logo === '🟥'
                              ? '#ff0000'
                              : related.logo === '🟦'
                                ? '#1877f2'
                                : related.logo === '🟩'
                                  ? '#14a800'
                                  : related.logo === '🟨'
                                    ? '#fbbc05'
                                    : '#e0e7ef',
                      }}
                    >
                      {related.logo}
                    </div>
                    <div className='font-semibold text-gray-800 flex items-center gap-2'>
                      {related.company}{' '}
                      {related.featured && (
                        <Badge variant='destructive'>Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-1 text-gray-400 text-sm mb-1'>
                    <svg
                      width='16'
                      height='16'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M12 21c-4.97-6.16-8-10.16-8-13A8 8 0 1 1 20 8c0 2.84-3.03 6.84-8 13z' />
                      <circle cx='12' cy='8' r='3' />
                    </svg>
                    {related.location}
                  </div>
                  <div className='font-semibold text-lg text-gray-900 mb-1'>
                    {related.title}
                  </div>
                  <div className='text-gray-500 text-sm flex items-center gap-2'>
                    <span>{related.type}</span>
                    <span>•</span>
                    <span>{related.salary}</span>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      </div>
      <ApplyJobModal
        open={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobTitle={job.title}
      />
    </main>
  );
}
