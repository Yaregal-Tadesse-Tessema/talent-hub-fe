'use client';
import React, { useEffect, useState } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
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
  Heart,
} from 'lucide-react';
import { ApplyJobModal } from '@/components/ui/ApplyJobModal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { sanitizeHtml } from '@/utils/sanitize';
import { useToast } from '@/contexts/ToastContext';
import { ShareButton } from '@/components/ui/ShareButton';

// Helper function to check if a job is expired
const isJobExpired = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  return deadlineDate < currentDate;
};

interface UserData {
  id: string;
  profile?: {
    cv?: string;
  };
  resume?: {
    path?: string;
    filename?: string;
  };
}

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    // Check if apply parameter is present
    if (searchParams && searchParams.get('apply') === 'true') {
      setIsApplyOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobById(resolvedParams.id);
        console.log(response);
        setJob(response);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to fetch job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams.id]);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          id: parsedUser.id,
          profile: parsedUser.profile,
          resume: parsedUser.resume,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleSaveJob = async () => {
    if (!userData?.id) {
      showToast({ type: 'error', message: 'Please login to save jobs' });
      return;
    }

    try {
      await jobService.saveJob(job!.id, userData.id);
      setJob((prev) => (prev ? { ...prev, isSaved: true } : null));
      showToast({ type: 'success', message: 'Job saved successfully' });
    } catch (error) {
      console.error('Error saving job:', error);
      showToast({ type: 'error', message: 'Failed to save job' });
    }
  };

  const handleUnsaveJob = async () => {
    if (!userData?.id) {
      showToast({ type: 'error', message: 'Please login to unsave jobs' });
      return;
    }

    try {
      await jobService.unsaveJob(job!.id, userData.id);
      setJob((prev) => (prev ? { ...prev, isSaved: false } : null));
      showToast({ type: 'success', message: 'Job unsaved successfully' });
    } catch (error) {
      console.error('Error unsaving job:', error);
      showToast({ type: 'error', message: 'Failed to unsave job' });
    }
  };

  const handleFavoriteJob = async () => {
    if (!userData?.id) {
      showToast({ type: 'error', message: 'Please login to favorite jobs' });
      return;
    }

    try {
      await jobService.favoriteJob(job!.id, userData.id);
      setJob((prev) => (prev ? { ...prev, isFavorited: true } : null));
      showToast({ type: 'success', message: 'Job favorited successfully' });
    } catch (error) {
      console.error('Error favoriting job:', error);
      showToast({ type: 'error', message: 'Failed to favorite job' });
    }
  };

  const handleUnfavoriteJob = async () => {
    if (!userData?.id) {
      showToast({ type: 'error', message: 'Please login to unfavorite jobs' });
      return;
    }

    try {
      // TODO: Replace job!.id with the correct favoriteId when available
      // await jobService.unfavoriteJob(job!.id, userData.id);
      // The API expects only the favoriteId, not jobId
      // If you have job.favoriteId, use that:
      // await jobService.unfavoriteJob(job!.favoriteId);
      showToast({
        type: 'success',
        message: 'Job unfavorited successfully (mocked)',
      });
      setJob((prev) => (prev ? { ...prev, isFavorited: false } : null));
    } catch (error) {
      console.error('Error unfavoriting job:', error);
      showToast({ type: 'error', message: 'Failed to unfavorite job' });
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-red-500'>{error || 'Job not found'}</div>
      </div>
    );
  }

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
            <Card className='mb-6 p-6 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50'>
              <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                {/* Company Logo and Basic Info */}
                <div className='flex items-start gap-4 flex-1'>
                  {job.companyLogo && (
                    <div className='flex-shrink-0'>
                      <img
                        src={job.companyLogo.path}
                        alt={job.companyName}
                        className='w-16 h-16 lg:w-20 lg:h-20 object-contain rounded-lg border border-gray-200 bg-white p-2 shadow-sm'
                      />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-wrap items-center gap-2 mb-3'>
                      <h1 className='text-xl lg:text-2xl font-bold text-gray-900 leading-tight'>
                        {job.title}
                      </h1>
                      <div className='flex flex-wrap gap-2'>
                        <Badge
                          variant='outline'
                          className='text-blue-600 border-blue-200 bg-blue-50 font-medium'
                        >
                          {job.employmentType}
                        </Badge>
                        {isJobExpired(job.deadline) && (
                          <Badge
                            variant='outline'
                            className='text-red-600 border-red-200 bg-red-50 font-medium'
                          >
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Company and Location Info */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-gray-700 font-medium'>
                        <span className='truncate'>{job.companyName}</span>
                        <ShareButton />
                      </div>
                      <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                        <span className='flex items-center gap-1.5'>
                          <Globe className='w-4 h-4 text-gray-400' />
                          <span className='truncate'>{job.location}</span>
                        </span>
                        <span className='flex items-center gap-1.5'>
                          <Mail className='w-4 h-4 text-gray-400' />
                          <span className='truncate max-w-[200px]'>
                            {job.applicationURL}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons and Deadline */}
                <div className='flex flex-col gap-4 lg:items-end lg:min-w-[280px]'>
                  {/* Action Buttons */}
                  <div className='flex items-center gap-2 w-full lg:justify-end'>
                    {userData && (
                      <>
                        <Tooltip
                          content={
                            job.isFavorited
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                          position='top'
                        >
                          <Button
                            variant='outline'
                            size='sm'
                            className={`h-10 px-3 border-gray-200 hover:border-red-300 transition-colors ${
                              job.isFavorited
                                ? 'text-red-600 bg-red-50 border-red-200'
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            onClick={() =>
                              job.isFavorited
                                ? handleUnfavoriteJob()
                                : handleFavoriteJob()
                            }
                          >
                            <Heart
                              className={`w-4 h-4 ${job.isFavorited ? 'fill-current' : ''}`}
                            />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            job.isSaved ? 'Remove from saved jobs' : 'Save job'
                          }
                          position='top'
                        >
                          <Button
                            variant='outline'
                            size='sm'
                            className={`h-10 px-3 border-gray-200 hover:border-blue-300 transition-colors ${
                              job.isSaved
                                ? 'text-blue-600 bg-blue-50 border-blue-200'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            onClick={() =>
                              job.isSaved ? handleUnsaveJob() : handleSaveJob()
                            }
                          >
                            <Bookmark
                              className={`w-4 h-4 ${job.isSaved ? 'fill-current' : ''}`}
                            />
                          </Button>
                        </Tooltip>
                      </>
                    )}

                    <Button
                      className={`h-10 px-6 font-semibold transition-all ${
                        isJobExpired(job.deadline) || job.isApplied
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                      onClick={() => {
                        if (isJobExpired(job.deadline)) {
                          showToast({
                            type: 'error',
                            message:
                              'This job has expired and is no longer accepting applications',
                          });
                          return;
                        }
                        if (job.isApplied) {
                          showToast({
                            type: 'error',
                            message: 'You have already applied to this job',
                          });
                          return;
                        }
                        setIsApplyOpen(true);
                      }}
                      disabled={isJobExpired(job.deadline) || job.isApplied}
                    >
                      {isJobExpired(job.deadline)
                        ? 'Job Expired'
                        : job.isApplied
                          ? 'Applied'
                          : 'Apply Now'}
                    </Button>
                  </div>

                  {/* Deadline Info */}
                  <div
                    className={`text-sm text-center lg:text-right ${
                      isJobExpired(job.deadline)
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <div className='flex items-center gap-1.5 justify-center lg:justify-end'>
                      <span className='text-red-500'>⏰</span>
                      <span className='font-medium'>
                        {isJobExpired(job.deadline)
                          ? 'Expired on '
                          : 'Expires on '}
                        {new Date(job.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            {/* Description */}
            <Card className='mb-6 p-8'>
              <div className='font-semibold text-lg mb-2'>Job Description</div>
              <div
                className='text-gray-600 prose prose-sm max-w-none'
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(job.description),
                }}
              />
              <div className='font-semibold text-lg mb-2 mt-8'>
                Responsibilities
              </div>
              <ul className='list-disc pl-6 text-gray-600 space-y-1 mb-6'>
                {job.responsibilities?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className='font-semibold text-lg mb-2'>Requirements</div>
              <ul className='list-disc pl-6 text-gray-600 space-y-1 mb-6'>
                {job.jobPostRequirement?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className='font-semibold text-lg mb-2'>Benefits</div>
              <ul className='list-disc pl-6 text-gray-600 space-y-1 mb-6'>
                {job.benefits?.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
              <div className='flex gap-2 items-center mt-4'>
                <span>Share this job:</span>
                <ShareButton />
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
                    <div>{new Date(job.postedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>⏰</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>
                      {isJobExpired(job.deadline)
                        ? 'JOB EXPIRED ON:'
                        : 'JOB EXPIRE IN:'}
                    </div>
                    <div
                      className={`${
                        isJobExpired(job.deadline)
                          ? 'text-red-500 font-semibold'
                          : ''
                      }`}
                    >
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>🎓</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>EDUCATION</div>
                    <div>{job.educationLevel}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>💰</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>SALARY:</div>
                    <div>
                      {job.salaryRange?.min || 'N/A'} -{' '}
                      {job.salaryRange?.max || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>📍</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>LOCATION:</div>
                    <div>{job.location}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>💼</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>JOB TYPE:</div>
                    <div>{job.employmentType}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>🧑‍💼</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>EXPERIENCE</div>
                    <div>{job.experienceLevel}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>📚</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>FIELD OF STUDY</div>
                    <div>{job.fieldOfStudy}</div>
                  </div>
                </div>
              </div>
            </Card>
            {/* Company Info */}
            <Card className='p-6'>
              <div className='flex items-center gap-3 mb-2'>
                {job.companyLogo && (
                  <img
                    src={job.companyLogo.path}
                    alt={job.companyName}
                    className='w-12 h-12 object-contain'
                  />
                )}
                <div>
                  <div className='font-semibold'>{job.companyName}</div>
                  <div className='text-xs text-gray-400'>{job.industry}</div>
                </div>
              </div>
              <div className='text-sm text-gray-600 space-y-1 mb-3'>
                <div className='flex justify-between'>
                  <span>Position:</span>
                  <span>{job.position}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Industry:</span>
                  <span>{job.industry}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Position Numbers:</span>
                  <span>{job.positionNumbers}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Payment Type:</span>
                  <span>{job.paymentType}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Application URL:</span>
                  <span className='truncate max-w-[120px] inline-block align-bottom'>
                    <a
                      href={job.applicationURL}
                      className='text-blue-600 hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {job.applicationURL}
                    </a>
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <ApplyJobModal
        open={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobTitle={job.title}
        jobId={job.id}
        userData={userData}
      />
    </main>
  );
}
