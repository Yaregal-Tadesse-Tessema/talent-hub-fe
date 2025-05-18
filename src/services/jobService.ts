import { JobsResponse, Job } from '@/types/job';
import { api } from '@/config/api';

export const jobService = {
  async getJobs(): Promise<JobsResponse> {
    try {
      const response = await api.get('/jobs/get-all-job-postings');
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
};
