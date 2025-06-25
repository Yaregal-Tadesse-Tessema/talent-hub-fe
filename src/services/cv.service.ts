import { api } from '@/config/api';
import { Profile } from '@/types/cv-builder';
import { profileService } from './profileService';

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

  async saveGeneratedResumeAsDefault(
    userId: string,
    profile: Profile,
    template = 'EuroPass',
  ): Promise<{ resume: any }> {
    try {
      // Generate the PDF blob
      const pdfBlob = await this.generateResume(profile, template);

      // Convert blob to file
      const fileName = `${profile.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Upload the file as the user's default resume
      const result = await profileService.uploadResume(userId, file);

      return result;
    } catch (error) {
      console.error('Error saving generated resume as default:', error);
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
