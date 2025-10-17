import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '../../../lib/api-client';
import { MutationConfig } from '../../../lib/react-query';

// Update email schema
export const updateEmailInputSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// Update password schema
export const updatePasswordInputSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
});

export type UpdateEmailInput = z.infer<typeof updateEmailInputSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

// API call to update user email
export const updateUserEmail = ({ data }: { data: UpdateEmailInput }) => {
  return api.patch('/users/me', data);
};

// API call to update user password
export const updateUserPassword = ({ data }: { data: UpdatePasswordInput }) => {
  return api.patch('/users/me/password', data);
};

// Hook for updating email
type UseUpdateEmailOptions = {
  mutationConfig?: MutationConfig<typeof updateUserEmail>;
};

export const useUpdateEmail = ({
  mutationConfig,
}: UseUpdateEmailOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate and refetch user data after email update
      queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUserEmail,
  });
};

// Hook for updating password
type UseUpdatePasswordOptions = {
  mutationConfig?: MutationConfig<typeof updateUserPassword>;
};

export const useUpdatePassword = ({
  mutationConfig,
}: UseUpdatePasswordOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUserPassword,
  });
};
