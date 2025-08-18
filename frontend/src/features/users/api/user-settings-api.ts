import { api } from '@/lib/api-client';

// Types for user settings
export interface UpdateUserProfileRequest {
  full_name?: string;
  email?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

// API functions
export const userSettingsApi = {
  // Get current user profile
  getMyProfile: (): Promise<UserProfile> => {
    return api.get('/users/me');
  },

  // Update user profile (email, full name)
  updateMyProfile: (data: UpdateUserProfileRequest): Promise<UserProfile> => {
    return api.patch('/users/me', data);
  },

  // Update password
  updatePassword: (
    data: UpdatePasswordRequest,
  ): Promise<{ message: string }> => {
    return api.patch('/users/me/password', data);
  },

  // Request password reset
  forgotPassword: (
    data: ForgotPasswordRequest,
  ): Promise<{ message: string }> => {
    return api.post('/password-recovery', data);
  },

  // Reset password with token
  resetPassword: (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return api.post('/reset-password/', data);
  },
};
