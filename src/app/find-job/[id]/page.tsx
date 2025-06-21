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
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import { sanitizeHtml } from '@/utils/sanitize';
import { useToast } from '@/contexts/ToastContext';

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
            <Card className='mb-6 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm'>
              <div className='flex items-center gap-6'>
                {job.companyLogo && (
                  <img
                    src={job.companyLogo.path}
                    alt={job.companyName}
                    className='w-20 h-20 object-contain'
                  />
                )}
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-2xl font-semibold text-gray-800'>
                      {job.title}
                    </span>
                    <Badge
                      variant='outline'
                      className='text-blue-600 border-blue-200 bg-blue-50'
                    >
                      {job.employmentType}
                    </Badge>
                  </div>
                  <div className='flex flex-wrap gap-4 text-gray-500 text-sm items-center'>
                    <span className='flex items-center gap-1'>
                      <Globe className='w-4 h-4' />
                      {job.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Mail className='w-4 h-4' />
                      {job.applicationURL}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 min-w-[220px]'>
                <div className='flex gap-2 w-full justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    className={`border-gray-200 ${job.isFavorited ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                    onClick={() =>
                      job.isFavorited
                        ? handleUnfavoriteJob()
                        : handleFavoriteJob()
                    }
                  >
                    <Heart className='w-5 h-5' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className={`border-gray-200 ${job.isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                    onClick={() =>
                      job.isSaved ? handleUnsaveJob() : handleSaveJob()
                    }
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
                  Job expires in:{' '}
                  <span className='font-semibold'>
                    {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </span>
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
                    <div>{new Date(job.postedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500'>⏰</span>{' '}
                  <div>
                    <div className='text-xs text-gray-400'>JOB EXPIRE IN:</div>
                    <div>{new Date(job.deadline).toLocaleDateString()}</div>
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
