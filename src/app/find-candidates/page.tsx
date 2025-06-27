'use client';
import React, { useState, useEffect } from 'react';
import CandidateDetailModal from './CandidateDetailModal';
import SaveCandidateModal from '@/components/SaveCandidateModal';
import Link from 'next/link';
import { employeeService, JobSeekerProfile } from '@/services/employee.service';
import { savedCandidatesService } from '@/services/savedCandidates.service';
import CandidateFilters, { FilterState } from '@/components/CandidateFilters';
import { useAuth } from '@/contexts/AuthContext';
import { FiBookmark } from 'react-icons/fi';

export default function FindCandidatesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<JobSeekerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<JobSeekerProfile | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(
    new Set(),
  );

  // Save candidate modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [candidateToSave, setCandidateToSave] =
    useState<JobSeekerProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    experience: 'All',
    education: ['All'],
    gender: 'All',
    salaryRange: 'All',
    jobFitScore: 'All',
    industries: ['All'],
    radius: 32,
  });

  // Fetch candidates when user is logged in
  useEffect(() => {
    if (user) {
      fetchCandidates();
      fetchSavedCandidates();
    }
  }, [user]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await employeeService.searchCandidates(
        '', // no search query
        'All', // all experience levels
        ['All'], // all education levels
        'All', // all genders
        32, // default radius
        'All', // all salary ranges
        'All', // all job fit scores
        ['All'], // all industries
        pageSize,
        (currentPage - 1) * pageSize,
      );

      // The service now returns a properly typed response with items
      const candidatesData = response.items || [];
      console.log('Processed candidates data:', candidatesData);
      setCandidates(candidatesData);

      // Update total count if available in response
      if (response.total !== undefined) {
        setTotalCandidates(response.total);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCandidates = async () => {
    if (!user?.id) return;

    try {
      const response = await savedCandidatesService.getSavedCandidates();
      const savedIds = new Set(
        response.items?.map((sc) => sc.candidateId) || [],
      );
      setSavedCandidates(savedIds);
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
    }
  };

  const handleSearch = async (isFilterSearch = false) => {
    if (isFilterSearch) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }

    // Debug: Log the filter values being passed
    console.log('Filter values being passed:', {
      searchQuery,
      experience: filters.experience,
      education: filters.education,
      gender: filters.gender,
      radius: filters.radius,
      salaryRange: filters.salaryRange,
      jobFitScore: filters.jobFitScore,
      industries: filters.industries,
      top: pageSize,
      skip: (currentPage - 1) * pageSize,
    });

    try {
      const response = await employeeService.searchCandidates(
        searchQuery,
        filters.experience,
        filters.education,
        filters.gender,
        filters.radius,
        filters.salaryRange,
        filters.jobFitScore,
        filters.industries,
        pageSize,
        (currentPage - 1) * pageSize,
      );

      // The service now returns a properly typed response with items
      const candidatesData = response.items || [];
      console.log('Search results:', candidatesData);
      setCandidates(candidatesData);

      // Update total count if available in response
      if (response.total !== undefined) {
        setTotalCandidates(response.total);
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
      setCandidates([]);
    } finally {
      if (isFilterSearch) {
        setFilterLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Manual search function for when users want to search with default values
  const handleManualSearch = () => {
    if (user) {
      handleSearch(true);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
    // Reset to first page when filters change
    setCurrentPage(1);
    if (user) {
      handleSearch(true);
    }
  };

  const handleCandidateClick = (candidate: JobSeekerProfile) => {
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

  // Get active filters summary
  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.experience !== 'All') activeFilters.push(filters.experience);
    if (filters.education.length > 0 && !filters.education.includes('All')) {
      activeFilters.push(`${filters.education.length} education level(s)`);
    }
    if (filters.gender !== 'All') activeFilters.push(filters.gender);
    if (filters.salaryRange !== 'All') activeFilters.push(filters.salaryRange);
    if (filters.jobFitScore !== 'All') activeFilters.push(filters.jobFitScore);
    if (filters.industries.length > 0 && !filters.industries.includes('All')) {
      activeFilters.push(`${filters.industries.length} industry(ies)`);
    }

    return activeFilters;
  };

  const handleSaveCandidateClick = (candidate: JobSeekerProfile) => {
    if (!user?.id) {
      alert('Please log in to save candidates');
      return;
    }

    if (savedCandidates.has(candidate.id)) {
      // If already saved, remove from saved
      handleRemoveSavedCandidate(candidate);
    } else {
      // If not saved, show save modal
      setCandidateToSave(candidate);
      setShowSaveModal(true);
    }
  };

  const handleSaveCandidate = async (remark: string) => {
    if (!user?.id || !candidateToSave) {
      return;
    }

    setIsSaving(true);
    try {
      // Get organization ID from selected employer
      const organizationId = user.selectedEmployer?.tenant?.id;
      if (!organizationId) {
        alert('Please select an organization to save candidates');
        return;
      }

      await savedCandidatesService.saveCandidate({
        organizationId,
        userId: candidateToSave.id,
        remark: remark || undefined,
      });

      setSavedCandidates((prev) => new Set(prev).add(candidateToSave.id));
      setShowSaveModal(false);
      setCandidateToSave(null);
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert('Failed to save candidate. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSavedCandidate = async (candidate: JobSeekerProfile) => {
    if (!user?.id) return;

    try {
      const savedCandidate = await savedCandidatesService.getSavedCandidates();
      const toDelete = savedCandidate.items?.find(
        (sc) => sc.candidateId === candidate.id,
      );
      if (toDelete) {
        await savedCandidatesService.deleteSavedCandidate(toDelete.id);
        setSavedCandidates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(candidate.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error removing saved candidate:', error);
      alert('Failed to remove candidate. Please try again.');
    }
  };

  const handleSaveModalClose = () => {
    setShowSaveModal(false);
    setCandidateToSave(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {!user ? (
        <>
          {/* Hero Section */}
          <section className='bg-white dark:bg-gray-800 py-20'>
            <div className='container mx-auto px-4'>
              <div className='max-w-3xl mx-auto text-center'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                  Find Your Perfect Candidates
                </h1>
                <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
                  Connect with top talent and streamline your hiring process
                  with our powerful recruitment platform
                </p>
                <Link
                  href='/signup?type=employer'
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
              <h2 className='text-3xl font-bold text-center mb-12 dark:text-white'>
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
          <section className='py-20 bg-white dark:bg-gray-800'>
            <div className='container mx-auto px-4'>
              <h2 className='text-3xl font-bold text-center mb-12 dark:text-white'>
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
              <h2 className='text-3xl font-bold text-center mb-12 dark:text-white'>
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
                href='/signup?type=employer'
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
          <div className='flex justify-between bg-gray-100 dark:bg-gray-800 items-center px-4 sm:px-8 md:px-16 py-4'>
            <h2 className='text-md text-gray-500 dark:text-gray-400'>
              Find Candidates
            </h2>
            <nav className='text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1'>
              <span className='hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'>
                Home
              </span>
              <span className='mx-1'>/</span>
              <span className='text-gray-700 dark:text-gray-300 font-medium'>
                Find Candidates
              </span>
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
                className='absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                  <h3 className='font-semibold text-lg dark:text-white'>
                    Filters
                  </h3>
                  <button
                    onClick={toggleMobileFilter}
                    className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
                  >
                    <svg
                      width='24'
                      height='24'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='dark:text-white'
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
                  <CandidateFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    loading={filterLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Top search/filter bar */}
          <div className='bg-gray-100 dark:bg-gray-800 px-4 sm:px-8 md:px-16 py-4 pb-8 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center shadow rounded-xl px-4 sm:px-6 py-2 bg-white dark:bg-gray-700'>
              {/* Candidate search */}
              <div className='flex items-center gap-2 flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-600 pb-2 sm:pb-0 pr-0 sm:pr-4'>
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
                  className='flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                  placeholder='Search by name, job title, or professional summary...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              {/* Find Candidates button */}
              <div className='flex items-center gap-2 pl-0 sm:pl-2 pt-2 sm:pt-0'>
                <button
                  className='w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'
                  onClick={handleManualSearch}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Find Candidates'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Filter */}
          <div className='bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row gap-4 lg:gap-8 px-4 sm:px-8 md:px-16 py-8'>
            <div className='hidden lg:block w-full lg:w-80'>
              <CandidateFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                loading={filterLoading}
              />
            </div>
            {/* Main Content */}
            <div className='flex-1'>
              <div className='flex justify-between items-center mb-6'>
                <div className='flex gap-2'>
                  <button
                    onClick={handleManualSearch}
                    disabled={loading}
                    className='px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className={loading ? 'animate-spin' : ''}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    Refresh
                  </button>
                </div>
                <div className='flex gap-2'>
                  <span className='text-sm text-gray-600 dark:text-gray-400 self-center'>
                    {loading
                      ? 'Loading...'
                      : `${candidates.length} candidate ${candidates.length !== 1 ? 's' : ''} found`}
                  </span>
                  {getActiveFilters().length > 0 && (
                    <div className='flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400'>
                      <svg
                        width='14'
                        height='14'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                          strokeWidth='2'
                        />
                      </svg>
                      <span>{getActiveFilters().join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                {loading ? (
                  <div className='flex justify-center items-center py-12'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    <span className='ml-2 text-gray-600 dark:text-gray-400'>
                      Loading candidates...
                    </span>
                  </div>
                ) : !Array.isArray(candidates) || candidates.length === 0 ? (
                  <div className='text-center py-12'>
                    <div className='text-gray-500 dark:text-gray-400 mb-4'>
                      <svg
                        className='mx-auto h-12 w-12'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                      {Array.isArray(candidates) && candidates.length > 0
                        ? 'No candidates match your filters'
                        : 'No candidates found'}
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400'>
                      {Array.isArray(candidates) && candidates.length > 0
                        ? 'Try adjusting your search criteria.'
                        : 'Try adjusting your search criteria or check back later.'}
                    </p>
                  </div>
                ) : (
                  candidates.map((candidate, idx) => (
                    <div
                      key={candidate.id || candidate.email || idx}
                      className='flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 justify-between hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                          {/* Profile image placeholder */}
                          <svg
                            width='32'
                            height='32'
                            fill='none'
                            viewBox='0 0 32 32'
                          >
                            <rect
                              width='32'
                              height='32'
                              rx='8'
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
                        <div className='flex-1'>
                          <div
                            className='font-semibold text-base text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer'
                            onClick={() => handleCandidateClick(candidate)}
                          >
                            {candidate.firstName && candidate.lastName
                              ? `${candidate.firstName} ${candidate.middleName ? candidate.middleName + ' ' : ''}${candidate.lastName}`
                              : candidate.email || 'Unknown Candidate'}
                          </div>
                          <div className='text-gray-500 dark:text-gray-400 text-sm'>
                            {candidate.profileHeadLine ||
                              candidate.alertConfiguration?.jobTitle ||
                              'No title specified'}
                          </div>
                          <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-1'>
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
                            {candidate.preferredJobLocation &&
                            candidate.preferredJobLocation.length > 0
                              ? candidate.preferredJobLocation.join(', ')
                              : candidate.address?.city ||
                                candidate.address?.state ||
                                'Location not specified'}
                            {candidate.yearOfExperience !== undefined && (
                              <>
                                <span>•</span>
                                {candidate.yearOfExperience}{' '}
                                {parseInt(candidate.yearOfExperience) === 1
                                  ? 'year'
                                  : 'years'}{' '}
                                experience
                              </>
                            )}
                          </div>
                          <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-1'>
                            {candidate.highestLevelOfEducation && (
                              <>
                                <svg
                                  width='16'
                                  height='16'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    d='M12 14l9-5-9-5-9 5 9 5z'
                                    strokeWidth='2'
                                  />
                                  <path
                                    d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                                    strokeWidth='2'
                                  />
                                </svg>
                                {candidate.highestLevelOfEducation}
                              </>
                            )}
                            {candidate.salaryExpectations && (
                              <>
                                <span>•</span>$
                                {candidate.salaryExpectations.toLocaleString()}
                                /year
                              </>
                            )}
                            {candidate.aiGeneratedJobFitScore && (
                              <>
                                <span>•</span>
                                <span className='flex items-center gap-1'>
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
                                  {candidate.aiGeneratedJobFitScore}% match
                                </span>
                              </>
                            )}
                          </div>
                          {candidate.technicalSkills &&
                            candidate.technicalSkills.length > 0 && (
                              <div className='flex flex-wrap gap-1 mt-2'>
                                {candidate.technicalSkills
                                  .slice(0, 3)
                                  .map((skill: string, skillIdx: number) => (
                                    <span
                                      key={skillIdx}
                                      className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full'
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {candidate.technicalSkills.length > 3 && (
                                  <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full'>
                                    +{candidate.technicalSkills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          className={`border border-gray-200 dark:border-gray-600 rounded p-2 transition-colors ${
                            savedCandidates.has(candidate.id)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'hover:bg-blue-600 hover:text-white bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}
                          onClick={() => handleSaveCandidateClick(candidate)}
                          title={
                            savedCandidates.has(candidate.id)
                              ? 'Remove from saved'
                              : 'Save candidate'
                          }
                        >
                          <FiBookmark
                            className={`w-4 h-4 ${savedCandidates.has(candidate.id) ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          className='px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition hover:bg-blue-600 hover:text-white bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          onClick={() => handleCandidateClick(candidate)}
                        >
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
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {!loading && candidates.length > 0 && (
                <div className='flex justify-between items-center mt-8 px-4 py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(
                        currentPage * pageSize,
                        totalCandidates || candidates.length,
                      )}{' '}
                      of {totalCandidates || candidates.length} candidates
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                        if (user) handleSearch(true);
                      }}
                      className='border border-gray-200 dark:border-gray-600 rounded-md w-36 px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-white text-sm'
                    >
                      <option value={6}>6 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </select>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          if (user) handleSearch(true);
                        }
                      }}
                      disabled={currentPage === 1}
                      className='px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                    >
                      Previous
                    </button>

                    <div className='flex items-center gap-1'>
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            Math.ceil(
                              (totalCandidates || candidates.length) / pageSize,
                            ),
                          ),
                        },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                if (user) handleSearch(true);
                              }}
                              className={`px-3 py-1 rounded-md text-sm ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() => {
                        const maxPage = Math.ceil(
                          (totalCandidates || candidates.length) / pageSize,
                        );
                        if (currentPage < maxPage) {
                          setCurrentPage(currentPage + 1);
                          if (user) handleSearch(true);
                        }
                      }}
                      disabled={
                        currentPage >=
                        Math.ceil(
                          (totalCandidates || candidates.length) / pageSize,
                        )
                      }
                      className='px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal for candidate detail */}
      {showModal && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={handleCloseModal}
          onSave={handleSaveCandidateClick}
          isSaved={
            selectedCandidate
              ? savedCandidates.has(selectedCandidate.id)
              : false
          }
        />
      )}

      {/* Save Candidate Modal */}
      <SaveCandidateModal
        isOpen={showSaveModal}
        onClose={handleSaveModalClose}
        onSave={handleSaveCandidate}
        candidateName={
          candidateToSave?.firstName && candidateToSave?.lastName
            ? `${candidateToSave.firstName} ${candidateToSave.middleName ? candidateToSave.middleName + ' ' : ''}${candidateToSave.lastName}`
            : candidateToSave?.email || 'Unknown Candidate'
        }
        isSaving={isSaving}
      />
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
    <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='text-4xl mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold mb-3 dark:text-white'>{title}</h3>
      <p className='text-gray-600 dark:text-gray-300'>{description}</p>
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
      <h3 className='text-xl font-semibold mb-2 dark:text-white'>{title}</h3>
      <p className='text-gray-600 dark:text-gray-300'>{description}</p>
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
      className={`bg-white dark:bg-gray-800 p-8 rounded-lg ${highlighted ? 'ring-2 ring-blue-600 dark:ring-blue-400' : 'shadow-sm'}`}
    >
      <h3 className='text-2xl font-bold mb-2 dark:text-white'>{title}</h3>
      <div className='text-3xl font-bold mb-6 dark:text-white'>{price}</div>
      <ul className='space-y-3'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-center dark:text-gray-300'>
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
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        } transition-colors`}
      >
        Get Started
      </button>
    </div>
  );
}
