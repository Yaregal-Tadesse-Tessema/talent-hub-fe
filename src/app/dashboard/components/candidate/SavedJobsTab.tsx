import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { jobService } from '@/services/jobService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { SavedJobsResponse, Job } from '@/types/job';
import {
  Bookmark,
  MapPin,
  Clock,
  Building,
  DollarSign,
  ExternalLink,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function SavedJobsTab() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getSavedJobs();
      console.log('Saved jobs response:', response);

      // The response now has the structure { total: number, items: SavedJob[] }
      if (response && Array.isArray(response.items)) {
        // Transform SavedJob[] to Job[] format by extracting jobPosting data
        const transformedJobs: Job[] = response.items.map((savedJob) => ({
          ...savedJob.jobPosting,
          // Use the unique SavedJob ID to avoid duplicate keys
          id: savedJob.id,
          jobPostId: savedJob.jobPostId,
          requirementId: savedJob.jobPosting.id, // Use job posting ID as requirement ID
          // Convert string minimumGPA to number to match Job interface
          minimumGPA: parseFloat(savedJob.jobPosting.minimumGPA) || 0,
          // Ensure companyName is not null
          companyName: savedJob.jobPosting.companyName || '',
          // Add properties that Job interface expects but SavedJobPosting might not have
          isSaved: true,
          isFavorited: false, // Default value since we don't have this info
          isApplied: false, // Default value since we don't have this info
          applications: [],
          savedUsers: [],
          preScreeningQuestions: [],
          companyLogo: savedJob.jobPosting.companyLogo
            ? {
                filename: '',
                path: savedJob.jobPosting.companyLogo,
                originalname: '',
                mimetype: 'image/*',
                size: 0,
                bucketName: '',
              }
            : {
                filename: '',
                path: '',
                originalname: '',
                mimetype: '',
                size: 0,
                bucketName: '',
              },
          jobPostRequirement: savedJob.jobPosting.jobPostRequirement || [],
          experienceLevel: savedJob.jobPosting.experienceLevel || '',
          fieldOfStudy: savedJob.jobPosting.fieldOfStudy || '',
          educationLevel: savedJob.jobPosting.educationLevel || '',
          howToApply: savedJob.jobPosting.howToApply || '',
          onHoldDate: savedJob.jobPosting.onHoldDate || '',
          applicationCount: savedJob.jobPosting.applicationCount || 0,
          positionNumbers: savedJob.jobPosting.positionNumbers || 1,
          paymentType: savedJob.jobPosting.paymentType || '',
          createdAt: savedJob.jobPosting.createdAt,
          updatedAt: savedJob.jobPosting.updatedAt,
        }));
        setSavedJobs(transformedJobs);
      } else {
        console.warn('Unexpected response format:', response);
        setSavedJobs([]);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setSavedJobs([]); // Ensure we always have an array
      showToast({
        type: 'error',
        message: 'Failed to fetch saved jobs',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const handleUnsaveJob = async (jobId: string) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please login to unsave jobs' });
      return;
    }

    try {
      // Find the job to get the jobPostId for the API call
      const jobToUnsave = savedJobs.find((job) => job.id === jobId);

      if (!jobToUnsave || !jobToUnsave.jobPostId) {
        showToast({
          type: 'error',
          message: 'Job not found or invalid job data',
        });
        return;
      }

      await jobService.unsaveJob(jobToUnsave.jobPostId, user.id);
      setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
      showToast({ type: 'success', message: 'Job removed from saved' });
    } catch (error) {
      console.error('Error unsaving job:', error);
      showToast({ type: 'error', message: 'Failed to remove job from saved' });
    }
  };

  const handleFavoriteJob = async (jobId: string) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please login to favorite jobs' });
      return;
    }

    try {
      // Find the job to get the jobPostId for the API call
      const jobToFavorite = savedJobs.find((job) => job.id === jobId);

      if (!jobToFavorite || !jobToFavorite.jobPostId) {
        showToast({
          type: 'error',
          message: 'Job not found or invalid job data',
        });
        return;
      }

      await jobService.favoriteJob(jobToFavorite.jobPostId, user.id);
      setSavedJobs(
        savedJobs.map((job) =>
          job.id === jobId ? { ...job, isFavorited: true } : job,
        ),
      );
      showToast({ type: 'success', message: 'Job added to favorites' });
    } catch (error) {
      console.error('Error favoriting job:', error);
      showToast({ type: 'error', message: 'Failed to favorite job' });
    }
  };

  const handleUnfavoriteJob = async (jobId: string) => {
    try {
      // Find the job to get the saved job ID for the unfavorite API call
      const jobToUnfavorite = savedJobs.find((job) => job.id === jobId);

      if (!jobToUnfavorite) {
        showToast({ type: 'error', message: 'Job not found' });
        return;
      }

      await jobService.unfavoriteJob(jobToUnfavorite.id); // Use the saved job ID as favorite ID
      setSavedJobs(
        savedJobs.map((job) =>
          job.id === jobId ? { ...job, isFavorited: false } : job,
        ),
      );
      showToast({ type: 'success', message: 'Job removed from favorites' });
    } catch (error) {
      console.error('Error unfavoriting job:', error);
      showToast({
        type: 'error',
        message: 'Failed to remove job from favorites',
      });
    }
  };

  const isJobExpired = (deadline: string): boolean => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate < currentDate;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading saved jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Saved Jobs
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {Array.isArray(savedJobs) ? savedJobs.length : 0} saved job
            {Array.isArray(savedJobs) && savedJobs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className='space-y-4'>
        {!Array.isArray(savedJobs) || savedJobs.length === 0 ? (
          <Card className='p-8 text-center'>
            <div className='text-gray-400 dark:text-gray-500 mb-4'>
              <Bookmark className='w-16 h-16 mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No saved jobs yet
            </h3>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              Save jobs you&apos;re interested in to view them here
            </p>
            <Link href='/find-job'>
              <Button>Browse Jobs</Button>
            </Link>
          </Card>
        ) : Array.isArray(savedJobs) ? (
          savedJobs.map((job) => {
            const isExpanded = expandedJobs.has(job.id);
            const isExpired = isJobExpired(job.deadline);

            return (
              <Card key={job.id} className='p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                  {/* Job Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>
                          {job.title}
                        </h3>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2'>
                          <Building className='w-4 h-4 flex-shrink-0' />
                          <span>
                            {job.companyName || 'Company not specified'}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                          <MapPin className='w-4 h-4 flex-shrink-0' />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 ml-4'>
                        <Tooltip
                          content={
                            job.isFavorited
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                          position='top'
                        >
                          <button
                            onClick={() =>
                              job.isFavorited
                                ? handleUnfavoriteJob(job.id)
                                : handleFavoriteJob(job.id)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              job.isFavorited
                                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                                : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${job.isFavorited ? 'fill-current' : ''}`}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip
                          content='Remove from saved jobs'
                          position='top'
                        >
                          <button
                            onClick={() => handleUnsaveJob(job.id)}
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-2'
                          >
                            <Bookmark className='w-4 h-4 fill-current' />
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                      {job.salaryRange && (
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                          <DollarSign className='w-4 h-4 flex-shrink-0' />
                          <span>
                            ${job.salaryRange.min} - ${job.salaryRange.max}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                        <Clock className='w-4 h-4 flex-shrink-0' />
                        <span>{job.employmentType}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                        <Clock className='w-4 h-4 flex-shrink-0' />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {isExpired && (
                        <Badge variant='destructive'>Expired</Badge>
                      )}
                      <Badge>Saved on {formatDate(job.createdAt)}</Badge>
                    </div>

                    {/* Expandable Description */}
                    <div className='mb-4'>
                      <button
                        onClick={() => toggleExpanded(job.id)}
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors'
                      >
                        {isExpanded ? 'Show Less' : 'Show Details'}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className='space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <div>
                          <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                            Job Description
                          </h4>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {job.description}
                          </p>
                        </div>

                        {job.jobPostRequirement &&
                          job.jobPostRequirement.length > 0 && (
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                Requirements
                              </h4>
                              <ul className='list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                                {job.jobPostRequirement.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {job.benefits && job.benefits.length > 0 && (
                          <div>
                            <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                              Benefits
                            </h4>
                            <ul className='list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                              {job.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col sm:flex-row gap-2 sm:ml-4'>
                    <Link href={`/find-job/${job.jobPostId}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full sm:w-auto'
                      >
                        View Details
                        <ExternalLink className='w-4 h-4 ml-2' />
                      </Button>
                    </Link>
                    {!isExpired && (
                      <Button
                        size='sm'
                        className='w-full sm:w-auto'
                        onClick={() => {
                          // Navigate to job application
                          window.open(`/find-job/${job.jobPostId}`, '_blank');
                        }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : null}
      </div>
    </div>
  );
}
