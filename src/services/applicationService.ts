import { api } from '@/config/api';
import { Application } from '@/types/job';

export const applicationService = {
  async createApplication(
    jobId: string,
    userId: string,
    coverLetter: string,
    file: File,
  ): Promise<Application> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('JobPostId', jobId);
      formData.append('coverLetter', coverLetter);

      const response = await api.post(
        '/applications/create-application',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  async fetchProfileCV(cvPath: string): Promise<File> {
    try {
      const response = await api.get(cvPath, {
        responseType: 'blob',
      });

      const blob = response.data;
      return new File([blob], 'profile-cv.pdf', { type: blob.type });
    } catch (error) {
      console.error('Error fetching profile CV:', error);
      throw error;
    }
  },
};
