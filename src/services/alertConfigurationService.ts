import { api } from '@/config/api';

export interface AlertConfiguration {
  id: string;
  salary: string;
  jobTitle: string;
  Position: string;
  address: string;
  tenantsId: string[];
  industry: string;
}

export interface AddAlertConfigurationRequest {
  id: string;
  salary: string;
  jobTitle: string;
  Position: string;
  address: string;
  tenantsId: string[];
  industry: string;
}

export const alertConfigurationService = {
  async addAlertConfiguration(
    data: AddAlertConfigurationRequest,
  ): Promise<AlertConfiguration> {
    try {
      const response = await api.put('/users/add-alert-configuration', data);
      return response.data;
    } catch (error) {
      console.error('Error adding alert configuration:', error);
      throw error;
    }
  },

  async getAlertConfigurations(): Promise<AlertConfiguration[]> {
    try {
      const response = await api.get('/users/alert-configurations');
      return response.data;
    } catch (error) {
      console.error('Error fetching alert configurations:', error);
      throw error;
    }
  },

  async updateAlertConfiguration(
    id: string,
    data: Partial<AlertConfiguration>,
  ): Promise<AlertConfiguration> {
    try {
      const response = await api.put(`/users/alert-configurations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating alert configuration:', error);
      throw error;
    }
  },

  async deleteAlertConfiguration(id: string): Promise<void> {
    try {
      await api.delete(`/users/alert-configurations/${id}`);
    } catch (error) {
      console.error('Error deleting alert configuration:', error);
      throw error;
    }
  },
};
