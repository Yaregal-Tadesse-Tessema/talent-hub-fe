import { api } from '@/config/api';

export interface Message {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
  createdBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedAt: string;
  updatedBy: string | null;

  senderUserId: string | null;
  senderFullName: string;
  senderEmployerId: string;

  receiverUserId: string | null;
  receiverFullName: string | null;
  receiverEmployerId: string | null;

  tenantId: string;
}

export interface SendMessageRequest {
  senderFullName?: string;
  receiverFullName?: string;
  senderEmployerId?: string;
  senderUserId?: string;
  receiverEmployerId?: string;
  receiverUserId?: string;
  content: string;
  applicationId: string;
}

export const messageService = {
  async getMessagesByApplicationId(applicationId: string): Promise<Message[]> {
    try {
      const response = await api.get(
        `/messages?q=w=applicationId:=:${applicationId}`,
      );
      // Return the array of messages if available, otherwise empty array
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.items)) return response.data.items;
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const response = await api.post('/messages', data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};
