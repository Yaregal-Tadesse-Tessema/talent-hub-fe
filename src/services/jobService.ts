import { JobsResponse, Job } from '@/types/job';
import { api } from '@/config/api';

export interface JobPosting {
  title: string;
  description: string;
  position: string;
  industry: string;
  type: string;
  city: string;
  location: string;
  employmentType: string;
  salaryRange: {
    min: string;
    max: string;
  };
  deadline: string;
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: string;
  gender: string;
  minimumGPA: string;
  postedDate: string;
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate: string;
  jobPostRequirement: string[];
  positionNumbers: string;
  paymentType: string;
}

export const jobService = {
  async getJobs(): Promise<JobsResponse> {
    try {
      const response = await api.get('/jobs/get-all-tenant-job-postings');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  async getArchivedJobs(): Promise<JobsResponse> {
    try {
      const response = await api.get('/jobs/archived/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching archived jobs:', error);
      throw error;
    }
  },

  async restoreJob(id: string): Promise<void> {
    try {
      await api.patch(`/jobs/restore/${id}`);
    } catch (error) {
      console.error('Error restoring job:', error);
      throw error;
    }
  },

  async createJobPosting(jobData: JobPosting) {
    try {
      const response = await api.post('/jobs/create-job-posting', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  },
};
