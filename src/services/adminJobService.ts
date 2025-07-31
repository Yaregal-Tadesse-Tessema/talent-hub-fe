import { API_BASE_URL } from '@/config/api';
import { JobPostingData } from '@/types/job';

class AdminJobService {
  private getAuthHeaders(): HeadersInit {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  async createJobPosting(jobData: JobPostingData): Promise<any> {
    try {
      console.log(
        'Sending request to:',
        `${API_BASE_URL}/admin-job-posting/create-job-posting`,
      );
      console.log('Request data:', jobData);

      const response = await fetch(
        `${API_BASE_URL}/admin-job-posting/create-job-posting`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(jobData),
        },
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(
          errorData.message ||
            `Failed to create job posting (${response.status})`,
        );
      }

      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  }

  async getJobPostings(): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin-job-posting/job-postings`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch job postings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job postings:', error);
      throw error;
    }
  }

  async updateJobPosting(
    id: string,
    jobData: Partial<JobPostingData>,
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin-job-posting/update-job-posting/${id}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(jobData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job posting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating job posting:', error);
      throw error;
    }
  }

  async deleteJobPosting(id: string): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin-job-posting/delete-job-posting/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job posting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job posting:', error);
      throw error;
    }
  }
}

export const adminJobService = new AdminJobService();
