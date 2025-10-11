import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ApplicationStatus } from '@/types/api';

export type UpdateApplicationStatusData = {
  applicationId: string;
  status: ApplicationStatus;
};

export const updateApplicationStatus = ({
  applicationId,
  status,
}: UpdateApplicationStatusData): Promise<void> => {
  if (status === 'APPROVED') {
    return api.put(`/applications/${applicationId}/approve`);
  } else if (status === 'REJECTED') {
    return api.put(`/applications/${applicationId}/reject`);
  } else {
    throw new Error(`Unsupported status: ${status}`);
  }
};

type UseUpdateApplicationStatusOptions = {
  projectId?: string;
  mutationConfig?: MutationConfig<typeof updateApplicationStatus>;
};

export const useUpdateApplicationStatus = ({
  projectId,
  mutationConfig,
}: UseUpdateApplicationStatusOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ['applications', 'project', projectId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateApplicationStatus,
  });
};
