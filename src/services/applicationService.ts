import { api } from '@/config/api';
import { API_URL } from '@/config/constants';

interface FileInfo {
  path: string;
  size: number;
  filename: string;
  mimetype: string;
  bucketName: string;
}

interface JobPost {
  id: string;
  title: string;
  description: string;
  position: string;
  industry: string;
  createdAt: string;
}

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  phone: string;
  gender: string;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  profile: FileInfo | null;
  resume: FileInfo | null;
  // Optional fields
  aiGeneratedJobFitScore?: number | null;
  coverLetter?: string | null;
  educations?: any[] | null;
  experiences?: any[] | null;
  gpa?: number | null;
  highestLevelOfEducation?: string | null;
  industry?: string | null;
  linkedinUrl?: string | null;
  password?: string;
  portfolioUrl?: string | null;
  preferredJobLocation?: string | null;
  professionalSummery?: string | null;
  profileHeadLine?: string | null;
  salaryExpectations?: string | null;
  socialMediaLinks?: any[] | null;
  softSkills?: string[] | null;
  technicalSkills?: string[] | null;
  telegramUserId?: string | null;
  yearOfExperience?: number | null;
}

export interface Application {
  id: string;
  JobPostId: string;
  userId: string | null;
  status: string;
  coverLetter: string;
  cv: FileInfo | null;
  isViewed: boolean;
  applicationInformation: any | null;
  notification: any | null;
  questionaryScore: number | null;
  referenceReason: string | null;
  referralInformation: any | null;
  remark: string | null;
  jobPost: JobPost;
  userInfo: UserInfo;
}

export interface ApplicationsResponse {
  items: Application[];
  total: number;
}

export interface Column {
  id: string;
  title: string;
  appIds: string[];
}

class ApplicationService {
  async getApplicationsByJobId(jobId: string): Promise<ApplicationsResponse> {
    try {
      const response = await api.get(
        `/applications?q=i=JobPost%26%26w=JobPostId:=:${jobId}`,
      );

      if (!response.data) {
        throw new Error('Failed to fetch applications');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

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
  }

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
  }

  async getApplicationsByUserId(
    userId: string,
    limit?: number,
  ): Promise<ApplicationsResponse> {
    try {
      const response = await api.get(
        `/applications?q=i=JobPost%26%26w=userId:=:${userId}${limit ? `&limit=${limit}` : ''}`,
      );

      if (!response.data) {
        throw new Error('Failed to fetch applications');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching applications by user:', error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();
