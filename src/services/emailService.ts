import { api } from '@/config/api';

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const emailService = {
  async sendEmail(data: EmailRequest): Promise<EmailResponse> {
    try {
      const response = await api.post('/email/send-grid', data);
      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error: any) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send email',
      };
    }
  },
};
