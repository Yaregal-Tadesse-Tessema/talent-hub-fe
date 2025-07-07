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

  async getJobsByTenant(
    tenantId: string,
    page?: number,
    limit?: number,
  ): Promise<JobsResponse> {
    try {
      let queryParams = `tenantId=${tenantId}&status=Posted`;
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `&t=${limit}&sk=${skip}`;
      }

      const response = await api.get(
        `/jobs/get-all-tenant-job-postings?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs by tenant:', error);
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

  async getPublicJobs(page?: number, limit?: number): Promise<JobsResponse> {
    try {
      let queryParams = 'q=w=status:=:Posted';
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `%26t=${limit}%26sk=${skip}`;
      }

      const response = await api.get(
        `/jobs/get-all-public-job-postings?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      throw error;
    }
  },

  async getJobsForUser(page?: number, limit?: number): Promise<JobsResponse> {
    try {
      // Check if user is logged in
      const storedUser = localStorage.getItem('user');
      const isAuthenticated = !!storedUser;

      if (isAuthenticated) {
        // Use tenant endpoint for authenticated users
        let queryParams = 'q=w=status:=:Posted';
        if (page && limit) {
          const skip = (page - 1) * limit;
          queryParams += `%26t=${limit}%26sk=${skip}`;
        }

        const response = await api.get(
          `/jobs/get-all-tenant-job-postings?${queryParams}`,
        );
        return response.data;
      } else {
        // Use public endpoint for non-authenticated users
        return this.getPublicJobs(page, limit);
      }
    } catch (error) {
      console.error('Error fetching jobs for user:', error);
      throw error;
    }
  },

  async searchJobs(
    title?: string,
    category?: string,
    page?: number,
    limit?: number,
  ): Promise<JobsResponse> {
    try {
      let queryParams = '';
      const conditions = ['status:=:Posted']; // Always include Posted status

      if (title) {
        conditions.push(`title:LIKE:${title}`);
      }
      if (category) {
        conditions.push(`employmentType:LIKE:${category}`);
      }

      queryParams = `q=w=${conditions.join(',')}`;

      // Add pagination parameters
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `%26t=${limit}%26sk=${skip}`;
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

  async searchJobsForUser(
    title?: string,
    category?: string,
    page?: number,
    limit?: number,
  ): Promise<JobsResponse> {
    try {
      // Check if user is logged in
      const storedUser = localStorage.getItem('user');
      const isAuthenticated = !!storedUser;

      let queryParams = '';
      const conditions = ['status:=:Posted']; // Always include Posted status

      if (title) {
        conditions.push(`title:LIKE:${title}`);
      }
      if (category) {
        conditions.push(`employmentType:LIKE:${category}`);
      }

      queryParams = `q=w=${conditions.join(',')}`;

      // Add pagination parameters
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `%26t=${limit}%26sk=${skip}`;
      }

      const endpoint = isAuthenticated
        ? '/jobs/get-all-tenant-job-postings'
        : '/jobs/get-all-public-job-postings';

      const response = await api.get(`${endpoint}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error searching jobs for user:', error);
      throw error;
    }
  },

  async searchJobsWithAdvancedFilters(
    filters: {
      title?: string;
      category?: string;
      experienceLevel?: string;
      salaryRange?: { min: number; max: number };
      employmentType?: string[];
      educationLevel?: string;
      industry?: string;
      location?: string;
      skills?: string[];
      gender?: string;
      minimumGPA?: number;
      fieldOfStudy?: string;
      positionNumbers?: number;
      paymentType?: string;
    },
    page?: number,
    limit?: number,
  ): Promise<JobsResponse> {
    try {
      let queryParams = '';
      const conditions = ['status:=:Posted']; // Always include Posted status

      // Basic filters
      if (filters.title) {
        conditions.push(`title:LIKE:${filters.title}`);
      }
      if (filters.category) {
        conditions.push(`employmentType:LIKE:${filters.category}`);
      }

      // Advanced filters
      if (filters.experienceLevel) {
        conditions.push(`experienceLevel:LIKE:${filters.experienceLevel}`);
      }
      if (filters.educationLevel) {
        conditions.push(`educationLevel:LIKE:${filters.educationLevel}`);
      }
      if (filters.industry) {
        conditions.push(`industry:LIKE:${filters.industry}`);
      }
      if (filters.location) {
        conditions.push(`location:LIKE:${filters.location}`);
      }
      if (filters.gender && filters.gender !== 'Any') {
        conditions.push(`gender:LIKE:${filters.gender}`);
      }
      if (filters.fieldOfStudy) {
        conditions.push(`fieldOfStudy:LIKE:${filters.fieldOfStudy}`);
      }
      if (filters.paymentType) {
        conditions.push(`paymentType:LIKE:${filters.paymentType}`);
      }

      // Numeric filters
      if (filters.minimumGPA && filters.minimumGPA > 0) {
        conditions.push(`minimumGPA:gte:${filters.minimumGPA}`);
      }
      if (filters.positionNumbers && filters.positionNumbers > 0) {
        conditions.push(`positionNumbers:gte:${filters.positionNumbers}`);
      }

      // Salary range filter - handle min and max separately
      if (filters.salaryRange && filters.salaryRange.min > 0) {
        conditions.push(`salaryRange.min:gte:${filters.salaryRange.min}`);
      }
      if (filters.salaryRange && filters.salaryRange.max > 0) {
        conditions.push(`salaryRange.max:lte:${filters.salaryRange.max}`);
      }

      // Employment type array filter
      if (filters.employmentType && filters.employmentType.length > 0) {
        // For multiple employment types, we need to handle them as separate conditions
        filters.employmentType.forEach((type) => {
          conditions.push(`employmentType:LIKE:${type}`);
        });
      }

      // Skills array filter
      if (filters.skills && filters.skills.length > 0) {
        // For multiple skills, we need to handle them as separate conditions
        filters.skills.forEach((skill) => {
          conditions.push(`skill:LIKE:${skill}`);
        });
      }

      queryParams = `q=w=${conditions.join(',')}`;

      // Add pagination parameters
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `%26t=${limit}%26sk=${skip}`;
      }

      console.log('Generated query params:', queryParams);
      console.log('Conditions:', conditions);

      const response = await api.get(
        `/jobs/get-all-public-job-postings?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error searching jobs with advanced filters:', error);
      throw error;
    }
  },

  async searchJobsWithAdvancedFiltersForUser(
    filters: {
      title?: string;
      category?: string;
      experienceLevel?: string;
      salaryRange?: { min: number; max: number };
      employmentType?: string[];
      educationLevel?: string;
      industry?: string;
      location?: string;
      skills?: string[];
      gender?: string;
      minimumGPA?: number;
      fieldOfStudy?: string;
      positionNumbers?: number;
      paymentType?: string;
    },
    page?: number,
    limit?: number,
  ): Promise<JobsResponse> {
    try {
      // Check if user is logged in
      const storedUser = localStorage.getItem('user');
      const isAuthenticated = !!storedUser;

      let queryParams = '';
      const conditions = ['status:=:Posted']; // Always include Posted status

      // Basic filters
      if (filters.title) {
        conditions.push(`title:LIKE:${filters.title}`);
      }
      if (filters.category) {
        conditions.push(`employmentType:LIKE:${filters.category}`);
      }

      // Advanced filters
      if (filters.experienceLevel) {
        conditions.push(`experienceLevel:LIKE:${filters.experienceLevel}`);
      }
      if (filters.educationLevel) {
        conditions.push(`educationLevel:LIKE:${filters.educationLevel}`);
      }
      if (filters.industry) {
        conditions.push(`industry:LIKE:${filters.industry}`);
      }
      if (filters.location) {
        conditions.push(`location:LIKE:${filters.location}`);
      }
      if (filters.gender && filters.gender !== 'Any') {
        conditions.push(`gender:LIKE:${filters.gender}`);
      }
      if (filters.fieldOfStudy) {
        conditions.push(`fieldOfStudy:LIKE:${filters.fieldOfStudy}`);
      }
      if (filters.paymentType) {
        conditions.push(`paymentType:LIKE:${filters.paymentType}`);
      }

      // Numeric filters
      if (filters.minimumGPA && filters.minimumGPA > 0) {
        conditions.push(`minimumGPA:gte:${filters.minimumGPA}`);
      }
      if (filters.positionNumbers && filters.positionNumbers > 0) {
        conditions.push(`positionNumbers:gte:${filters.positionNumbers}`);
      }

      // Salary range filter - handle min and max separately
      if (filters.salaryRange && filters.salaryRange.min > 0) {
        conditions.push(`salaryRange.min:gte:${filters.salaryRange.min}`);
      }
      if (filters.salaryRange && filters.salaryRange.max > 0) {
        conditions.push(`salaryRange.max:lte:${filters.salaryRange.max}`);
      }

      // Employment type array filter
      if (filters.employmentType && filters.employmentType.length > 0) {
        // For multiple employment types, we need to handle them as separate conditions
        filters.employmentType.forEach((type) => {
          conditions.push(`employmentType:LIKE:${type}`);
        });
      }

      // Skills array filter
      if (filters.skills && filters.skills.length > 0) {
        // For multiple skills, we need to handle them as separate conditions
        filters.skills.forEach((skill) => {
          conditions.push(`skill:LIKE:${skill}`);
        });
      }

      queryParams = `q=w=${conditions.join(',')}`;

      // Add pagination parameters
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryParams += `%26t=${limit}%26sk=${skip}`;
      }

      console.log('Generated query params:', queryParams);
      console.log('Conditions:', conditions);

      const endpoint = isAuthenticated
        ? '/jobs/get-all-tenant-job-postings'
        : '/jobs/get-all-public-job-postings';

      const response = await api.get(`${endpoint}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error(
        'Error searching jobs with advanced filters for user:',
        error,
      );
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

  async getJobIndustryStats(): Promise<any> {
    try {
      const response = await api.get('/jobs/get-job-industry/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching job industry stats:', error);
      throw error;
    }
  },
};
