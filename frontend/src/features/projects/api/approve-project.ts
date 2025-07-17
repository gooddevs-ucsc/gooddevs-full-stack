import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Project } from '@/types/api';

export const approveProject = (
  projectId: string,
): Promise<{ data: Project }> => {
  return api.post(`/projects/${projectId}/approve`);
};

type UseApproveProjectOptions = {
  mutationConfig?: MutationConfig<typeof approveProject>;
};

export const useApproveProject = ({
  mutationConfig,
}: UseApproveProjectOptions = {}) => {
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
    mutationFn: approveProject,
  });
};
