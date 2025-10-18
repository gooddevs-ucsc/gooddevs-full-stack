import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';

export const updateEmailInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
});

export type UpdateEmailInput = z.infer<typeof updateEmailInputSchema>;

export const updateEmail = ({ data }: { data: UpdateEmailInput }) => {
  return api.patch(`/users/me`, data);
};

type UseUpdateEmailOptions = {
  mutationConfig?: MutationConfig<typeof updateEmail>;
};

export const useUpdateEmail = ({
  mutationConfig,
}: UseUpdateEmailOptions = {}) => {
  const { refetch: refetchUser } = useUser();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateEmail,
  });
};
