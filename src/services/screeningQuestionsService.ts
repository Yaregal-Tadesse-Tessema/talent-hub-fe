import { api } from '@/config/api';
import { Application } from '@/types/job';

export const screeningQuestionsService = {
  async getQuestionsByJobId(jobId: string): Promise<any> {
    try {
      const response = await api.get(
        `/pre-screening-questions?q=w=jobPostId:=:${jobId}`,
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching screening questions:', error);
      throw error;
    }
  },
};
