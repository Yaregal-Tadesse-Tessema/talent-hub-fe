'use client';
import React, { useState, useEffect } from 'react';
import CandidateDetailModal from './CandidateDetailModal';
import Image from 'next/image';
import Link from 'next/link';
import { employeeService } from '@/services/employee.service';

const candidateLevels = ['Entry Level', 'Mid Level', 'Expert Level'];
const experiences = [
  'Freshers',
  '1 - 2 Years',
  '2 - 4 Years',
  '4 - 6 Years',
  '6 - 8 Years',
  '8 - 10 Years',
  '10 - 15 Years',
  '15+ Years',
];
const educations = [
  'All',
  'High School',
  'Intermediate',
  'Graduation',
  'Master Degree',
  'Bachelor Degree',
];
const genders = ['Male', 'Female', 'Others'];

const mockCandidates = [
  {
    name: 'Cody Fisher',
    title: 'Marketing Officer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Male',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Darrell Steward',
    title: 'Interaction Designer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Male',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Guy Hawkins',
    title: 'Junior Graphic Designer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Male',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Jane Cooper',
    title: 'Senior UX Designer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Female',
    education: 'Graduation',
    level: 'Mid Level',
    selected: true,
  },
  {
    name: 'Theresa Webb',
    title: 'Front End Developer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Female',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Kathryn Murphy',
    title: 'Technical Support Specialist',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Female',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Marvin McKinney',
    title: 'UI/UX Designer',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Male',
    education: 'Graduation',
    level: 'Mid Level',
  },
  {
    name: 'Jenny Wilson',
    title: 'Marketing Manager',
    location: 'New York',
    experience: '3 Years experience',
    gender: 'Female',
    education: 'Graduation',
    level: 'Mid Level',
  },
];

export default function FindCandidatesPage() {
  const [user, setUser] = useState<any>(null);
  const [radius, setRadius] = useState(32);
  const [selectedLevel, setSelectedLevel] = useState('Mid Level');
  const [selectedExperience, setSelectedExperience] = useState('4 - 6 Years');
  const [selectedEducations, setSelectedEducations] = useState(['Graduation']);
  const [selectedGender, setSelectedGender] = useState('Male');
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    level: true,
    experience: true,
    education: true,
    gender: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    employeeService.getEmployers().then((res) => {
      console.log(res);
    });
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {!user ? (
        <>
          {/* Hero Section */}
          <section className='bg-white py-20'>
            <div className='container mx-auto px-4'>
              <div className='max-w-3xl mx-auto text-center'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                  Find Your Perfect Candidates
                </h1>
                <p className='text-xl text-gray-600 mb-8'>
                  Connect with top talent and streamline your hiring process
                  with our powerful recruitment platform
                </p>
                <Link
                  href='/signup'
                  className='inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                >
                  Get Started - It's Free
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className='py-20'>
            <div className='container mx-auto px-4'>
              <h2 className='text-3xl font-bold text-center mb-12'>
                Why Choose TalentHub?
              </h2>
              <div className='grid md:grid-cols-3 gap-8'>
                <FeatureCard
                  title='Post Jobs in Minutes'
                  description='Create and publish job listings in minutes with our intuitive job posting interface. Reach thousands of qualified candidates instantly.'
                  icon='📝'
                />
                <FeatureCard
                  title='Smart Candidate Matching'
                  description='Our AI-powered system matches your job requirements with the most suitable candidates, saving you time and effort.'
                  icon='🎯'
                />
                <FeatureCard
                  title='Easy Application Management'
                  description='Organize and track applications efficiently with our comprehensive dashboard. Never miss a potential hire.'
                  icon='📊'
                />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className='py-20 bg-white'>
            <div className='container mx-auto px-4'>
              <h2 className='text-3xl font-bold text-center mb-12'>
                How It Works
              </h2>
              <div className='grid md:grid-cols-4 gap-8'>
                <StepCard
                  number='1'
                  title='Create Your Account'
                  description='Sign up for free and set up your company profile'
                />
                <StepCard
                  number='2'
                  title='Post Your Jobs'
                  description='Create detailed job listings with requirements and benefits'
                />
                <StepCard
                  number='3'
                  title='Review Applications'
                  description='Receive and review applications from qualified candidates'
                />
                <StepCard
                  number='4'
                  title='Hire Top Talent'
                  description='Connect with candidates and make your hiring decisions'
                />
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className='py-20'>
            <div className='container mx-auto px-4'>
              <h2 className='text-3xl font-bold text-center mb-12'>
                Simple, Transparent Pricing
              </h2>
              <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
                <PricingCard
                  title='Basic'
                  price='Free'
                  features={[
                    'Post up to 3 jobs',
                    'Basic candidate search',
                    'Application management',
                    'Email support',
                  ]}
                />
                <PricingCard
                  title='Professional'
                  price='$99/month'
                  features={[
                    'Unlimited job postings',
                    'Advanced candidate search',
                    'AI-powered matching',
                    'Priority support',
                    'Custom branding',
                  ]}
                  highlighted={true}
                />
                <PricingCard
                  title='Enterprise'
                  price='Custom'
                  features={[
                    'Everything in Professional',
                    'Dedicated account manager',
                    'Custom integrations',
                    'Advanced analytics',
                    'Team collaboration tools',
                  ]}
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className='py-20 bg-blue-600 text-white'>
            <div className='container mx-auto px-4 text-center'>
              <h2 className='text-3xl font-bold mb-6'>
                Ready to Find Your Next Great Hire?
              </h2>
              <p className='text-xl mb-8'>
                Join thousands of companies already using TalentHub
              </p>
              <Link
                href='/signup'
                className='inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
              >
                Start Hiring Today
              </Link>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Page title and breadcrumb */}
          <div className='flex justify-between bg-gray-100 items-center px-4 sm:px-8 md:px-16 py-4'>
            <h2 className='text-md text-gray-500'>Find Candidates</h2>
            <nav className='text-gray-400 text-sm flex items-center gap-1'>
              <span className='hover:text-gray-600 cursor-pointer'>Home</span>
              <span className='mx-1'>/</span>
              <span className='text-gray-700 font-medium'>Find Candidates</span>
            </nav>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={toggleMobileFilter}
            className='lg:hidden fixed bottom-6 right-6 z-[100] bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center'
          >
            <svg
              width='24'
              height='24'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          {/* Mobile Filter Overlay */}
          {showMobileFilter && (
            <div
              className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[90]'
              onClick={toggleMobileFilter}
            >
              <div
                className='absolute right-0 top-0 h-full w-[280px] bg-white shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='p-4 border-b flex justify-between items-center'>
                  <h3 className='font-semibold text-lg'>Filters</h3>
                  <button
                    onClick={toggleMobileFilter}
                    className='p-2 hover:bg-gray-100 rounded-full'
                  >
                    <svg
                      width='24'
                      height='24'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        d='M6 18L18 6M6 6l12 12'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
                <div className='p-4'>
                  {/* Filter content will be rendered here */}
                  {/* Location Radius */}
                  <div>
                    <div
                      className='flex justify-between items-center mb-2 cursor-pointer select-none'
                      onClick={() => toggleSection('location')}
                    >
                      <span className='font-medium text-sm sm:text-base'>
                        Location Radius:{' '}
                        <span className='text-blue-600 font-semibold'>
                          {radius} miles
                        </span>
                      </span>
                      <svg
                        width='20'
                        height='20'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className={`transform transition-transform ${expandedSections.location ? 'rotate-180' : ''}`}
                      >
                        <path
                          d='M19 9l-7 7-7-7'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                    {expandedSections.location && (
                      <input
                        type='range'
                        min={0}
                        max={100}
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className='w-full accent-blue-600 mt-4'
                      />
                    )}
                  </div>
                  {/* Rest of the filter sections */}
                  {/* ... Copy the rest of the filter sections here ... */}
                </div>
              </div>
            </div>
          )}

          {/* Top search/filter bar */}
          <div className='bg-gray-100 px-4 sm:px-8 md:px-16 py-4 pb-8 border-b'>
            <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center shadow rounded-xl px-4 sm:px-6 py-2 bg-white'>
              {/* Job title search */}
              <div className='flex items-center gap-2 flex-1 border-b sm:border-b-0 sm:border-r pb-2 sm:pb-0 pr-0 sm:pr-4'>
                <svg
                  width='22'
                  height='22'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='#2563eb'
                  className='flex-shrink-0'
                >
                  <circle cx='11' cy='11' r='7' strokeWidth='2' />
                  <path d='M21 21l-4.35-4.35' strokeWidth='2' />
                </svg>
                <input
                  className='flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400'
                  placeholder='Job title, Keyword...'
                />
              </div>
              {/* Location */}
              <div className='flex items-center gap-2 border-b sm:border-b-0 sm:border-r px-0 sm:px-4 pb-2 sm:pb-0 min-w-[200px]'>
                <svg
                  width='22'
                  height='22'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='#2563eb'
                  className='flex-shrink-0'
                >
                  <path
                    d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                    strokeWidth='2'
                  />
                  <circle cx='12' cy='9' r='2.5' strokeWidth='2' />
                </svg>
                <input
                  className='bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 w-full'
                  placeholder='Location'
                />
              </div>
              {/* Category */}
              <div className='flex items-center gap-2 border-b sm:border-b-0 sm:border-r px-0 sm:px-4 pb-2 sm:pb-0 min-w-[200px]'>
                <svg
                  width='22'
                  height='22'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='#2563eb'
                  className='flex-shrink-0'
                >
                  <g strokeWidth='2'>
                    <rect x='3' y='3' width='18' height='6' rx='2' />
                    <rect x='3' y='9' width='18' height='6' rx='2' />
                    <rect x='3' y='15' width='18' height='6' rx='2' />
                  </g>
                </svg>
                <select className='bg-transparent border-none outline-none text-gray-700 w-full'>
                  <option>Select Category</option>
                </select>
              </div>
              {/* Find Job button */}
              <div className='flex items-center gap-2 pl-0 sm:pl-2 pt-2 sm:pt-0'>
                <button className='w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
                  Find Job
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Filter */}
          <div className='bg-gray-50 flex flex-col lg:flex-row gap-4 lg:gap-8 px-4 sm:px-8 md:px-16 py-8'>
            <div className='hidden lg:block w-full lg:w-80 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm h-fit flex flex-col gap-4 sm:gap-6'>
              <button className='w-full bg-blue-600 text-white py-2 rounded mb-2 font-semibold flex items-center justify-center gap-2'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M20 21V16'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M17 16H23'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M4 21V14'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M1 14H7'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 21V12'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9 8H15'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M20 12V3'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 8V3'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M4 10V3'
                    stroke='#ffffff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Filter
              </button>
              {/* Location Radius */}
              <div>
                <div
                  className='flex justify-between items-center mb-2 cursor-pointer select-none'
                  onClick={() => toggleSection('location')}
                >
                  <span className='font-medium text-sm sm:text-base'>
                    Location Radius:{' '}
                    <span className='text-blue-600 font-semibold'>
                      {radius} miles
                    </span>
                  </span>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={`transform transition-transform ${expandedSections.location ? 'rotate-180' : ''}`}
                  >
                    <path
                      d='M19 9l-7 7-7-7'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {expandedSections.location && (
                  <input
                    type='range'
                    min={0}
                    max={100}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className='w-full accent-blue-600 mt-4'
                  />
                )}
              </div>
              {/* Candidate Level */}
              <div>
                <div
                  className='flex justify-between items-center mb-2 cursor-pointer select-none'
                  onClick={() => toggleSection('level')}
                >
                  <div className='font-medium text-sm sm:text-base'>
                    Candidate Level
                  </div>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={`transform transition-transform ${expandedSections.level ? 'rotate-180' : ''}`}
                  >
                    <path
                      d='M19 9l-7 7-7-7'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {expandedSections.level && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
                    {candidateLevels.map((level) => (
                      <div key={level} className='flex items-center'>
                        <input
                          type='radio'
                          id={level}
                          name='level'
                          value={level}
                          checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                          className='mr-2 accent-blue-600'
                        />
                        <label htmlFor={level} className='text-sm sm:text-base'>
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Experiences */}
              <div>
                <div
                  className='flex justify-between items-center mb-2 cursor-pointer select-none'
                  onClick={() => toggleSection('experience')}
                >
                  <div className='font-medium text-sm sm:text-base'>
                    Experiences
                  </div>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={`transform transition-transform ${expandedSections.experience ? 'rotate-180' : ''}`}
                  >
                    <path
                      d='M19 9l-7 7-7-7'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {expandedSections.experience && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
                    {experiences.map((exp) => (
                      <div key={exp} className='flex items-center'>
                        <input
                          type='radio'
                          id={exp}
                          name='experience'
                          value={exp}
                          checked={selectedExperience === exp}
                          onChange={() => setSelectedExperience(exp)}
                          className='mr-2 accent-blue-600'
                        />
                        <label htmlFor={exp} className='text-sm sm:text-base'>
                          {exp}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Education */}
              <div>
                <div
                  className='flex justify-between items-center mb-2 cursor-pointer select-none'
                  onClick={() => toggleSection('education')}
                >
                  <div className='font-medium text-sm sm:text-base'>
                    Education
                  </div>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={`transform transition-transform ${expandedSections.education ? 'rotate-180' : ''}`}
                  >
                    <path
                      d='M19 9l-7 7-7-7'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {expandedSections.education && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
                    {educations.map((edu) => (
                      <div key={edu} className='flex items-center'>
                        <input
                          type='checkbox'
                          id={edu}
                          name='education'
                          value={edu}
                          checked={selectedEducations.includes(edu)}
                          onChange={() =>
                            setSelectedEducations((prev) =>
                              prev.includes(edu)
                                ? prev.filter((e) => e !== edu)
                                : [...prev, edu],
                            )
                          }
                          className='mr-2 accent-blue-600'
                        />
                        <label htmlFor={edu} className='text-sm sm:text-base'>
                          {edu}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Gender */}
              <div>
                <div
                  className='flex justify-between items-center mb-2 cursor-pointer select-none'
                  onClick={() => toggleSection('gender')}
                >
                  <div className='font-medium text-sm sm:text-base'>Gender</div>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={`transform transition-transform ${expandedSections.gender ? 'rotate-180' : ''}`}
                  >
                    <path
                      d='M19 9l-7 7-7-7'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                {expandedSections.gender && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
                    {genders.map((gender) => (
                      <div key={gender} className='flex items-center'>
                        <input
                          type='radio'
                          id={gender}
                          name='gender'
                          value={gender}
                          checked={selectedGender === gender}
                          onChange={() => setSelectedGender(gender)}
                          className='mr-2 accent-blue-600'
                        />
                        <label
                          htmlFor={gender}
                          className='text-sm sm:text-base'
                        >
                          {gender}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Main Content */}
            <div className='flex-1'>
              <div className='flex justify-between items-center mb-6'>
                <div className='flex gap-2'>
                  <select className='w-24 border rounded-md px-3 py-2'>
                    <option>Latest</option>
                    <option>Oldest</option>
                  </select>
                  <select className='w-36 border rounded-md px-3 py-2'>
                    <option>12 per page</option>
                    <option>24 per page</option>
                    <option>48 per page</option>
                  </select>
                </div>
                <div className='flex gap-2'>
                  <button className='border rounded p-2 bg-blue-50 text-blue-600'>
                    <svg
                      width='20'
                      height='20'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <rect x='3' y='3' width='7' height='7' strokeWidth='2' />
                      <rect x='14' y='3' width='7' height='7' strokeWidth='2' />
                      <rect
                        x='14'
                        y='14'
                        width='7'
                        height='7'
                        strokeWidth='2'
                      />
                      <rect x='3' y='14' width='7' height='7' strokeWidth='2' />
                    </svg>
                  </button>
                  <button className='border rounded p-2'>
                    <svg
                      width='20'
                      height='20'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <rect x='3' y='3' width='18' height='7' strokeWidth='2' />
                      <rect
                        x='3'
                        y='14'
                        width='18'
                        height='7'
                        strokeWidth='2'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                {mockCandidates.map((candidate, idx) => (
                  <div
                    key={candidate.name}
                    className='flex items-center bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4 justify-between hover:ring-2 hover:ring-blue-500'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center'>
                        {/* Profile image placeholder */}
                        <svg
                          width='32'
                          height='32'
                          fill='none'
                          viewBox='0 0 32 32'
                        >
                          <rect width='32' height='32' rx='8' fill='#E5E7EB' />
                          <path
                            d='M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z'
                            fill='#D1D5DB'
                          />
                          <circle cx='16' cy='12' r='5' fill='#D1D5DB' />
                        </svg>
                      </div>
                      <div>
                        <div
                          className='font-semibold text-base text-gray-800 hover:text-blue-600 hover:cursor-pointer'
                          onClick={() => handleCandidateClick(candidate)}
                        >
                          {candidate.name}
                        </div>
                        <div className='text-gray-500 text-sm'>
                          {candidate.title}
                        </div>
                        <div className='flex items-center gap-2 text-gray-400 text-xs mt-1'>
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
                          {candidate.location}
                          <span>•</span>
                          {candidate.experience}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
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
                      <button className='px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition hover:bg-blue-600 hover:text-white bg-blue-100 text-blue-700'>
                        View Profile
                        <svg
                          width='18'
                          height='18'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M9 5l7 7-7 7' strokeWidth='2' />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for candidate detail */}
      {showModal && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className='bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='text-4xl mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold mb-3'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className='text-center'>
      <div className='w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4'>
        {number}
      </div>
      <h3 className='text-xl font-semibold mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`bg-white p-8 rounded-lg ${highlighted ? 'ring-2 ring-blue-600' : 'shadow-sm'}`}
    >
      <h3 className='text-2xl font-bold mb-2'>{title}</h3>
      <div className='text-3xl font-bold mb-6'>{price}</div>
      <ul className='space-y-3'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-center'>
            <svg
              className='w-5 h-5 text-green-500 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full mt-8 py-3 rounded-lg font-semibold ${
          highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } transition-colors`}
      >
        Get Started
      </button>
    </div>
  );
}
