import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Project } from '@/types/api';

export const rejectProject = (
  projectId: string,
): Promise<{ data: Project }> => {
  return api.put(`/projects/${projectId}/reject`);
};

type UseRejectProjectOptions = {
  mutationConfig?: MutationConfig<typeof rejectProject>;
};

export const useRejectProject = ({
  mutationConfig,
}: UseRejectProjectOptions = {}) => {
  const { onSuccess, onError, onMutate, ...restConfig } = mutationConfig || {};

  return useMutation({
    onMutate: (...args) => {
      onMutate?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: rejectProject,
  });
};
