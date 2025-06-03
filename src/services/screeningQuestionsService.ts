import { api } from '@/config/api';
import { Application } from '@/types/job';

export interface ScreeningQuestion {
  id?: string; // Adding id field for edit/delete operations
  jobPostId: string;
  question: string;
  type: string;
  options?: string[];
  isKnockout: boolean;
  isOptional: boolean;
  weight: number;
  booleanAnswer?: boolean;
  selectedOptions?: string[];
  essayAnswer?: string;
  score?: number;
}

interface ApiResponse<T> {
  items: T;
  message?: string;
  status?: number;
}

export const screeningQuestionsService = {
  async getQuestionsByJobId(jobId: string): Promise<ScreeningQuestion[]> {
    try {
      const response = await api.get<ApiResponse<ScreeningQuestion[]>>(
        `/pre-screening-questions?q=w=jobPostId:=:${jobId}`,
      );

      // Ensure we return an array
      if (!response.data) {
        return [];
      }

      // If the response is wrapped in a data property
      const questions = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.items)
          ? response.data.items
          : [];

      return questions;
    } catch (error) {
      console.error('Error fetching screening questions:', error);
      return [];
    }
  },

  async createQuestion(
    question: ScreeningQuestion,
  ): Promise<ScreeningQuestion> {
    try {
      const response = await api.post<ApiResponse<ScreeningQuestion>>(
        '/pre-screening-questions',
        question,
      );
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error creating screening question:', error);
      throw error;
    }
  },

  async updateQuestion(
    question: ScreeningQuestion,
  ): Promise<ScreeningQuestion> {
    try {
      const response = await api.put<ApiResponse<ScreeningQuestion>>(
        `/pre-screening-questions/${question.id}`,
        question,
      );
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error updating screening question:', error);
      throw error;
    }
  },

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      await api.delete(`/pre-screening-questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting screening question:', error);
      throw error;
    }
  },
};
