import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userSettingsApi } from './user-settings-api';

export const userSettingsKeys = {
  all: ['user-settings'] as const,
  profile: () => [...userSettingsKeys.all, 'profile'] as const,
};

// Hook to get current user profile
export const useMyUserProfile = () => {
  return useQuery({
    queryKey: userSettingsKeys.profile(),
    queryFn: userSettingsApi.getMyProfile,
  });
};

// Hook to update user profile
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userSettingsApi.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSettingsKeys.profile() });
      // Also invalidate auth user query if it exists
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
};

// Hook to update password
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: userSettingsApi.updatePassword,
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: userSettingsApi.forgotPassword,
  });
};

// Hook for reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: userSettingsApi.resetPassword,
  });
};
