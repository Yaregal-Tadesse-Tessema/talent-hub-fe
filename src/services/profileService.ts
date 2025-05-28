import { UserProfile, FileInfo } from '@/types/profile';
import { api } from '@/config/api';

interface ProfileCompleteness {
  percentage: number;
}

class ProfileService {
  async updateProfile(
    userId: string,
    profile: UserProfile,
  ): Promise<UserProfile> {
    const response = await api.put(`/users/${userId}`, profile);
    return response.data;
  }

  async uploadProfileImage(
    userId: string,
    file: File,
  ): Promise<{ profile: FileInfo }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `/users/upload-profile/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  async uploadResume(
    userId: string,
    file: File,
  ): Promise<{ resume: FileInfo }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(
        `/users/upload-resume/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in uploadResume:', error);
      throw error;
    }
  }

  async getProfileCompleteness(userId: string): Promise<ProfileCompleteness> {
    const response = await api.get(`/users/get-profile-completeness/${userId}`);
    return response.data;
  }
}

export const profileService = new ProfileService();
