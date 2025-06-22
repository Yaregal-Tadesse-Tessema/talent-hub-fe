import { api } from '@/config/api';
import { EmployerData, Tenant } from '@/types/employer';

export interface UpdateTenantPayload {
  id: string;
  prefix: string;
  name: string;
  schemaName: string;
  type: string;
  tradeName: string;
  email: string;
  code: string;
  phoneNumber: string;
  address: {
    city: string;
    region: string;
    street: string;
    country: string;
    postalCode: string;
  };
  subscriptionType: string;
  isVerified: boolean;
  tin: string;
  licenseNumber: string;
  registrationNumber: string;
  isActive: boolean;
  status: string;
  logo: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
    bucketName: string;
  };
  companySize: string;
  industry: string;
  organizationType: string;
  selectedCalender: string;
  archiveReason: string;
}

export interface ETradeRegistrationPayload {
  tin: string;
  licenseNumber: string;
}

export interface ManualRegistrationPayload {
  name: string;
  tradeName: string;
  email: string;
  phoneNumber: string;
  tin: string;
  licenseNumber: string;
  registrationNumber: string;
  companySize: string;
  industry: string;
  organizationType: string;
}

export const employerService = {
  async getTenantsByToken(): Promise<EmployerData[]> {
    try {
      const response = await api.get('/tenants/get-tenants/by-token');
      const tenants = response.data;
      // Transform tenants into EmployerData format
      return tenants.map((tenant: Tenant) => ({
        id: tenant.id,
        jobTitle: '',
        lookupId: '',
        status: tenant.status,
        tenantId: tenant.id,
        tenant_Id: tenant.id,
        tenantName: tenant.name,
        tenant: tenant,
        createdAt: tenant.createdAt || '',
        updatedAt: tenant.updatedAt || '',
      }));
    } catch (error) {
      console.error('Error fetching employers:', error);
      throw error;
    }
  },

  async createAccountFromTrade(
    payload: ETradeRegistrationPayload,
  ): Promise<Tenant> {
    try {
      const response = await api.post(
        '/tenants/create-account-from-trade',
        payload,
      );
      return response.data;
    } catch (error) {
      console.error('Error creating account from ETrade:', error);
      throw error;
    }
  },

  async createTenant(payload: ManualRegistrationPayload): Promise<Tenant> {
    try {
      const response = await api.post('/tenants', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  async regenerateToken(
    orgId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await api.post('/auth/regenerate-token', { orgId });
      return response.data;
    } catch (error) {
      console.error('Error regenerating token:', error);
      throw error;
    }
  },

  async updateTenant(payload: UpdateTenantPayload): Promise<Tenant> {
    try {
      const response = await api.put('/tenants', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  },

  async uploadLogo(
    tenantId: string,
    file: File,
  ): Promise<{
    logo: {
      filename: string;
      path: string;
      originalname: string;
      mimetype: string;
      size: number;
      bucketName: string;
    };
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put(
        `/tenants/upload-logo/${tenantId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  async uploadBanner(
    tenantId: string,
    file: File,
  ): Promise<{
    cover: {
      filename: string;
      path: string;
      originalname: string;
      mimetype: string;
      size: number;
      bucketName: string;
    };
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put(
        `/tenants/upload-cover/${tenantId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading banner:', error);
      throw error;
    }
  },
};
