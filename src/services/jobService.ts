import { JobsResponse, Job } from '@/types/job';
import { api, API_BASE_URL } from '@/config/api';

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
  async getJobs(queryParams?: string): Promise<JobsResponse> {
    try {
      const url = queryParams
        ? `/jobs/get-all-tenant-job-postings?${queryParams}`
        : '/jobs/get-all-tenant-job-postings';

      const response = await api.get(url);

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

  async deleteJob(id: string): Promise<void> {
    try {
      await api.delete(`/jobs/${id}`);
    } catch (error) {
      console.error('Error deleting job:', error);
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
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }

      const userData = JSON.parse(storedUser);
      if (!userData.tenantId) {
        throw new Error('Tenant ID not found in user data');
      }

      console.log(userData);
      const response = await api.post('/jobs/create-job-posting', {
        ...jobData,
        organizationId: userData.tenantId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  },

  async updateJobPosting(jobData: Partial<JobPosting>) {
    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }

      const userData = JSON.parse(storedUser);
      if (!userData.tenantId) {
        throw new Error('Tenant ID not found in user data');
      }

      const response = await api.put(`/jobs/update-job-posting`, {
        ...jobData,
        organizationId: userData.tenantId,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating job posting:', error);
      throw error;
    }
  },

  async getPublicJobs(): Promise<JobsResponse> {
    try {
      const response = await api.get(
        '/jobs/get-all-public-job-postings?status=Posted',
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      throw error;
    }
  },

  async searchJobs(
    title?: string,
    location?: string,
    category?: string,
  ): Promise<JobsResponse> {
    try {
      let queryParams = '';
      const conditions = [];
      if (title) {
        conditions.push(`title:ILIKE:${title.toLowerCase()}`);
      }
      if (location) {
        conditions.push(`location:ILIKE:${location.toLowerCase()}`);
        conditions.push(`city:ILIKE:${location.toLowerCase()}`);
      }
      if (category) {
        conditions.push(`employmentType:ILIKE:${category.toLowerCase()}`);
      }
      if (conditions.length > 0) {
        queryParams = `q=w=${conditions.join(',')}`;
      }

      const response = await api.get(
        `/jobs/get-all-public-job-postings?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  async saveJob(jobPostId: string, userId: string): Promise<void> {
    try {
      await api.put('/save-jobs/save-job-post', {
        jobPostId,
        userId,
      });
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async unsaveJob(jobPostId: string, userId: string): Promise<void> {
    try {
      await api.put('/save-jobs/unsave-job-post', {
        jobPostId,
        userId,
      });
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  async favoriteJob(
    jobPostId: string,
    userId: string,
    remark?: string,
  ): Promise<void> {
    try {
      await api.post('/user-favorite-jobs', {
        jobPostId,
        userId,
        remark: remark || '',
      });
    } catch (error) {
      console.error('Error favoriting job:', error);
      throw error;
    }
  },

  async unfavoriteJob(favouriteId: string): Promise<void> {
    try {
      await api.delete(`/user-favorite-jobs/${favouriteId}`);
    } catch (error) {
      console.error('Error unfavoriting job:', error);
      throw error;
    }
  },

  async getFavoriteJobs(): Promise<any> {
    try {
      const response = await api.get(`/user-favorite-jobs?q=i=jobPost
`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite jobs:', error);
      throw error;
    }
  },

  async changeJobStatus(
    jobId: string,
    status: 'Withdrawn' | 'Posted',
  ): Promise<void> {
    try {
      await api.put('/jobs/change-job-post-status', {
        id: jobId,
        status: status,
      });
    } catch (error) {
      console.error('Error changing job status:', error);
      throw error;
    }
  },
  async getActiveJobPosts(): Promise<number> {
    try {
      const response = await api.get('/jobs/get-active-job-post/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching active job posts:', error);
      throw error;
    }
  },

  async getJobStats(): Promise<any> {
    try {
      const response = await api.get('/jobs/get-job-title/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching active job posts:', error);
      throw error;
    }
  },
};
