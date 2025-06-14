import { api } from '@/config/api';

export const employeeService = {
  async getEmployers(): Promise<any> {
    try {
      const response = await api.get('/user-tenants');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employers:', error);
      throw error;
    }
  },
};
