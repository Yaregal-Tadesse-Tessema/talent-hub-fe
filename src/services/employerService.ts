import { api } from '@/config/api';
import { EmployerData, Tenant } from '@/types/employer';

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
};
