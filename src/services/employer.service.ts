import { api } from '@/config/api';

export interface Employer {
  id: string;
  name: string;
  prefix: string;
  tradeName: string;
  email: string;
  phoneNumber: string;
  tin: string;
  schemaName: string;
  status: string;
  subscriptionType: string;
  isActive: boolean;
  isVerified: boolean;
  address: {
    subcity: string;
  };
  code: string;
  companySize: string | null;
  createdAt: string;
  createdBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  industry: string | null;
  licenseNumber: string | null;
  logo: string | null;
  organizationType: string | null;
  registrationNumber: string | null;
  selectedCalender: string | null;
  tenantId: string | null;
  type: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface EmployersResponse {
  total: number;
  items: Employer[];
}

export const employerService = {
  async getEmployers(): Promise<EmployersResponse> {
    try {
      const response = await api.get('/tenants');
      return response.data;
    } catch (error) {
      console.error('Error fetching employers:', error);
      throw error;
    }
  },
};
