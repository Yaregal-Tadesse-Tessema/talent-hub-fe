import { api } from '@/config/api';

export const notificationService = {
  async getNotificationCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/get-count');
      // Assuming the response is { count: number }
      return response.data.count;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  },
  async getNewNotifications(): Promise<any[]> {
    try {
      const response = await api.get('/notifications/get-new-notifications');
      // Assuming the response is an array of notifications
      return response.data;
    } catch (error) {
      console.error('Error fetching new notifications:', error);
      throw error;
    }
  },
};
