import { api } from '@/config/api';
import { JobSeekerProfile } from './employee.service';

export interface Address {
  city: string;
  region: string;
  street: string;
  country: string;
  subcity?: string;
  [key: string]: any;
}

export interface MediaFile {
  path: string;
  size: number;
  filename: string;
  mimetype: string;
  bucketName: string;
  originalname?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  industry: string;
  tradeName: string;
  type: string;
  prefix: string;
  licenseNumber: string;
  registrationNumber: string;
  schemaName: string;
  subscriptionType: string;
  tin: string;
  code: string;
  address: Address;
  logo?: MediaFile;
  cover?: MediaFile;
  organizationType?: string | null;
  companySize?: string | null;
  status: string;
  selectedCalender?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  tags?: string[] | null;
}

export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  birthDate?: string | null;
  address?: Address | null;
  profile?: MediaFile;
  resume?: MediaFile;
  coverLetter?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  professionalSummery?: string | null;
  profileHeadLine?: string | null;
  gpa?: number | null;
  highestLevelOfEducation?: string | null;
  industry?: string | null;
  preferredJobLocation?: string | null;
  salaryExpectations?: number | null;
  yearOfExperience?: number | null;
  alertConfiguration?: any[];
  notificationSetting?: any;
  socialMediaLinks?: any;
  softSkills?: string[] | null;
  technicalSkills?: string[] | null;
  aiGeneratedJobFitScore?: number | null;
  isProfilePublic: boolean;
  isResumePublic: boolean;
  password: string;
  status: string;
  tenantId?: string | null;
  telegramUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  educations?: any;
  experiences?: any;
}

export interface MainEntity {
  id: string;
  remark: string;
  organizationId: string;
  tenantId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  tenant: Tenant;
  user: User;
}

// Keep the old interface for backward compatibility but update it to match the new structure
export interface SavedCandidate {
  id: string;
  candidateId: string;
  employerId: string;
  notes?: string;
  tags?: string[];
  savedAt: string;
  candidate: User; // Changed from JobSeekerProfile to User
}

export interface SaveCandidateRequest {
  organizationId: string;
  userId: string;
  remark?: string;
}

export interface UpdateSavedCandidateRequest {
  notes?: string;
  tags?: string[];
}

export const savedCandidatesService = {
  async getSavedCandidates(): Promise<{
    items: SavedCandidate[];
    total?: number;
  }> {
    try {
      const response = await api.get(`/user-tenants?q=i=tenant,user`);

      // Map the MainEntity response to SavedCandidate format
      const mappedItems =
        response.data.items?.map((item: MainEntity) => ({
          id: item.id,
          candidateId: item.userId,
          employerId: item.organizationId,
          notes: item.remark || undefined,
          tags: [], // Tags are not in the current API response
          savedAt: item.createdAt,
          candidate: item.user,
        })) || [];

      return {
        items: mappedItems,
        total: response.data.total,
      };
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
      throw error;
    }
  },

  async saveCandidate(data: SaveCandidateRequest): Promise<SavedCandidate> {
    try {
      const response = await api.post('/user-tenants', data);
      return response.data;
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw error;
    }
  },

  async updateSavedCandidate(
    id: string,
    data: UpdateSavedCandidateRequest,
  ): Promise<SavedCandidate> {
    try {
      const response = await api.put(`/user-tenants/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating saved candidate:', error);
      throw error;
    }
  },

  async deleteSavedCandidate(id: string): Promise<void> {
    try {
      await api.delete(`/user-tenants/${id}`);
    } catch (error) {
      console.error('Error deleting saved candidate:', error);
      throw error;
    }
  },

  async searchSavedCandidates(
    employerId: string,
    searchQuery: string,
  ): Promise<{ items: SavedCandidate[]; total?: number }> {
    try {
      const response = await api.get(
        `/user-tenants?q=w=organizationId:=:${employerId}&i=tenant,user`,
      );

      // Filter the results based on search query
      const filteredItems =
        response.data.items?.filter((item: MainEntity) => {
          const user = item.user;
          const searchLower = searchQuery.toLowerCase();
          return (
            user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.profileHeadLine?.toLowerCase().includes(searchLower)
          );
        }) || [];

      // Map the filtered items to SavedCandidate format
      const mappedItems = filteredItems.map((item: MainEntity) => ({
        id: item.id,
        candidateId: item.userId,
        employerId: item.organizationId,
        notes: item.remark || undefined,
        tags: [], // Tags are not in the current API response
        savedAt: item.createdAt,
        candidate: item.user,
      }));

      return {
        items: mappedItems,
        total: mappedItems.length,
      };
    } catch (error) {
      console.error('Error searching saved candidates:', error);
      throw error;
    }
  },
};
