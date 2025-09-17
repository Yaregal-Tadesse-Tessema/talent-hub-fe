import { api } from '@/config/api';
import { API_URL } from '@/config/constants';

export type ApplicationStatus = 'PENDING' | 'SELECTED' | 'REJECTED' | 'HIRED';

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
  isProfilePublic?: boolean;
  isResumePublic?: boolean;
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
  tags?: string[];
  jobPost: JobPost;
  userInfo: UserInfo;
  createdAt?: string;
}

export interface ApplicationsResponse {
  items: Application[];
  total: number;
}

export interface Column {
  id: ApplicationStatus;
  title: string;
  appIds: string[];
}

export interface ChangeApplicationStatusRequest {
  id: string;
  status: ApplicationStatus;
}

export interface ApplicationFilters {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  hasCV?: boolean | null;
  hasCoverLetter?: boolean | null;
  isViewed?: boolean | null;
  hasRemark?: boolean | null;
  experienceMin?: string;
  experienceMax?: string;
  education?: string;
  gpaMin?: string;
  gpaMax?: string;
  salaryExpectations?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  industry?: string;
  location?: string;
  appliedFrom?: string;
  appliedTo?: string;
  questionaryScoreMin?: string;
  questionaryScoreMax?: string;
  aiJobFitScoreMin?: string;
  aiJobFitScoreMax?: string;
  tags?: string[];
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

  async searchApplications(
    jobId: string,
    filters: ApplicationFilters,
    page?: number,
    limit?: number,
  ): Promise<ApplicationsResponse> {
    try {
      const conditions = [`JobPostId:=:${jobId}`];

      // Basic filters
      if (filters.name) {
        // Use OR logic for name search across firstName and lastName
        conditions.push(
          `(userInfo.firstName:ILIKE:${filters.name.toLowerCase()},userInfo.lastName:ILIKE:${filters.name.toLowerCase()})`,
        );
      }
      if (filters.email) {
        conditions.push(`userInfo.email:ILIKE:${filters.email.toLowerCase()}`);
      }
      if (filters.phone) {
        conditions.push(`userInfo.phone:ILIKE:${filters.phone.toLowerCase()}`);
      }
      if (filters.status) {
        conditions.push(`status:=:${filters.status}`);
      }

      // Boolean filters
      if (filters.hasCV !== null && filters.hasCV !== undefined) {
        conditions.push(`cv:${filters.hasCV ? '!=' : '='}:null`);
      }
      if (
        filters.hasCoverLetter !== null &&
        filters.hasCoverLetter !== undefined
      ) {
        conditions.push(
          `coverLetter:${filters.hasCoverLetter ? '!=' : '='}:''`,
        );
      }
      if (filters.isViewed !== null && filters.isViewed !== undefined) {
        conditions.push(`isViewed:=:${filters.isViewed}`);
      }
      if (filters.hasRemark !== null && filters.hasRemark !== undefined) {
        conditions.push(`remark:${filters.hasRemark ? '!=' : '='}:null`);
      }

      // Experience range
      if (filters.experienceMin) {
        conditions.push(
          `userInfo.yearOfExperience:>=:${filters.experienceMin}`,
        );
      }
      if (filters.experienceMax) {
        conditions.push(
          `userInfo.yearOfExperience:<=:${filters.experienceMax}`,
        );
      }

      // Education
      if (filters.education) {
        conditions.push(
          `userInfo.highestLevelOfEducation:ILIKE:${filters.education.toLowerCase()}`,
        );
      }

      // GPA range
      if (filters.gpaMin) {
        conditions.push(`userInfo.gpa:>=:${filters.gpaMin}`);
      }
      if (filters.gpaMax) {
        conditions.push(`userInfo.gpa:<=:${filters.gpaMax}`);
      }

      // Salary expectations
      if (filters.salaryExpectations) {
        conditions.push(
          `userInfo.salaryExpectations:ILIKE:${filters.salaryExpectations.toLowerCase()}`,
        );
      }

      // Skills - using OR logic for multiple skills
      if (filters.technicalSkills && filters.technicalSkills.length > 0) {
        const skillConditions = filters.technicalSkills.map(
          (skill) => `userInfo.technicalSkills:ILIKE:${skill.toLowerCase()}`,
        );
        conditions.push(`(${skillConditions.join(',')})`);
      }
      if (filters.softSkills && filters.softSkills.length > 0) {
        const skillConditions = filters.softSkills.map(
          (skill) => `userInfo.softSkills:ILIKE:${skill.toLowerCase()}`,
        );
        conditions.push(`(${skillConditions.join(',')})`);
      }

      // Industry
      if (filters.industry) {
        conditions.push(
          `userInfo.industry:ILIKE:${filters.industry.toLowerCase()}`,
        );
      }

      // Location
      if (filters.location) {
        conditions.push(
          `userInfo.preferredJobLocation:ILIKE:${filters.location.toLowerCase()}`,
        );
      }

      // Date range
      if (filters.appliedFrom) {
        conditions.push(`createdAt:>=:${filters.appliedFrom}`);
      }
      if (filters.appliedTo) {
        conditions.push(`createdAt:<=:${filters.appliedTo}`);
      }

      // Score ranges
      if (filters.questionaryScoreMin) {
        conditions.push(`questionaryScore:>=:${filters.questionaryScoreMin}`);
      }
      if (filters.questionaryScoreMax) {
        conditions.push(`questionaryScore:<=:${filters.questionaryScoreMax}`);
      }
      if (filters.aiJobFitScoreMin) {
        conditions.push(
          `userInfo.aiGeneratedJobFitScore:>=:${filters.aiJobFitScoreMin}`,
        );
      }
      if (filters.aiJobFitScoreMax) {
        conditions.push(
          `userInfo.aiGeneratedJobFitScore:<=:${filters.aiJobFitScoreMax}`,
        );
      }

      // Tags filter - temporarily disabled due to database schema issues
      // The tags field exists in the response but cannot be queried directly
      // TODO: Investigate proper database path for tags field
      // if (filters.tags && filters.tags.length > 0) {
      //   const tagConditions = filters.tags.map(
      //     (tag) => `tags:ILIKE:${tag.toLowerCase()}`,
      //   );
      //   conditions.push(`(${tagConditions.join(',')})`);
      // }

      // Build query string
      let queryParams = `q=i=JobPost%26%26w=${conditions.join(',')}`;

      // Add pagination
      if (page) {
        queryParams += `&page=${page}`;
      }
      if (limit) {
        queryParams += `&limit=${limit}`;
      }

      const response = await api.get(`/applications?${queryParams}`);

      if (!response.data) {
        throw new Error('Failed to fetch filtered applications');
      }

      return response.data;
    } catch (error) {
      console.error('Error searching applications:', error);
      throw error;
    }
  }

  async createApplication(
    jobId: string,
    userData: any,
    coverLetter: string,
    file: File,
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id);
      formData.append('JobPostId', jobId);
      formData.append('coverLetter', coverLetter);
      formData.append('userInfo', JSON.stringify(userData));

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

  async changeApplicationStatus(
    data: ChangeApplicationStatusRequest,
  ): Promise<void> {
    try {
      await api.put('/applications/change-application-status', data);
    } catch (error) {
      console.error('Error changing application status:', error);
      throw error;
    }
  }

  async updateApplicationRemark(
    applicationId: string,
    remark: string,
  ): Promise<void> {
    try {
      await api.put(`/applications/${applicationId}/remark`, { remark });
    } catch (error) {
      console.error('Error updating application remark:', error);
      throw error;
    }
  }

  async updateApplicationTags(application: Application): Promise<void> {
    try {
      await api.put(`/applications/update`, application);
    } catch (error) {
      console.error('Error updating application tags:', error);
      throw error;
    }
  }

  async getApplicationById(applicationId: string): Promise<Application> {
    const response = await api.get(
      `/applications/${applicationId}?q=i=JobPost`,
    );
    return response.data;
  }
}

export const applicationService = new ApplicationService();
