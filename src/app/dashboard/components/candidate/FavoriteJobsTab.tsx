import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  ArrowRight,
  Heart,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  Briefcase,
  Clock,
  Building,
  Globe,
  FileText,
  CheckCircle,
  Star,
} from 'lucide-react';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JobPost {
  id: string;
  title: string;
  position: string;
  positionNumbers: number;
  description: string;
  responsibilities: string[];
  jobPostRequirement: string[];
  benefits: string[];
  skill: string[];
  educationLevel: string;
  experienceLevel: string;
  fieldOfStudy: string;
  gender: string;
  minimumGPA: string;
  employmentType: string;
  type: string;
  industry: string;
  paymentType: string;
  salaryRange: {
    min: string;
    max: string;
  };
  location: string;
  city: string;
  postedDate: string;
  deadline: string;
  applicationURL: string;
  howToApply: string;
  applicationCount: number;
  isFeatured: boolean;
  status: string;
  companyName: string | null;
  companyLogo: string | null;
  organizationId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  onHoldDate: string | null;
}

interface Favourite {
  id: string;
  jobPostId: string;
  userId: string;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  jobPost: JobPost;
}

export default function FavoriteJobsTab() {
  const [jobs, setJobs] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jobToUnfavorite, setJobToUnfavorite] = useState<Favourite | null>(
    null,
  );
  const { showToast } = useToast();
  const router = useRouter();
  const itemsPerPage = 5; // Reduced for better UX with expanded view

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('User not logged in');
        }

        const userData = JSON.parse(storedUser);
        console.log(userData);
        const response = await jobService.getFavoriteJobs();
        const jobs = response?.items || [];
        console.log(jobs);

        setJobs(jobs);
        setTotalPages(Math.ceil((response?.total || 0) / itemsPerPage));
      } catch (err) {
        console.error('Error fetching favorite jobs:', err);
        setError('Failed to fetch favorite jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, []);

  const handleUnfavoriteJob = async (favourite: Favourite) => {
    setJobToUnfavorite(favourite);
    setShowConfirmDialog(true);
  };

  const confirmUnfavorite = async () => {
    if (!jobToUnfavorite) return;

    try {
      await jobService.unfavoriteJob(jobToUnfavorite.id);

      // Remove the job from the list
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobToUnfavorite.id),
      );

      // If the expanded job was the one being unfavorited, close it
      if (expandedJob === jobToUnfavorite.id) {
        setExpandedJob(null);
      }

      showToast({ type: 'success', message: 'Job removed from favorites' });
    } catch (error) {
      console.error('Error unfavoriting job:', error);
      showToast({
        type: 'error',
        message: 'Failed to remove job from favorites',
      });
    } finally {
      setShowConfirmDialog(false);
      setJobToUnfavorite(null);
    }
  };

  const cancelUnfavorite = () => {
    setShowConfirmDialog(false);
    setJobToUnfavorite(null);
  };

  const handleApplyClick = (jobId: string) => {
    router.push(`/find-job/${jobId}?apply=true`);
  };

  const toggleExpanded = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className='flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
            <p className='text-gray-600 dark:text-gray-400'>
              Loading favorite jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='text-red-500 dark:text-red-400 text-lg mb-2'>
              ⚠️
            </div>
            <div className='text-red-500 dark:text-red-400'>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  return (
    <div className='flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-gray-900 dark:text-white'>
          Favorite Jobs{' '}
          <span className='text-gray-400 dark:text-gray-500 font-normal text-lg sm:text-xl lg:text-2xl'>
            ({jobs.length})
          </span>
        </h1>
        <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
          Track and manage your favorite job opportunities
        </p>
      </div>

      <div className='space-y-4 sm:space-y-6'>
        {currentJobs.length === 0 ? (
          <div className='text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700'>
            <div className='text-gray-400 dark:text-gray-500 text-4xl mb-4'>
              ❤️
            </div>
            <h2 className='text-lg sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2'>
              No favorite jobs yet
            </h2>
            <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6'>
              Start favoriting jobs to see them here.
            </p>
            <button
              onClick={() => (window.location.href = '/jobs')}
              className='px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base'
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          currentJobs.map((favourite) => {
            const job = favourite.jobPost;
            const isExpanded = expandedJob === favourite.id;
            const daysRemaining = getDaysRemaining(job.deadline);
            const isExpired = daysRemaining < 0;

            return (
              <div
                key={favourite.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/50 overflow-hidden border border-gray-200 dark:border-gray-700'
              >
                {/* Job Header */}
                <div className='p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700'>
                  <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                    <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
                      <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-base sm:text-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex-shrink-0'>
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName || 'Company'}
                            className='w-6 h-6 sm:w-8 sm:h-8 rounded'
                          />
                        ) : (
                          job.companyName?.[0] || 'C'
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate'>
                            {job.title}
                          </h3>
                          {job.isFeatured && (
                            <Star className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 dark:text-yellow-400 fill-current' />
                          )}
                        </div>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2'>
                          {job.companyName}
                        </p>
                        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-3 h-3 sm:w-4 sm:h-4' />
                            <span className='truncate'>
                              {job.location}, {job.city}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <DollarSign className='w-3 h-3 sm:w-4 sm:h-4' />
                            <span>
                              ${job.salaryRange.min} - ${job.salaryRange.max}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-3 h-3 sm:w-4 sm:h-4' />
                            <span>{job.employmentType}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Users className='w-3 h-3 sm:w-4 sm:h-4' />
                            <span>{job.positionNumbers} position(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 sm:ml-4'>
                      <button
                        onClick={() => toggleExpanded(favourite.id)}
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors'
                      >
                        {isExpanded ? 'Show Less' : 'Show Details'}
                      </button>
                      <button
                        onClick={() => handleUnfavoriteJob(favourite)}
                        className='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors p-1 sm:p-2'
                      >
                        <Heart className='w-4 h-4 sm:w-5 sm:h-5 fill-current' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Job Details */}
                {isExpanded && (
                  <div className='p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                      {/* Left Column */}
                      <div className='space-y-4 sm:space-y-6'>
                        {/* Job Description */}
                        <div>
                          <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                            <FileText className='w-4 h-4 sm:w-5 sm:h-5' />
                            Job Description
                          </h4>
                          <div
                            className='text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert'
                            dangerouslySetInnerHTML={{
                              __html: job.description,
                            }}
                          />
                        </div>

                        {/* Responsibilities */}
                        {job.responsibilities &&
                          job.responsibilities.length > 0 && (
                            <div>
                              <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                                Responsibilities
                              </h4>
                              <ul className='space-y-2'>
                                {job.responsibilities.map(
                                  (responsibility, index) => (
                                    <li
                                      key={index}
                                      className='flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300'
                                    >
                                      <span className='w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0'></span>
                                      <span>{responsibility}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Requirements */}
                        {job.jobPostRequirement &&
                          job.jobPostRequirement.length > 0 && (
                            <div>
                              <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                                Requirements
                              </h4>
                              <ul className='space-y-2'>
                                {job.jobPostRequirement.map(
                                  (requirement, index) => (
                                    <li
                                      key={index}
                                      className='flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300'
                                    >
                                      <span className='w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0'></span>
                                      <span>{requirement}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* Right Column */}
                      <div className='space-y-4 sm:space-y-6'>
                        {/* Job Details */}
                        <div className='bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                          <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                            Job Details
                          </h4>
                          <div className='space-y-2 sm:space-y-3 text-xs sm:text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Industry:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.industry}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Experience Level:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.experienceLevel}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Education Level:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.educationLevel}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Field of Study:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.fieldOfStudy}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Minimum GPA:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.minimumGPA}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Gender:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.gender}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Payment Type:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.paymentType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        {job.skill && job.skill.length > 0 && (
                          <div>
                            <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                              <Briefcase className='w-4 h-4 sm:w-5 sm:h-5' />
                              Required Skills
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {job.skill.map((skill, index) => (
                                <span
                                  key={index}
                                  className='px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium'
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                          <div>
                            <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                              <Star className='w-4 h-4 sm:w-5 sm:h-5' />
                              Benefits
                            </h4>
                            <ul className='space-y-2'>
                              {job.benefits.map((benefit, index) => (
                                <li
                                  key={index}
                                  className='flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300'
                                >
                                  <span className='w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mt-2 flex-shrink-0'></span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Application Info */}
                        <div className='bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                          <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                            Application Info
                          </h4>
                          <div className='space-y-2 sm:space-y-3 text-xs sm:text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Posted:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {formatDate(job.postedDate)}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Deadline:
                              </span>
                              <span
                                className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                              >
                                {formatDate(job.deadline)}
                                {!isExpired && ` (${daysRemaining} days left)`}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Applications:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {job.applicationCount}
                              </span>
                            </div>
                            {job.status && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                  Status:
                                </span>
                                <span
                                  className={`font-medium px-2 py-1 rounded text-xs ${
                                    job.status === 'Active'
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                      : job.status === 'On Hold'
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* How to Apply */}
                    {job.howToApply && (
                      <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700'>
                        <h4 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                          How to Apply
                        </h4>
                        <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3'>
                          {job.howToApply}
                        </p>
                        {job.applicationURL && (
                          <a
                            href={job.applicationURL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm'
                          >
                            <Globe className='w-3 h-3 sm:w-4 sm:h-4' />
                            Apply via External Link
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className='mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-end gap-3'>
                      {isExpired ? (
                        <button className='w-full sm:w-auto px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed text-sm'>
                          Deadline Expired
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyClick(job.id)}
                          className='w-full sm:w-auto px-4 py-2 rounded-lg font-medium bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm'
                        >
                          Apply Now{' '}
                          <ArrowRight size={14} className='sm:w-4 sm:h-4' />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Collapsed View Actions */}
                {!isExpanded && (
                  <div className='p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                      <span>Posted: {formatDate(job.postedDate)}</span>
                      <span className='hidden sm:inline'>•</span>
                      <span
                        className={
                          isExpired
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }
                      >
                        Deadline: {formatDate(job.deadline)}
                        {!isExpired && ` (${daysRemaining} days left)`}
                      </span>
                      {job.status && (
                        <>
                          <span className='hidden sm:inline'>•</span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              job.status === 'Active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : job.status === 'On Hold'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}
                          >
                            {job.status}
                          </span>
                        </>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      {isExpired ? (
                        <button className='w-full sm:w-auto px-3 sm:px-4 py-2 rounded font-medium bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed text-xs sm:text-sm'>
                          Deadline Expired
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyClick(job.id)}
                          className='w-full sm:w-auto px-3 sm:px-4 py-2 rounded font-medium bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-xs sm:text-sm'
                        >
                          Apply Now{' '}
                          <ArrowRight size={14} className='sm:w-4 sm:h-4' />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-6 sm:mt-8'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <button
              className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-semibold transition-colors text-sm ${
                  page === currentPage
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white'>
              Remove from Favorites
            </h2>
            <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6'>
              Are you sure you want to remove "{jobToUnfavorite?.jobPost.title}"
              from your favorites?
            </p>
            <div className='flex flex-col sm:flex-row justify-end gap-2 sm:gap-3'>
              <button
                onClick={cancelUnfavorite}
                className='w-full sm:w-auto px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm'
              >
                Cancel
              </button>
              <button
                onClick={confirmUnfavorite}
                className='w-full sm:w-auto px-4 py-2 rounded-lg font-medium bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
