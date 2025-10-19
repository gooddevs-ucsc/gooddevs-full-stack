import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const updatePasswordInputSchema = z.object({
  current_password: z.string().min(8, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

export const updatePassword = ({ data }: { data: UpdatePasswordInput }) => {
  return api.patch(`/users/me/password`, data);
};

type UseUpdatePasswordOptions = {
  mutationConfig?: MutationConfig<typeof updatePassword>;
};

export const useUpdatePassword = ({
  mutationConfig,
}: UseUpdatePasswordOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updatePassword,
  });
};
