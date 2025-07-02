import { api, API_BASE_URL } from '@/config/api';

export interface SendPasswordResetEmailRequest {
  email: string;
  link: string;
}

export interface SendPasswordResetEmailResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordByEmailRequest {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordByEmailResponse {
  message: string;
  success: boolean;
}

export const userService = {
  async sendPasswordResetEmail(
    data: SendPasswordResetEmailRequest,
  ): Promise<SendPasswordResetEmailResponse> {
    try {
      const response = await api.post('/users/send-password-reset-email', data);
      return response.data;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  async changePasswordByEmail(
    data: ChangePasswordByEmailRequest,
  ): Promise<ChangePasswordByEmailResponse> {
    try {
      const response = await api.post(
        '/users/reset-user-password-by-email',
        data,
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password by email:', error);
      throw error;
    }
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<any> {
    try {
      const response = await api.post('/users/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  async verifyResetToken(token: string): Promise<any> {
    try {
      const response = await api.get(`/users/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      throw error;
    }
  },
};
