import { api } from '@/config/api';
import { Profile } from '@/types/cv-builder';

export const cvService = {
  async generateResume(profile: Profile, template = 'EuroPass'): Promise<Blob> {
    try {
      const response = await api.post(
        `/users/generate-cv-in-pdf/${template}`,
        profile,
        {
          responseType: 'blob',
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  async saveDraft(profile: Profile): Promise<void> {
    try {
      await api.post('/users/save-cv-draft', profile);
    } catch (error) {
      console.error('Error saving CV draft:', error);
      throw error;
    }
  },

  async getDrafts(): Promise<Profile[]> {
    try {
      const response = await api.get('/users/cv-drafts');
      return response.data;
    } catch (error) {
      console.error('Error fetching CV drafts:', error);
      throw error;
    }
  },

  async deleteDraft(id: string): Promise<void> {
    try {
      await api.delete(`/users/cv-drafts/${id}`);
    } catch (error) {
      console.error('Error deleting CV draft:', error);
      throw error;
    }
  },
};
